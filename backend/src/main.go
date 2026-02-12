package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

const (
	VERSION  = "1.0.0"
	DATA_DIR = "/data"
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

type VersionedData[T any] struct {
	Version string `json:"version"`
	Data    T      `json:"data"`
}

func main() {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(corsMiddleware)

	if err := os.MkdirAll(DATA_DIR, 0755); err != nil {
		fmt.Printf("Failed to create data directory: %v\n", err)
	}

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "pong"})
	})

	// Handle Morning Check-In
	r.Post("/morning-check-in", handleMorningCheckIn)

	// Handle Evening Check-In
	r.Post("/evening-check-in", handleEveningCheckIn)

	fmt.Println("Server starting on :8080")
	http.ListenAndServe(":8080", r)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "43200") // 12 hours

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func handleMorningCheckIn(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Morning Check-In received")

	var data MorningCheckIn
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	versionedData := VersionedData[MorningCheckIn]{
		Version: VERSION,
		Data:    data,
	}

	timestamp := time.Now().Format("2006-01-02")
	filename := filepath.Join(DATA_DIR, fmt.Sprintf("morning_%s.json", timestamp))

	saveData(w, filename, versionedData, "Morning check-in saved")
}

func handleEveningCheckIn(w http.ResponseWriter, r *http.Request) {
	var data EveningCheckIn
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	versionedData := VersionedData[EveningCheckIn]{
		Version: VERSION,
		Data:    data,
	}

	timestamp := time.Now().Format("2006-01-02")
	filename := filepath.Join(DATA_DIR, fmt.Sprintf("evening_%s.json", timestamp))

	saveData(w, filename, versionedData, "Evening check-in saved")
}

func saveData[T any](w http.ResponseWriter, filename string, data VersionedData[T], successMsg string) {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		http.Error(w, `{"error": "Failed to marshal data"}`, http.StatusInternalServerError)
		return
	}

	if err := os.WriteFile(filename, jsonData, 0644); err != nil {
		http.Error(w, `{"error": "Failed to save data"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": successMsg,
	})
}
