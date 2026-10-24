# Mood Tracker / "Ophelia's Mental Weather Log"

I want to build a mood tracker that is only used by me -- it's called "Ophelia's Mental Weather Log".

## Rough structure

- I need 0 authentication since I will deploy it in a container that is only reachable in my tailnet
- web application, so I can used it from different devices (desktop & mobile)
- persistent storage that I can easily back up & maybe even have versioning (maybe simply a json-file that I can version with git)

## Technologies

- local-first single-page app, no backend
- data persisted in browser `localStorage`
- build with typescript + vite + react + @mui/material + @tanstack/react-form
- static build can be served by any static file server

## Functionality

### Feature 001: Build UI for logging current day

- Two forms:
  - Morning check-in
  - Evening check-in
- Hard coded questions
	- Some are free text fields
	- Some a ranged (todays) -- you can find the current protocol in `./docs/existing_mood_form_markdown.md`

## Tickets

### Ticket 001: Build reusable form components (DONE)

- Use @tanstack/react-form && @mui/material to build reusable form components
  - Field components (with error display)
  - Submit button component
- Consult the @tanstack/react-form documentation for more information & proper usage
- Use everything type safe & don't use `any`
- Check `./docs/existing_mood_form_markdown.md` for needed form field types

- Create example form that show cases all the form components

### Ticket 002: Build UI for logging current day (TODO)

Summary: Build UI for logging current day

- See `./frontend/src/components/ExampleForm.tsx` for reference on how to use the form components
- Build form for morning check-in (based on `./docs/existing_mood_form_markdown.md`)
- Build form for evening check-in (based on `./docs/existing_mood_form_markdown.md`)
- Build UI for testing the forms
