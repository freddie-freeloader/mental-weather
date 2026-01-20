package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// MorningCheckIn represents the data from the morning check-in form
type MorningCheckIn struct {
	SleepQuality          float64 `json:"sleepQuality"`
	SleepHours            float64 `json:"sleepHours"`
	BedTime               float64 `json:"bedTime"`
	WakeUpTime            float64 `json:"wakeUpTime"`
	PromethazineTaken     float64 `json:"promethazineTaken"`
	NoiseWhileSleeping    float64 `json:"noiseWhileSleeping"`
	EarlyWakeUpDueToNoise float64 `json:"earlyWakeUpDueToNoise"`
	EarlyWakeUp           float64 `json:"earlyWakeUp"`
	EasyToGetIntoSleep    float64 `json:"easyToGetIntoSleep"`
	MorningMood           float64 `json:"morningMood"`
	MorningEnergy         float64 `json:"morningEnergy"`
	Weight                float64 `json:"weight"`
	OtherSleepNotes       string  `json:"otherSleepNotes"`
}

// EveningCheckIn represents the data from the evening check-in form
type EveningCheckIn struct {
	AverageMood                float64 `json:"averageMood"`
	AverageEnergy              float64 `json:"averageEnergy"`
	SelfWorth                  float64 `json:"selfWorth"`
	Stress                     float64 `json:"stress"`
	ActivityLevel              float64 `json:"activityLevel"`
	FeelingTiredInEvening      float64 `json:"feelingTiredInEvening"`
	FatigueDuringDay           float64 `json:"fatigueDuringDay"`
	MuchOnSocialMedia          float64 `json:"muchOnSocialMedia"`
	FeelingCognitivelyImpaired float64 `json:"feelingCognitivelyImpaired"`
	Distractible               float64 `json:"distractible"`
	DifficultyConcentrating    float64 `json:"difficultyConcentrating"`
	FlightOfIdeas              float64 `json:"flightOfIdeas"`
	ProgrammedHobbyProject     float64 `json:"programmedHobbyProject"`
	HadFunWithHobbyProject     float64 `json:"hadFunWithHobbyProject"`
	DailyWorkWasFun            float64 `json:"dailyWorkWasFun"`
	DailyWorkWasInteresting    float64 `json:"dailyWorkWasInteresting"`
	OverwhelmedByWork          float64 `json:"overwhelmedByWork"`
	HoursWorked                float64 `json:"hoursWorked"`
	HoursWithOtherPeople       float64 `json:"hoursWithOtherPeople"`
	SocialIntensity            float64 `json:"socialIntensity"`
	QualityOfSocialTime        float64 `json:"qualityOfSocialTime"`
	SocialInsecurity           float64 `json:"socialInsecurity"`
	FearOfGettingManic         float64 `json:"fearOfGettingManic"`
	OverallAnxiety             float64 `json:"overallAnxiety"`
	SelfCare                   float64 `json:"selfCare"`
	HadMigraine                float64 `json:"hadMigraine"`
	HadDejaVu                  float64 `json:"hadDejaVu"`
	BeingSick                  float64 `json:"beingSick"`
	DrankCoffee                float64 `json:"drankCoffee"`
	Notes                      string  `json:"notes"`
}

func main() {
	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()

	// Setup CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Data directory
	dataDir := "./data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		fmt.Printf("Failed to create data directory: %v\n", err)
	}

	// Define a simple GET endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Handle Morning Check-In
	r.POST("/morning-check-in", func(c *gin.Context) {
		var data MorningCheckIn
		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save to file
		timestamp := time.Now().Format("2006-01-02_15-04-05")
		filename := filepath.Join(dataDir, fmt.Sprintf("morning_%s.json", timestamp))

		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal data"})
			return
		}

		if err := os.WriteFile(filename, jsonData, 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Morning check-in saved"})
	})

	// Handle Evening Check-In
	r.POST("/evening-check-in", func(c *gin.Context) {
		var data EveningCheckIn
		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save to file
		timestamp := time.Now().Format("2006-01-02_15-04-05")
		filename := filepath.Join(dataDir, fmt.Sprintf("evening_%s.json", timestamp))

		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal data"})
			return
		}

		if err := os.WriteFile(filename, jsonData, 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Evening check-in saved"})
	})

	// Start server on port 8080 (default)
	r.Run()
}
