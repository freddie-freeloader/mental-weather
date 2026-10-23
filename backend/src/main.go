package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"math"
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

// AnimalArchetype represents a mental state animal with neuro-affirmative messaging
type AnimalArchetype struct {
	Name        string  `json:"name"`
	Emoji       string  `json:"emoji"`
	Energy      float64 `json:"energy"`      // -5 to 5
	Mood        float64 `json:"mood"`        // -5 to 5
	Cognitive   float64 `json:"cognitive"`   // -5 to 5
	Social      float64 `json:"social"`      // -5 to 5
	Anxiety     float64 `json:"anxiety"`     // 0 to 10
	Description string  `json:"description"`
	Message     string  `json:"message"`
}

// AnimalAnalysisResult contains the analysis result with scores and matched animal
// type AnimalAnalysisResult struct {
// 	Animal      AnimalArchetype `json:"animal"`
// 	EnergyScore float64         `json:"energyScore"`
// 	MoodScore   float64         `json:"moodScore"`
// 	CognitiveScore float64      `json:"cognitiveScore"`
// 	SocialScore float64         `json:"socialScore"`
// 	AnxietyScore float64        `json:"anxietyScore"`
// 	Timestamp   string          `json:"timestamp"`
// }

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

// AnimalAnalysisResult contains the analysis result with scores and matched animal
type AnimalAnalysisResult struct {
	Animal       AnimalArchetype `json:"animal"`
	EnergyScore  float64         `json:"energyScore"`
	MoodScore    float64         `json:"moodScore"`
	CognitiveScore float64       `json:"cognitiveScore"`
	SocialScore  float64         `json:"socialScore"`
	AnxietyScore float64         `json:"anxietyScore"`
	Timestamp    string          `json:"timestamp"`
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

	if err := os.MkdirAll(DATA_DIR, 0o755); err != nil {
		fmt.Printf("Failed to create data directory: %v\n", err)
	}

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "pong"})
	})

	// Handle Morning Check-In
	r.Get("/morning-check-in", handleGetMorningCheckIn)
	r.Post("/morning-check-in", handleMorningCheckIn)

	// Handle Evening Check-In
	r.Get("/evening-check-in", handleGetEveningCheckIn)
	r.Post("/evening-check-in", handleEveningCheckIn)

	// Animal analysis endpoint
	r.Get("/animal-analysis", handleGetAnimalAnalysis)
	r.Post("/animal-analysis", handleAnimalAnalysis)

	fmt.Println("Server starting on :8080")
	http.ListenAndServe(":8080", r)
}

// getAnimalArchetypes returns all defined animal archetypes
func getAnimalArchetypes() []AnimalArchetype {
	return []AnimalArchetype{
		{
			Name:        "Dragonfly",
			Emoji:       "🪲",
			Energy:      3.5,
			Mood:        3.0,
			Cognitive:   4.0,
			Social:      2.0,
			Anxiety:     3.0,
			Description: "Iridescent, adaptable, and quick to change direction. Dragonflies see the world from many angles and move with precision and grace.",
			Message:     "Today you are a Dragonfly - your mind is darting between ideas with iridescent clarity. You see patterns others miss. Embrace your ability to shift perspective and adapt quickly. Your mental agility is a superpower.",
		},
		{
			Name:        "Owl",
			Emoji:       "🦉",
			Energy:      -1.0,
			Mood:        3.5,
			Cognitive:   4.5,
			Social:      -1.0,
			Anxiety:     2.0,
			Description: "Wise, observant, and calm. Owls see what others cannot in the dark. They are patient and deliberate.",
			Message:     "Today you are an Owl - wise, observant, and deeply thoughtful. You see patterns and truths that elude others. Your quiet reflection is valuable. Trust your insights and the clarity that comes from stillness.",
		},
		{
			Name:        "Cheetah",
			Emoji:       "🐆",
			Energy:      4.5,
			Mood:        3.5,
			Cognitive:   3.0,
			Social:      -0.5,
			Anxiety:     2.0,
			Description: "Fast, focused, and in flow. Cheetahs sprint with incredible intensity and precision.",
			Message:     "Today you are a Cheetah - in a high-speed flow state. Channel this focused energy into what matters most. Remember that even cheetahs need to rest after their sprint. Honor your need for both speed and recovery.",
		},
		{
			Name:        "Eagle",
			Emoji:       "🦅",
			Energy:      4.0,
			Mood:        4.0,
			Cognitive:   4.5,
			Social:      -1.0,
			Anxiety:     1.0,
			Description: "Visionary, goal-oriented, and sharp. Eagles see the big picture from great heights.",
			Message:     "Today you are an Eagle - seeing the big picture with clarity and focus. Your vision and ability to spot opportunities from afar are gifts. Trust your perspective and soar with confidence.",
		},
		{
			Name:        "Dolphin",
			Emoji:       "🐬",
			Energy:      3.5,
			Mood:        4.0,
			Cognitive:   3.5,
			Social:      4.5,
			Anxiety:     1.5,
			Description: "Playful, social, and intelligent. Dolphins communicate beautifully and move with joy through their world.",
			Message:     "Today you are a Dolphin - playful, social, and full of intelligent energy. Your ability to connect with others and find joy in collaboration is a gift. Ride the waves of your social energy.",
		},
		{
			Name:        "Lion",
			Emoji:       "🦁",
			Energy:      4.5,
			Mood:        4.0,
			Cognitive:   3.5,
			Social:      2.0,
			Anxiety:     1.0,
			Description: "Confident, powerful, and leading. Lions move through their world with natural authority.",
			Message:     "Today you are a Lion - confident, powerful, and naturally leading. Your presence and ability to guide others are gifts. Roar with authenticity and own your space.",
		},
		{
			Name:        "Turtle",
			Emoji:       "🐢",
			Energy:      -2.5,
			Mood:        1.5,
			Cognitive:   2.5,
			Social:      -1.5,
			Anxiety:     1.0,
			Description: "Steady, patient, and grounded. Turtles carry their home with them and move at their own wise pace.",
			Message:     "Today you are a Turtle - steady, patient, and grounded. Your ability to move at your own pace and carry your wisdom with you is a strength. Slow and steady wins the race. Honor your need for stability.",
		},
		{
			Name:        "Sloth",
			Emoji:       "🦥",
			Energy:      -4.0,
			Mood:        -1.5,
			Cognitive:   -1.0,
			Social:      -2.0,
			Anxiety:     0.5,
			Description: "Slow, resting, and conserving. Sloths are masters of energy conservation and wisdom in stillness.",
			Message:     "Today you are a Sloth - your body and mind are asking for rest. Sloths are masters of energy conservation. This is a valid and necessary state. Honor what your nervous system needs. Rest is productive.",
		},
		{
			Name:        "Koala",
			Emoji:       "🐨",
			Energy:      -3.0,
			Mood:        0.0,
			Cognitive:   -1.5,
			Social:      -1.0,
			Anxiety:     1.0,
			Description: "Sleepy, low energy, and cozy. Koalas conserve energy and find comfort in rest.",
			Message:     "Today you are a Koala - sleepy, cozy, and conserving energy. Your need for rest is natural and wise. Koalas know when to slow down and recharge. Listen to your body's wisdom.",
		},
		{
			Name:        "Rabbit",
			Emoji:       "🐇",
			Energy:      1.5,
			Mood:        -2.0,
			Cognitive:   -2.0,
			Social:      -1.0,
			Anxiety:     8.0,
			Description: "Jumpy, anxious, and vigilant. Rabbits are quick to respond and always aware of their surroundings.",
			Message:     "Today you are a Rabbit - alert, vigilant, and perhaps feeling a bit jumpy. Your sensitivity to your environment is a survival skill. Be gentle with yourself. It's okay to feel on edge sometimes. Ground yourself when you can.",
		},
		{
			Name:        "Squirrel",
			Emoji:       "🐿️",
			Energy:      3.0,
			Mood:        0.5,
			Cognitive:   -2.0,
			Social:      -0.5,
			Anxiety:     7.0,
			Description: "Scattered, busy, and distracted. Squirrels gather many things at once and are always preparing.",
			Message:     "Today you are a Squirrel - busy, scattered, and gathering many things at once. Your ability to multitask and prepare is a skill. Try to focus on one acorn at a time. Your mind works in beautiful, complex ways.",
		},
		{
			Name:        "Spider",
			Emoji:       "🕷️",
			Energy:      1.5,
			Mood:        2.0,
			Cognitive:   4.5,
			Social:      -1.0,
			Anxiety:     4.0,
			Description: "Creative, weaving connections, and seeing patterns. Spiders create intricate webs of thought.",
			Message:     "Today you are a Spider - weaving intricate connections and seeing patterns others miss. Your creative mind builds beautiful webs of thought. Trust your unique perspective.",
		},
		{
			Name:        "Octopus",
			Emoji:       "🐙",
			Energy:      3.5,
			Mood:        2.5,
			Cognitive:   4.5,
			Social:      1.0,
			Anxiety:     2.0,
			Description: "Multi-tasking, intelligent, and adaptable. Octopuses solve complex problems with many arms.",
			Message:     "Today you are an Octopus - handling multiple streams of thought and action with intelligence. Your ability to multitask and adapt is remarkable. Consider focusing your tentacles on what truly matters.",
		},
		{
			Name:        "Butterfly",
			Emoji:       "🦋",
			Energy:      3.0,
			Mood:        4.0,
			Cognitive:   2.0,
			Social:      4.0,
			Anxiety:     1.5,
			Description: "Social, transforming, and free. Butterflies move through the world with grace and bring joy to others.",
			Message:     "Today you are a Butterfly - social, transforming, and moving through the world with grace. Your ability to connect with others and bring joy is a gift. Embrace your beautiful metamorphosis.",
		},
		{
			Name:        "Snake",
			Emoji:       "🐍",
			Energy:      -1.0,
			Mood:        -1.5,
			Cognitive:   3.5,
			Social:      -2.0,
			Anxiety:     6.0,
			Description: "Introspective, shedding, and renewing. Snakes transform through periods of deep reflection.",
			Message:     "Today you are a Snake - introspective, shedding old patterns, and preparing for renewal. Your periods of withdrawal and reflection are necessary for growth. Trust your process of transformation.",
		},
		{
			Name:        "Fox",
			Emoji:       "🦊",
			Energy:      2.5,
			Mood:        2.5,
			Cognitive:   4.0,
			Social:      -0.5,
			Anxiety:     5.0,
			Description: "Clever, adaptable, and cautious. Foxes navigate their world with intelligence and strategy.",
			Message:     "Today you are a Fox - clever, adaptable, and navigating with intelligence. Your strategic mind and ability to find creative solutions are assets. Trust your instincts.",
		},
		{
			Name:        "Giraffe",
			Emoji:       "🦒",
			Energy:      3.0,
			Mood:        3.5,
			Cognitive:   3.5,
			Social:      2.5,
			Anxiety:     1.0,
			Description: "Gentle, observant, and seeing the big picture. Giraffes have a tall perspective on the world.",
			Message:     "Today you are a Giraffe - seeing the world from a tall perspective with gentleness and clarity. Your ability to see the big picture and remain calm is a gift. Trust your elevated view.",
		},
	}
}

// calculateAnimalScores computes the 5 dimension scores from evening check-in data
func calculateAnimalScores(data EveningCheckIn) (float64, float64, float64, float64, float64) {
	// Energy: average of averageEnergy, feelingTiredInEvening (inverted), fatigueDuringDay (inverted)
	energyScore := (data.AverageEnergy + invertScore(data.FeelingTiredInEvening) + invertScore(data.FatigueDuringDay)) / 3.0

	// Mood: average of averageMood, selfWorth
	moodScore := (data.AverageMood + data.SelfWorth) / 2.0

	// Cognitive: average of feelingCognitivelyImpaired (inverted), difficultyConcentrating (inverted), 
	// flightOfIdeas, distractible (inverted), programmedHobbyProject
	cognitiveScore := (invertScore(data.FeelingCognitivelyImpaired) + 
		invertScore(data.DifficultyConcentrating) + 
		data.FlightOfIdeas + 
		invertScore(data.Distractible) + 
		data.ProgrammedHobbyProject) / 5.0

	// Social: average of hoursWithOtherPeople, qualityOfSocialTime, socialInsecurity (inverted)
	socialScore := (data.HoursWithOtherPeople + data.QualityOfSocialTime + invertScore(data.SocialInsecurity)) / 3.0

	// Anxiety: average of overallAnxiety, stress, fearOfGettingManic, overwhelmedByWork, socialInsecurity
	// Map from 0-4 scale to 0-10 scale
	anxietyScore := (data.OverallAnxiety + data.Stress + data.FearOfGettingManic + data.OverwhelmedByWork + data.SocialInsecurity) / 5.0 * 2.5

	return energyScore, moodScore, cognitiveScore, socialScore, anxietyScore
}

// invertScore inverts a score on a -5 to 5 scale
func invertScore(score float64) float64 {
	return -score
}

// findBestAnimalMatch finds the animal archetype that best matches the given scores
func findBestAnimalMatch(energy, mood, cognitive, social, anxiety float64) AnimalArchetype {
	archetypes := getAnimalArchetypes()
	
	bestMatch := archetypes[0]
	minDistance := math.Inf(1)
	
	for _, animal := range archetypes {
		// Calculate Euclidean distance between the scores and the animal's profile
		distance := math.Sqrt(
			math.Pow(energy-animal.Energy, 2)*0.25 +
			math.Pow(mood-animal.Mood, 2)*0.25 +
			math.Pow(cognitive-animal.Cognitive, 2)*0.20 +
			math.Pow(social-animal.Social, 2)*0.15 +
			math.Pow(anxiety-animal.Anxiety, 2)*0.15,
		)
		
		if distance < minDistance {
			minDistance = distance
			bestMatch = animal
		}
	}
	
	return bestMatch
}

// handleAnimalAnalysis analyzes evening check-in data and returns the matching animal
func handleAnimalAnalysis(w http.ResponseWriter, r *http.Request) {
	var data EveningCheckIn
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	energy, mood, cognitive, social, anxiety := calculateAnimalScores(data)
	animal := findBestAnimalMatch(energy, mood, cognitive, social, anxiety)

	result := AnimalAnalysisResult{
		Animal:       animal,
		EnergyScore:  math.Round(energy*10) / 10,
		MoodScore:    math.Round(mood*10) / 10,
		CognitiveScore: math.Round(cognitive*10) / 10,
		SocialScore:  math.Round(social*10) / 10,
		AnxietyScore: math.Round(anxiety*10) / 10,
		Timestamp:    time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// handleGetAnimalAnalysis returns the animal analysis for today if available
func handleGetAnimalAnalysis(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now().Format("2006-01-02")
	filename := filepath.Join(DATA_DIR, fmt.Sprintf("evening_%s.json", timestamp))

	// Check if evening check-in exists
	if _, err := os.Stat(filename); errors.Is(err, os.ErrNotExist) {
		w.WriteHeader(http.StatusNoContent)
		return
	} else if err != nil {
		http.Error(w, `{"error": "Failed to check file existence"}`, http.StatusInternalServerError)
		return
	}

	// Read the file
	data, err := os.ReadFile(filename)
	if err != nil {
		http.Error(w, `{"error": "Failed to read file"}`, http.StatusInternalServerError)
		return
	}

	var versionedData VersionedData[EveningCheckIn]
	if err := json.Unmarshal(data, &versionedData); err != nil {
		http.Error(w, `{"error": "Failed to parse data"}`, http.StatusInternalServerError)
		return
	}

	// Calculate scores and find animal
	energy, mood, cognitive, social, anxiety := calculateAnimalScores(versionedData.Data)
	animal := findBestAnimalMatch(energy, mood, cognitive, social, anxiety)

	result := AnimalAnalysisResult{
		Animal:       animal,
		EnergyScore:  math.Round(energy*10) / 10,
		MoodScore:    math.Round(mood*10) / 10,
		CognitiveScore: math.Round(cognitive*10) / 10,
		SocialScore:  math.Round(social*10) / 10,
		AnxietyScore: math.Round(anxiety*10) / 10,
		Timestamp:    time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
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

	if err := os.WriteFile(filename, jsonData, 0o644); err != nil {
		http.Error(w, `{"error": "Failed to save data"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": successMsg,
	})
}

func handleGetMorningCheckIn(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now().Format("2006-01-02")
	filename := filepath.Join(DATA_DIR, fmt.Sprintf("morning_%s.json", timestamp))

	serveFileIfExists(w, filename)
}

func handleGetEveningCheckIn(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now().Format("2006-01-02")
	filename := filepath.Join(DATA_DIR, fmt.Sprintf("evening_%s.json", timestamp))

	serveFileIfExists(w, filename)
}

func serveFileIfExists(w http.ResponseWriter, filename string) {
	// TODO: Fix -- this creates a TOCTOU bug
	if _, err := os.Stat(filename); errors.Is(err, os.ErrNotExist) {
		w.WriteHeader(http.StatusNoContent)
		return
	} else if err != nil {
		http.Error(w, `{"error": "Failed to check file existence"}`, http.StatusInternalServerError)
		return
	}

	data, err := os.ReadFile(filename)
	if err != nil {
		http.Error(w, `{"error": "Failed to read file"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
