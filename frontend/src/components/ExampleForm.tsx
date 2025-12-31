import { formOptions } from '@tanstack/react-form'
import { useAppForm } from './formUtils'

export default function ExampleForm() {
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
