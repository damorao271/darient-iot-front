# darient-iot-front

React + TypeScript + Tailwind CSS project built with Vite.

## Project setup

```bash
# 1. Copy environment variables
cp .env.example .env
# Open .env and replace the placeholder values with your own

# 2. Install dependencies
npm install
```

## Running the project

### Full stack — frontend + backend + db + mqtt (hot reload)

From the parent `Darient/` directory:

```bash
In the parent directory, run:

# First time or after Dockerfile / package.json changes:
./run.sh down
./run.sh --profile dev up --build

# Subsequent starts (images already built):
./run.sh --profile dev up
# or
make dev
```

| Service               | URL                   |
| --------------------- | --------------------- |
| Frontend (hot reload) | http://localhost:5173 |
| Backend (hot reload)  | http://localhost:3000 |

Code changes in `src/` are reflected immediately.

---

### Frontend only (standalone)

**Locally (fastest):**

```bash
npm run dev
```

Frontend at http://localhost:5173 — ensure the backend is running at http://localhost:3000.

### Production mode

**With Docker (parent compose):**

From `Darient/`:

```bash
./run.sh --profile prod up --build
# or
make prod
```

Frontend is built and served via nginx at http://localhost:80.

**Locally (preview):**

```bash
npm run build
npm run preview
```

---

## E2E Tests (Cypress)

The frontend has end-to-end tests covering the main flows. The dev server must be running at `http://localhost:5173` before executing the tests.

### Run all tests headlessly

```bash
npm run dev        # in one terminal, keep this running
npm run cy:run     # in another terminal
```

### Run a specific spec file

```bash
npx cypress run --spec "cypress/e2e/space-detail.cy.ts"
```

Available spec files:

| Spec file | What it tests |
| --- | --- |
| `cypress/e2e/browse-places.cy.ts` | Browsing the list of places |
| `cypress/e2e/place-spaces.cy.ts` | Listing and managing spaces inside a place |
| `cypress/e2e/space-detail.cy.ts` | Space detail view and reservations |
| `cypress/e2e/iot-dashboard.cy.ts` | IoT dashboard (telemetry, alerts, device twin) |

### Open the interactive Cypress UI

```bash
npm run cy:open
```

This launches the Cypress Test Runner where you can select and run individual tests with a live browser.

---

## Full Docker & run options

See [DOCKER.md](../DOCKER.md) in the parent folder for:

- Running frontend, backend, and IoT simulator separately or together
- Switching between development (hot reload) and production modes
- Environment variables reference and port summary
