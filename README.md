# darient-iot-front

React + TypeScript + Tailwind CSS project built with Vite.

## Setup

```bash
npm install
```

## Running the project

### Development mode (hot reload)

```bash
npm run dev
```

Frontend at http://localhost:5173 — ensure the backend is running at http://localhost:3000 for API calls.

### Production mode

**With Docker:** From parent `Darient/` folder: `docker compose up frontend backend`

**Locally:**
```bash
npm run build
npm run preview
```

## Full Docker & run options

See [DOCKER.md](../DOCKER.md) in the parent folder for:

- Running backend and frontend separately or together
- Switching between development and production
- Environment variables and Docker Compose usage
