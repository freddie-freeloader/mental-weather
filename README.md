# Ophelia's Mental Weather Log

A full-stack application for tracking daily mental health metrics, including sleep quality, mood, energy, and social interactions.

## Project Structure

- **`backend/`**: Go backend using the Gin framework.
  - **`Dockerfile`**: Docker build configuration for the backend.
  - **`src/main.go`**: Contains the API endpoints for morning and evening check-ins.
  - **`data/`**: Stores submitted form data as plain JSON text files.
  - **`go.mod` / `go.sum`**: Go dependency management.

- **`frontend/`**: React frontend built with Vite, TypeScript, and Material UI.
  - **`Dockerfile`**: Docker build configuration for the frontend (served via Nginx).
  - **`nginx.conf`**: Nginx configuration for serving static files and reverse-proxying API requests.
  - **`src/components/`**: Reusable and specific form components:
    - `MorningCheckIn.tsx`: Form for morning sleep and mood tracking.
    - `EveningCheckIn.tsx`: Form for daily activity, social, and mental health tracking.
    - `FormFields.tsx` / `MuiNumberField.tsx`: Shared UI components for form inputs.
  - **`src/App.tsx`**: Main entry point with tab-based navigation.
  - **`package.json`**: React dependencies and scripts.

- **`docs/`**: Project documentation and requirements.
  - `project_description.md`: Overview of the app's purpose and features.
  - `existing_mood_form_markdown.md`: Reference for form fields.

- **`docker-compose.yml`**: Definition of the multi-container application (Backend, Frontend, Tailscale).

## Getting Started

### Local Development

1.  **Backend**: `cd backend && go run src/main.go` (runs on port 8080).
2.  **Frontend**: `cd frontend && npm install && npm run dev` (runs on port 5173).
    *Note: The frontend now uses relative API paths (`/api/...`). For local development without Nginx, you may need to configure a proxy in `vite.config.ts`.*

### Docker Deployment

The application is containerized and configured to run securely within a Tailscale network.

1.  **Run with Docker Compose**:
    ```bash
    TS_AUTHKEY=tskey-auth-your-key... docker-compose up -d
    ```
    Replace `tskey-auth-your-key...` with your actual Tailscale authentication key.

2.  **Access**:
    The application will be accessible via the Tailscale machine name defined in `docker-compose.yml` (default: `http://ophelia-weather`) on your tailnet.