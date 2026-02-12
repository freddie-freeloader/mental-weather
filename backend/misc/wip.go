package filetools

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

const (
	VERSION     = "1.0.0"
	DATA_DIR    = "/data"
	DATE_FORMAT = time.DateOnly
)

type OpenFileResult interface {
	isOpenFileResult()
}

type FoundFile struct {
	File *os.File
}

func (f FoundFile) isOpenFileResult() {}

type FileMissing struct{}

func (f FileMissing) isOpenFileResult() {}

type FileError struct {
	Err error
}

func (f FileError) isOpenFileResult() {}

func openFile(path string) OpenFileResult {
	file, err := os.Open(path)

	if errors.Is(err, os.ErrNotExist) {
		return FileMissing{}
	}

	if err != nil {
		return FileError{err}
	}

	return FoundFile{file}
}


func getFormattedDate() string {
	timestamp := time.Now().Format(DATE_FORMAT)

	return timestamp
}

func getMorningFilePath() string {
	// Get today's date
	date := getFormattedDate()

	filename := filepath.Join(DATA_DIR, fmt.Sprintf("morning_%s.json", date))

	return filename
}

func getEveningFilePath() string {
	// Get today's date
	date := getFormattedDate()

	filename := filepath.Join(DATA_DIR, fmt.Sprintf("evening_%s.json", date))

	return filename
}

type MorningCheckIn struct{}

type 

func LoadMorningCheckIn() (*MorningCheckIn, error) {
	//
	filepath := getMorningFilePath()

	file, err := os.Open(filepath)

	// Step 2: Ensure the file handle is closed.
	// 'defer' schedules this function call to run just before LoadMorningCheckIn returns.
	// This guarantees cleanup even if the JSON parsing panics or fails.
	defer file.Close()

	// Step 3: Allocation.
	// We allocate a zero-valued struct to hold our data.
	var checkIn MorningCheckIn

	// Step 4: Stream and Decode.
	// We create a Decoder that pulls from the 'file' stream.
	// We call .Decode() passing a POINTER (&) to our struct.
	// Functional Programmer Warning: This MUTATES the struct in place! 😱
	if err := json.NewDecoder(file).Decode(&checkIn); err != nil {
		return nil, fmt.Errorf("failed to parse json: %w", err)
	}

	// Step 5: Return the pointer.
	return &checkIn, nil
}

