import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Container, TextField, Typography } from '@mui/material';
import { createFormHook, createFormHookContexts, formOptions } from '@tanstack/react-form';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h1">Hello World</Typography>
        <FormExample />
      </Container>
    </ThemeProvider>
  );
}

const { fieldContext, formContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
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

function FormExample() {
  const exampleFormOptions = formOptions({
    defaultValues: {
      name: '',
      age: 0,
    },
  })
  const exampleForm = useAppForm({
    ...formOptions,
    ...exampleFormOptions,
    onSubmit: ({ value: { name, age } }) => {
      console.log(name, age)
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        exampleForm.handleSubmit()
      }}
    >
      <h1>Personal Information</h1>
      {/* Components are bound to `form` and `field` to ensure extreme type safety */}
      {/* Use `form.AppField` to render a component bound to a single field */}
      <exampleForm.AppField
        name="name"
        children={(field) => <field.TextField label="Full Name" />}
      />
      {/* The "name" property will throw a TypeScript error if typo'd  */}
      <exampleForm.AppField
        name="age"
        children={(field) => <field.NumberField label="Age" />}
      />
      {/* Components in `form.AppForm` have access to the form context */}
      <exampleForm.AppForm>
        <exampleForm.Button type="submit">Submit</exampleForm.Button>
      </exampleForm.AppForm>
    </form>)
}
