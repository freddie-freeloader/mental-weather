import { useForm } from "@tanstack/react-form"
import { Box, Typography, Paper, Divider } from "@mui/material"
import {
  NumberFieldComponent,
  SliderFieldComponent,
  TextAreaFieldComponent,
  SubmitButtonComponent
} from "./FormFields"
import { useState, useEffect } from "react"
import { loadToday, saveToday } from "../storage"
import { analyzeEvening } from "./AnimalDisplay"
import { Snackbar, Chip } from "@mui/material"

interface AnimalArchetype {
	name: string
	emoji: string
	description: string
	message: string
	energy: number
	mood: number
	cognitive: number
	social: number
	anxiety: number
}

interface AnimalAnalysisResult {
	animal: AnimalArchetype
	energyScore: number
	moodScore: number
	cognitiveScore: number
	socialScore: number
	anxietyScore: number
	timestamp: string
}

export default function EveningCheckIn() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({
      // Mood & Energy
      averageMood: 0,
      averageEnergy: 0,
      selfWorth: 0,
      stress: 0,
      activityLevel: 0,
      feelingTiredInEvening: 0,

      // Cognitive & Focus
      fatigueDuringDay: 0,
      muchOnSocialMedia: 0,
      feelingCognitivelyImpaired: 0,
      distractible: 0,
      difficultyConcentrating: 0,
      flightOfIdeas: 0,

      // Hobby Project
      programmedHobbyProject: 0,
      hadFunWithHobbyProject: 0,

      // Work
      dailyWorkWasFun: 0,
      dailyWorkWasInteresting: 0,
      overwhelmedByWork: 0,
      hoursWorked: 0,

      // Social
      hoursWithOtherPeople: 0,
      socialIntensity: 0,
      qualityOfSocialTime: 0,
      socialInsecurity: 0,

      // Mental Health
      fearOfGettingManic: 0,
      overallAnxiety: 0,
      selfCare: 0,

      // Physical Health
      hadMigraine: 0,
      hadDejaVu: 0,
      beingSick: 0,
      drankCoffee: 0,

      // Notes
      notes: ""
  })

  useEffect(() => {
    const existing = loadToday<typeof initialValues>("evening")
    if (existing) {
      setInitialValues(existing)
      setSnackbarMessage("Loaded existing report for today")
      setSnackbarOpen(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading...</Typography></Box>
  }

  return (
    <EveningCheckInForm initialValues={initialValues} snackbarOpen={snackbarOpen} snackbarMessage={snackbarMessage} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} />
  )
}

function EveningCheckInForm({ initialValues, snackbarOpen, snackbarMessage, setSnackbarOpen, setSnackbarMessage }: { initialValues: any, snackbarOpen: boolean, snackbarMessage: string, setSnackbarOpen: any, setSnackbarMessage: any }) {
  const [animalResult, setAnimalResult] = useState<AnimalAnalysisResult | null>(null)
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      try {
        saveToday("evening", value)
        setSnackbarMessage("Evening check-in saved")
        setAnimalResult(analyzeEvening(value))
      } catch (error) {
        console.error("Submission error:", error)
        setSnackbarMessage("Failed to save evening check-in")
      }
      setSnackbarOpen(true)
    }
  })

  return (
    <>
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Evening Check-In
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {/* Mood & Energy Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mood & Energy
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="averageMood"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Average Mood"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="averageEnergy"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Average Energy"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="selfWorth"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Self-worth"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="stress"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Stress"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="activityLevel"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Activity level"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="feelingTiredInEvening"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Feeling tired in evening"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Cognitive & Focus Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Cognitive & Focus
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="fatigueDuringDay"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Fatigue during the day"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="muchOnSocialMedia"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Much on social media"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="feelingCognitivelyImpaired"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Feeling cognitively impaired"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="distractible"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Distractible"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="difficultyConcentrating"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Difficulty concentrating"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="flightOfIdeas"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Flight of ideas"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Hobby Project Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hobby Project
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="programmedHobbyProject"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Programmed hobby project (hours, e.g., 4)"
                min={0}
                step={0.5}
              />
            )}
          />

          <form.Field
            name="hadFunWithHobbyProject"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Had fun with hobby project"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Work Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Work
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="dailyWorkWasFun"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Daily work was fun"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="dailyWorkWasInteresting"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Daily work was interesting"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="overwhelmedByWork"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Overwhelmed by work"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="hoursWorked"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Hours worked (e.g., 4)"
                min={0}
                step={0.5}
              />
            )}
          />
        </Paper>

        {/* Social Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Social
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="hoursWithOtherPeople"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Hours with other people (e.g., 2.5)"
                min={0}
                step={0.5}
              />
            )}
          />

          <form.Field
            name="socialIntensity"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Social intensity"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="qualityOfSocialTime"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Quality of social time"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="socialInsecurity"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Social insecurity"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Mental Health Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mental Health
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="fearOfGettingManic"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Fear of getting manic"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="overallAnxiety"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Overall Anxiety"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="selfCare"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Self-care"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Physical Health Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Physical Health
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="hadMigraine"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Had migraine (time, e.g., 13.5 for 1:30pm)"
                min={0}
                max={24}
                step={0.25}
              />
            )}
          />

          <form.Field
            name="hadDejaVu"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Had deja vu (time, e.g., 13.5 for 1:30pm)"
                min={0}
                max={24}
                step={0.25}
              />
            )}
          />

          <form.Field
            name="beingSick"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Being sick (e.g., having a cold)"
                min={0}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="drankCoffee"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Drank coffee (cups)"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />
        </Paper>

        {/* Notes Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="notes"
            children={(field) => (
              <TextAreaFieldComponent
                field={field}
                label="Notes"
                placeholder="Any additional notes for today..."
                rows={4}
              />
            )}
          />
        </Paper>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting
          })}
          children={({ canSubmit, isSubmitting }) => (
            <SubmitButtonComponent
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
            >
              Submit Evening Check-In
            </SubmitButtonComponent>
          )}
        />
      </form>
    </Box>

    {animalResult && (
      <Box sx={{ mt: 3 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Your Animal Archetype Today
            </Typography>
            <Typography variant="h3" component="div">
              {animalResult.animal.emoji}
            </Typography>
            <Typography variant="h6">
              {animalResult.animal.name}
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            {animalResult.animal.message}
          </Typography>
        </Paper>
      </Box>
    )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  )
}

