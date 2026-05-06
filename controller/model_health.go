package controller

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
)

func GetPublicModelHealthHourlyLast24h(c *gin.Context) {
	response, err := model.GetModelHealthHourlyLast24h()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, response)
}
