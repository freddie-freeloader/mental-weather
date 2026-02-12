import { useForm } from '@tanstack/react-form'
import { Box, Container, Typography, Paper } from '@mui/material'
import {
  TextFieldComponent,
  NumberFieldComponent,
  SliderFieldComponent,
  TextAreaFieldComponent,
  SubmitButtonComponent,
} from './FormFields'

export default function ExampleForm() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      age: 25,
      moodRating: 0,
      sleepHours: 7.5,
      stressLevel: 0,
      additionalNotes: '',
    },
    onSubmit: async ({ value }) => {
      // Simulate async submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form submitted with values:', value)
      alert(`Form submitted! Check console for details.`)
    },
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Example Form - All Field Types
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This form showcases all reusable form components with validation
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <Box sx={{ mt: 2 }}>
            {/* Text Field Example */}
            <form.Field
              name="fullName"
              validators={{
                onChange: ({ value }) =>
                  value.length < 3 ? 'Name must be at least 3 characters' : undefined,
              }}
            >
              {(field) => (
                <TextFieldComponent
                  field={field}
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                />
              )}
            </form.Field>

            {/* Number Field Example */}
            <form.Field
              name="age"
              validators={{
                onChange: ({ value }) =>
                  value < 0 ? 'Age cannot be negative' :
                  value > 120 ? 'Age must be realistic' : undefined,
              }}
            >
              {(field) => (
                <NumberFieldComponent
                  field={field}
                  label="Age"
                  min={0}
                  max={120}
                  step={1}
                  required
                />
              )}
            </form.Field>

            {/* Slider Field Example - Mood Rating (-5 to 5) */}
            <form.Field name="moodRating">
              {(field) => (
                <SliderFieldComponent
                  field={field}
                  label="Mood Rating"
                  min={-5}
                  max={5}
                  step={1}
                  marks
                />
              )}
            </form.Field>

            {/* Number Field Example - Sleep Hours (decimal) */}
            <form.Field
              name="sleepHours"
              validators={{
                onChange: ({ value }) =>
                  value < 0 ? 'Sleep hours cannot be negative' :
                  value > 24 ? 'Sleep hours cannot exceed 24' : undefined,
              }}
            >
              {(field) => (
                <NumberFieldComponent
                  field={field}
                  label="Sleep Hours"
                  min={0}
                  max={24}
                  step={0.5}
                />
              )}
            </form.Field>

            {/* Slider Field Example - Stress Level (0 to 4) */}
            <form.Field name="stressLevel">
              {(field) => (
                <SliderFieldComponent
                  field={field}
                  label="Stress Level"
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                    { value: 0, label: 'None' },
                    { value: 1, label: 'Low' },
                    { value: 2, label: 'Medium' },
                    { value: 3, label: 'High' },
                    { value: 4, label: 'Extreme' },
                  ]}
                />
              )}
            </form.Field>

            {/* Text Area Example */}
            <form.Field
              name="additionalNotes"
              validators={{
                onChange: ({ value }) =>
                  value.length > 500 ? 'Notes must be less than 500 characters' : undefined,
              }}
            >
              {(field) => (
                <TextAreaFieldComponent
                  field={field}
                  label="Additional Notes"
                  rows={4}
                  placeholder="Enter any additional notes or comments..."
                />
              )}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <SubmitButtonComponent
                  isSubmitting={isSubmitting}
                  canSubmit={canSubmit}
                >
                  Submit Form
                </SubmitButtonComponent>
              )}
            </form.Subscribe>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}
