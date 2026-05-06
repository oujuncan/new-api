package model

import (
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestAggregateModelHealthHourlyUsesSliceSuccessRate(t *testing.T) {
	startHour := int64(1767168000)
	endHour := startHour + 24*3600

	resp := AggregateModelHealthHourly([]ModelHealthLogSample{
		{
			CreatedAt:        startHour + 60,
			Type:             LogTypeConsume,
			ModelName:        "gpt-test",
			PromptTokens:     10,
			CompletionTokens: 20,
		},
		{
			CreatedAt:        startHour + 120,
			Type:             LogTypeError,
			ModelName:        "gpt-test",
			PromptTokens:     99,
			CompletionTokens: 99,
		},
		{
			CreatedAt: startHour + 420,
			Type:      LogTypeError,
			ModelName: "gpt-test",
		},
		{
			CreatedAt:        startHour + 3600 + 30,
			Type:             LogTypeConsume,
			ModelName:        "gpt-test",
			PromptTokens:     5,
			CompletionTokens: 7,
		},
		{
			CreatedAt: startHour + 3600 + 30,
			Type:      LogTypeUnknown,
			ModelName: "gpt-test",
		},
		{
			CreatedAt: startHour + 60,
			Type:      LogTypeConsume,
			ModelName: "",
		},
	}, startHour, endHour)

	require.Equal(t, startHour, resp.StartHour)
	require.Equal(t, endHour, resp.EndHour)
	require.Len(t, resp.Rows, 2)

	first := resp.Rows[0]
	require.Equal(t, "gpt-test", first.ModelName)
	require.Equal(t, startHour, first.HourStartTs)
	require.EqualValues(t, 1, first.SuccessRequests)
	require.EqualValues(t, 2, first.ErrorRequests)
	require.EqualValues(t, 3, first.TotalRequests)
	require.EqualValues(t, 1, first.SuccessSlices)
	require.EqualValues(t, 2, first.TotalSlices)
	require.Equal(t, 0.5, first.SuccessRate)
	require.EqualValues(t, 30, first.SuccessTokens)

	second := resp.Rows[1]
	require.Equal(t, startHour+3600, second.HourStartTs)
	require.EqualValues(t, 1, second.SuccessRequests)
	require.EqualValues(t, 0, second.ErrorRequests)
	require.EqualValues(t, 1, second.SuccessSlices)
	require.EqualValues(t, 1, second.TotalSlices)
	require.Equal(t, 1.0, second.SuccessRate)
	require.EqualValues(t, 12, second.SuccessTokens)
}

func TestGetModelHealthHourlyLast24hQueriesLogsWithPortableGormFilters(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	require.NoError(t, db.AutoMigrate(&Log{}))

	oldLogDB := LOG_DB
	oldCache := modelHealthHourlyCache.entry
	LOG_DB = db
	modelHealthHourlyCache.entry = modelHealthCacheEntry{}
	t.Cleanup(func() {
		LOG_DB = oldLogDB
		modelHealthHourlyCache.entry = oldCache
	})

	now := time.Now().Unix()
	endHour := nextHourBoundary(now)
	startHour := endHour - modelHealthWindowHours*modelHealthHourSeconds

	require.NoError(t, db.Create(&[]Log{
		{
			CreatedAt:        startHour + 60,
			Type:             LogTypeConsume,
			ModelName:        "claude-test",
			PromptTokens:     11,
			CompletionTokens: 13,
		},
		{
			CreatedAt: startHour + 600,
			Type:      LogTypeError,
			ModelName: "claude-test",
		},
		{
			CreatedAt: startHour - 60,
			Type:      LogTypeConsume,
			ModelName: "old-model",
		},
		{
			CreatedAt: startHour + 60,
			Type:      LogTypeConsume,
			ModelName: "",
		},
	}).Error)

	resp, err := GetModelHealthHourlyLast24h()
	require.NoError(t, err)
	require.Equal(t, startHour, resp.StartHour)
	require.Equal(t, endHour, resp.EndHour)
	require.Len(t, resp.Rows, 1)
	require.Equal(t, "claude-test", resp.Rows[0].ModelName)
	require.EqualValues(t, 1, resp.Rows[0].SuccessRequests)
	require.EqualValues(t, 1, resp.Rows[0].ErrorRequests)
	require.EqualValues(t, 24, resp.Rows[0].SuccessTokens)
	require.EqualValues(t, 1, resp.Rows[0].SuccessSlices)
	require.EqualValues(t, 2, resp.Rows[0].TotalSlices)
	require.Equal(t, 0.5, resp.Rows[0].SuccessRate)
}
