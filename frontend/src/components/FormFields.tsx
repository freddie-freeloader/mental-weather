import { TextField, Slider, Button, Box, Typography, CircularProgress } from "@mui/material"
import type { FieldApi } from "@tanstack/react-form"

// Type-safe props for TextField component
interface TextFieldComponentProps {
  field: FieldApi<any, any, any, any, string>
  label: string
  placeholder?: string
  required?: boolean
}

export function TextFieldComponent({
  field,
  label,
  placeholder,
  required = false
}: TextFieldComponentProps) {
  const hasErrors = field.state.meta.errors.length > 0
  const isTouched = field.state.meta.isTouched

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={hasErrors && isTouched}
      helperText={isTouched && hasErrors ? field.state.meta.errors.join(", ") : ""}
      required={required}
      fullWidth
      margin="normal"
    />
  )
}

// Type-safe props for NumberField component
interface NumberFieldComponentProps {
  field: FieldApi<any, any, any, any, number>
  label: string
  min?: number
  max?: number
  step?: number | "any"
  required?: boolean
}

export function NumberFieldComponent({
  field,
  label,
  min,
  max,
  step = "any",
  required = false
}: NumberFieldComponentProps) {
  const hasErrors = field.state.meta.errors.length > 0
  const isTouched = field.state.meta.isTouched

  return (
    <TextField
      label={label}
      type="number"
      value={field.state.value}
      onChange={(e) => {
        const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
        field.handleChange(value)
      }}
      onBlur={field.handleBlur}
      error={hasErrors && isTouched}
      helperText={isTouched && hasErrors ? field.state.meta.errors.join(", ") : ""}
      required={required}
      fullWidth
      margin="normal"
      slotProps={{
        htmlInput: {
          min,
          max,
          step,
        },
      }}
    />
  )
}

// Type-safe props for SliderField component
interface SliderFieldComponentProps {
  field: FieldApi<any, any, any, any, number>
  label: string
  min: number
  max: number
  step?: number
  marks?: boolean | Array<{ value: number; label?: string }>
  required?: boolean
}

export function SliderFieldComponent({
  field,
  label,
  min,
  max,
  step = 1,
  marks = false,
  required = false
}: SliderFieldComponentProps) {
  const hasErrors = field.state.meta.errors.length > 0
  const isTouched = field.state.meta.isTouched

  return (
    <Box sx={{ width: "100%", mt: 3, mb: 2 }}>
      <Typography gutterBottom>
        {label} {required && "*"}: {field.state.value}
      </Typography>
      <Slider
        value={field.state.value}
        onChange={(_, value) => {
          field.handleChange(value as number)
        }}
        onBlur={field.handleBlur}
        min={min}
        max={max}
        step={step}
        marks={marks}
        valueLabelDisplay="auto"
        sx={{
          color: hasErrors && isTouched ? "error.main" : "primary.main",
        }}
      />
      {hasErrors && isTouched && (
        <Typography color="error" variant="caption">
          {field.state.meta.errors.join(", ")}
        </Typography>
      )}
    </Box>
  )
}

// Type-safe props for TextArea component
interface TextAreaFieldComponentProps {
  field: FieldApi<any, any, any, any, string>
  label: string
  rows?: number
  placeholder?: string
  required?: boolean
}

export function TextAreaFieldComponent({
  field,
  label,
  rows = 4,
  placeholder,
  required = false
}: TextAreaFieldComponentProps) {
  const hasErrors = field.state.meta.errors.length > 0
  const isTouched = field.state.meta.isTouched

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={hasErrors && isTouched}
      helperText={isTouched && hasErrors ? field.state.meta.errors.join(", ") : ""}
      required={required}
      fullWidth
      multiline
      rows={rows}
      margin="normal"
    />
  )
}

// Type-safe props for SubmitButton component
interface SubmitButtonComponentProps {
  children: React.ReactNode
  isSubmitting?: boolean
  canSubmit?: boolean
  variant?: "text" | "outlined" | "contained"
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export function SubmitButtonComponent({
  children,
  isSubmitting = false,
  canSubmit = true,
  variant = "contained",
  color = "primary"
}: SubmitButtonComponentProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      color={color}
      disabled={isSubmitting || !canSubmit}
      fullWidth
      sx={{ mt: 2, mb: 2 }}
    >
      {isSubmitting ? <CircularProgress size={24} /> : children}
    </Button>
  )
}

