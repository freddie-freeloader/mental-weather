import { TextField, Button } from "@mui/material"
import { createFormHookContexts, createFormHook } from "@tanstack/react-form"

export const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: TextField,
    NumberField: TextField,
  },
  formComponents: {
    Button: Button,
  },
  fieldContext,
  formContext,
})
