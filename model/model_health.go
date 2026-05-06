package model

import (
	"fmt"
	"sort"
	"sync"
	"time"
)

const (
	modelHealthHourSeconds  = int64(3600)
	modelHealthSliceSeconds = int64(300)
	modelHealthWindowHours  = int64(24)
	modelHealthCacheTTL     = 30 * time.Second
)

type ModelHealthHourlyResponse struct {
	StartHour int64                  `json:"start_hour"`
	EndHour   int64                  `json:"end_hour"`
	Rows      []ModelHealthHourlyRow `json:"rows"`
}

type ModelHealthHourlyRow struct {
	ModelName       string  `json:"model_name"`
	HourStartTs     int64   `json:"hour_start_ts"`
	SuccessRequests int64   `json:"success_requests"`
	ErrorRequests   int64   `json:"error_requests"`
	TotalRequests   int64   `json:"total_requests"`
	SuccessSlices   int64   `json:"success_slices"`
	TotalSlices     int64   `json:"total_slices"`
	SuccessRate     float64 `json:"success_rate"`
	SuccessTokens   int64   `json:"success_tokens"`
}

type ModelHealthLogSample struct {
	CreatedAt        int64  `gorm:"column:created_at"`
	Type             int    `gorm:"column:type"`
	ModelName        string `gorm:"column:model_name"`
	PromptTokens     int    `gorm:"column:prompt_tokens"`
	CompletionTokens int    `gorm:"column:completion_tokens"`
}

type modelHealthSliceAgg struct {
	hasSuccess bool
	hasError   bool
}

type modelHealthRowAgg struct {
	row    ModelHealthHourlyRow
	slices map[int64]*modelHealthSliceAgg
}

type modelHealthCacheEntry struct {
	expiresAt time.Time
	data      ModelHealthHourlyResponse
}

var modelHealthHourlyCache struct {
	sync.RWMutex
	entry modelHealthCacheEntry
}

func GetModelHealthHourlyLast24h() (ModelHealthHourlyResponse, error) {
	now := time.Now()

	modelHealthHourlyCache.RLock()
	if now.Before(modelHealthHourlyCache.entry.expiresAt) {
		cached := modelHealthHourlyCache.entry.data
		modelHealthHourlyCache.RUnlock()
		return cached, nil
	}
	modelHealthHourlyCache.RUnlock()

	endHour := nextHourBoundary(now.Unix())
	startHour := endHour - modelHealthWindowHours*modelHealthHourSeconds

	var samples []ModelHealthLogSample
	err := LOG_DB.Model(&Log{}).
		Select("created_at, type, model_name, prompt_tokens, completion_tokens").
		Where("created_at >= ? AND created_at < ?", startHour, endHour).
		Where("model_name <> ''").
		Where("type IN ?", []int{LogTypeConsume, LogTypeError}).
		Find(&samples).Error
	if err != nil {
		return ModelHealthHourlyResponse{}, fmt.Errorf("failed to query model health logs: %w", err)
	}

	response := AggregateModelHealthHourly(samples, startHour, endHour)

	modelHealthHourlyCache.Lock()
	modelHealthHourlyCache.entry = modelHealthCacheEntry{
		expiresAt: now.Add(modelHealthCacheTTL),
		data:      response,
	}
	modelHealthHourlyCache.Unlock()

	return response, nil
}

func AggregateModelHealthHourly(samples []ModelHealthLogSample, startHour int64, endHour int64) ModelHealthHourlyResponse {
	rowsByKey := make(map[string]*modelHealthRowAgg)

	for _, sample := range samples {
		if sample.ModelName == "" || sample.CreatedAt < startHour || sample.CreatedAt >= endHour {
			continue
		}
		if sample.Type != LogTypeConsume && sample.Type != LogTypeError {
			continue
		}

		hourStart := floorToInterval(sample.CreatedAt, modelHealthHourSeconds)
		sliceStart := floorToInterval(sample.CreatedAt, modelHealthSliceSeconds)
		key := fmt.Sprintf("%s\x00%d", sample.ModelName, hourStart)

		agg, ok := rowsByKey[key]
		if !ok {
			agg = &modelHealthRowAgg{
				row: ModelHealthHourlyRow{
					ModelName:   sample.ModelName,
					HourStartTs: hourStart,
				},
				slices: make(map[int64]*modelHealthSliceAgg),
			}
			rowsByKey[key] = agg
		}

		slice := agg.slices[sliceStart]
		if slice == nil {
			slice = &modelHealthSliceAgg{}
			agg.slices[sliceStart] = slice
		}

		switch sample.Type {
		case LogTypeConsume:
			agg.row.SuccessRequests++
			agg.row.SuccessTokens += int64(sample.PromptTokens + sample.CompletionTokens)
			slice.hasSuccess = true
		case LogTypeError:
			agg.row.ErrorRequests++
			slice.hasError = true
		}
	}

	rows := make([]ModelHealthHourlyRow, 0, len(rowsByKey))
	for _, agg := range rowsByKey {
		for _, slice := range agg.slices {
			if slice.hasSuccess || slice.hasError {
				agg.row.TotalSlices++
			}
			if slice.hasSuccess {
				agg.row.SuccessSlices++
			}
		}
		agg.row.TotalRequests = agg.row.SuccessRequests + agg.row.ErrorRequests
		if agg.row.TotalSlices > 0 {
			agg.row.SuccessRate = float64(agg.row.SuccessSlices) / float64(agg.row.TotalSlices)
		}
		rows = append(rows, agg.row)
	}

	sort.Slice(rows, func(i, j int) bool {
		if rows[i].ModelName == rows[j].ModelName {
			return rows[i].HourStartTs < rows[j].HourStartTs
		}
		return rows[i].ModelName < rows[j].ModelName
	})

	return ModelHealthHourlyResponse{
		StartHour: startHour,
		EndHour:   endHour,
		Rows:      rows,
	}
}

func floorToInterval(ts int64, interval int64) int64 {
	return ts - ts%interval
}

func nextHourBoundary(ts int64) int64 {
	return floorToInterval(ts, modelHealthHourSeconds) + modelHealthHourSeconds
}
