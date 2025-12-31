import { useForm } from "@tanstack/react-form"
import { Box, Typography, Paper, Divider } from "@mui/material"
import {
  NumberFieldComponent,
  SliderFieldComponent,
  TextAreaFieldComponent,
  SubmitButtonComponent
} from "./FormFields"

export default function MorningCheckIn() {
  const form = useForm({
    defaultValues: {
      sleepQuality: 0,
      sleepHours: 0,
      bedTime: 0,
      wakeUpTime: 0,
      promethazineTaken: 0,
      noiseWhileSleeping: 0,
      earlyWakeUpDueToNoise: 0,
      earlyWakeUp: 0,
      easyToGetIntoSleep: 0,
      morningMood: 0,
      morningEnergy: 0,
      weight: 0,
      otherSleepNotes: ""
    },
    onSubmit: async ({ value }) => {
      console.log("Morning Check-In Data:", value)
      alert("Morning check-in submitted! Check console for data.")
    }
  })

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Morning Check-In
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {/* Sleep Quality Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sleep Quality
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="sleepQuality"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Sleep Quality"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="easyToGetIntoSleep"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Easy to get into sleep"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="noiseWhileSleeping"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Noise above while sleeping"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="earlyWakeUp"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Early wake-up"
                min={0}
                max={4}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="earlyWakeUpDueToNoise"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Early wake-up due to noise (hours)"
                min={0}
                max={8.5}
                step={0.5}
              />
            )}
          />
        </Paper>

        {/* Sleep Schedule Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sleep Schedule
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="sleepHours"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Sleep hours (e.g., 7.5 or 9.5)"
                min={0}
                max={24}
                step={0.25}
              />
            )}
          />

          <form.Field
            name="bedTime"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Bed time (e.g., 22, 22.5, or 22.25)"
                min={0}
                max={24}
                step={0.25}
              />
            )}
          />

          <form.Field
            name="wakeUpTime"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Wake-up time (e.g., 6, 8.5, or 8.75)"
                min={0}
                max={24}
                step={0.25}
              />
            )}
          />
        </Paper>

        {/* Medication & Physical Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Medication & Physical
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="promethazineTaken"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Promethazine taken (mg, e.g., 25 or 50)"
                min={0}
                step={1}
              />
            )}
          />

          <form.Field
            name="weight"
            children={(field) => (
              <NumberFieldComponent
                field={field}
                label="Weight (kg, e.g., 64)"
                min={0}
                step={0.1}
              />
            )}
          />
        </Paper>

        {/* Morning Mood & Energy Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Morning Mood & Energy
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form.Field
            name="morningMood"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Morning Mood"
                min={-5}
                max={5}
                step={1}
                marks
              />
            )}
          />

          <form.Field
            name="morningEnergy"
            children={(field) => (
              <SliderFieldComponent
                field={field}
                label="Morning Energy"
                min={-5}
                max={5}
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
            name="otherSleepNotes"
            children={(field) => (
              <TextAreaFieldComponent
                field={field}
                label="Other sleep notes"
                placeholder="e.g., had a nightmare, intense dream in the morning"
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
              Submit Morning Check-In
            </SubmitButtonComponent>
          )}
        />
      </form>
    </Box>
  )
}

