# Professional Report: AI Usage in the Technical Fullstack Assessment

**Darient IoT Frontend – Coworking & IoT Management UI**

**Document purpose:** This report documents how AI was used during development of this technical assessment project, demonstrating professional use as a productivity tool while clarifying that design decisions, UX choices, and integration with the backend contract were led by human judgment.

---

## Models Used

This project was developed using **Cursor AI**. Model selection followed a task-based approach: faster models for routine UI and wiring, stronger models for cross-cutting behavior (auth, real-time IoT, forms, and test design).

| Tier | Typical use |
|------|-------------|
| **Composer / Auto (efficiency)** | ~70% of work: components, hooks, Tailwind layout, API wrappers, Cypress specs, README |
| **Stronger models (reasoning)** | Auth flow (`/auth/me`), protected routes, Socket.io integration, reservation filters & validation, error UX |

*(Exact model names vary by Cursor version; the split above reflects *type* of task, not a single fixed model ID.)*

### Task-oriented examples (illustrative)

| Task area | Deliverables (representative) |
|-----------|--------------------------------|
| App shell & routing | `App.tsx`, `main.tsx`, `BrowserRouter`, route layout |
| Data fetching | TanStack Query hooks: `usePlaces`, `useSpace`, `useReservations`, `usePlaceSpaces` |
| API layer | `api/client.ts`, `api/api.ts`, `api/places.ts`, `api/spaces.ts`, `api/reservations.ts`, `api/iot.ts`, `api/auth.ts` |
| Forms & validation | `react-hook-form` + Zod: `schemas/reservation.schema.ts`, `schemas/space.schema.ts`, `CreateReservationForm`, `SpaceFormModal` |
| IoT UI | `SpaceIoTDashboard.tsx`, `TelemetryPanel`, `AlertsPanel`, `DeviceTwinPanel`, `DesiredConfigModal`, `ConnectionStatus` |
| Real-time | `useIoTSocket.ts`, `useSocket.ts` (Socket.io client) |
| Auth (admin IoT) | `AuthContext.tsx`, `useAuth.ts`, `ProtectedRoute.tsx`, `GET /auth/me` integration |
| Styling | Tailwind CSS v4, shared UI primitives under `components/ui/` |
| E2E tests | Cypress: `browse-places.cy.ts`, `place-spaces.cy.ts`, `space-detail.cy.ts`, `iot-dashboard.cy.ts`, `cypress/support/e2e.ts` |
| Assets & UX polish | `public/places/place-*.png`, `utils/place-image.ts`, `PlaceCard`, `SpaceCard`, `SpaceDetail` hero image |

---

## Design mockup (Google Stitch)

The **basic UI mockup** that served as **visual inspiration** for the pages was produced with **[Google Stitch](https://stitch.withgoogle.com/)** (“Design with AI”), using the assessment requirements as input. Reference project: **[https://stitch.withgoogle.com/projects/4526015576909533545](https://stitch.withgoogle.com/projects/4526015576909533545)**.

The shipped UI (React + Tailwind) **interprets and adapts** that direction; spacing, components, real data wiring, and IoT screens were implemented and iterated in code with Cursor AI and human judgment—not as a one-to-one export from Stitch.

---

## Workflow Summary

| Phase | Focus |
|-------|--------|
| **Phase 1: Scaffolding** | Vite + React + TS, Tailwind, router shell, layout (`AppSidebar`, `AppHeader`) |
| **Phase 2: Core flows** | Places list, place → spaces, space detail, reservations CRUD UI |
| **Phase 3: IoT bonus** | Telemetry, alerts, device twin, desired config, WebSocket subscription |
| **Phase 4: Quality & contract** | Envelope-aware API client, `ApiError`, toasts, Cypress coverage |
| **Phase 5: Access control** | Current user + admin-only IoT route and entry points |

---

## Cursor Modes (Agent, Plan, Ask)

The workflow switched between modes depending on what each task needed:

| Mode | When it was used |
|------|------------------|
| **Agent** | Implementing features, multi-file edits, running build/lint/tests, iterating with tools |
| **Plan** | Optional for larger refactors (routing, auth boundaries, IoT module layout) before touching many files |
| **Ask** | Read-only exploration: explaining code, comparing options, drafting backend prompts (e.g. `/auth/me` contract) without modifying the repo |

This mix kept implementation efficient while reserving **Ask** for understanding and alignment without side effects.

---

## 1. Executive Summary

This repository implements the **Darient Technical Assessment frontend**: a React SPA for browsing places and spaces, managing reservations, and (bonus) operating an IoT dashboard per space. AI was used as a **productivity aid** for boilerplate, UI structure, hooks, and tests—not as the sole source of product or UX decisions.

Evidence of human-led design appears in:

- **Visual direction** inspired by a [Google Stitch](https://stitch.withgoogle.com/) mockup ([project link](https://stitch.withgoogle.com/projects/4526015576909533545)), generated from the requirements; the live app adapts that baseline in React + Tailwind
- **Integration contract** with the backend (envelopes, query params, error handling)
- **Reservation UX** (filters, validation, modals, table behavior)
- **IoT UX** (panels, charts, modals, connection state, Socket.io usage)
- **Access control** (admin-only IoT vs. general user flows)
- **E2E strategy** (Cypress intercepts, fixtures, critical paths)

---

## 2. Assessment Requirements Coverage (Frontend)

| Requirement area | Implementation |
|------------------|----------------|
| Browse places | `BrowsePlaces.tsx`, `PlaceCard.tsx`, `usePlaces`, pagination |
| Spaces per place | `PlaceSpaces.tsx`, `SpaceCard.tsx`, sort/page size, create/edit/delete modals |
| Space detail & reservations | `SpaceDetail.tsx`, `CreateReservationForm`, `ReservationsTable`, filters |
| API integration | Axios instance + Bearer key (`VITE_API_KEY`), typed `client.get/post/...` |
| Validation | Zod schemas + RHF resolvers for forms |
| IoT bonus | `SpaceIoTDashboard.tsx`, telemetry/alerts/device hooks, `useIoTSocket` |
| Testing | Cypress E2E for main flows + global `/auth/me` mock for protected UI |
| Optional: admin IoT gate | `ProtectedRoute`, `SpaceDetail` conditional IoT button, route guard in `App.tsx` |

---

## 3. How AI Was Used (Productivity Role)

### 3.1 Documentation and Syntax

AI assisted with:

- React Router v7 patterns, TanStack Query defaults, Axios interceptors
- Tailwind class composition and responsive layouts
- Cypress `cy.intercept` + fixtures

**Human control:** API shapes (`ApiSuccessEnvelope`, `ApiError`), retry policy (e.g. skip retries on 4xx), and which endpoints the UI calls are aligned with the real backend contract.

### 3.2 Implementation Scaffolding

AI could accelerate:

- Presentational components (cards, tables, modals)
- Hook skeletons (`useQuery` / `useMutation` with `queryKeys`)
- IoT panels and chart wiring

**Human control:** Domain copy, filter semantics (email + date range + sort), and **what** to validate (e.g. end time after start time, email format) reflect assessment intent, not generic templates.

### 3.3 Testing Assistance

AI may have helped with:

- Cypress structure, selectors, fixture JSON
- `beforeEach` intercept patterns

**Human control:** Which flows are critical (browse → space → reservation → IoT), edge cases (API errors, modal flows), and keeping tests stable (e.g. mocking `GET /auth/me` when auth was added) reflect deliberate QA choices.

---

## 4. Where Human Expertise Was Clearly Applied

### 4.1 Architecture and Stack Choices

**Decision:** React + Vite + TypeScript + Tailwind + TanStack Query + React Router.

**Rationale:** Fast dev experience, typed API surface, predictable server-state caching, and a single-page flow suitable for the assessment scope.

### 4.2 API Contract and Errors

**Decision:** Central Axios instance, unwrap success envelopes in `client.ts`, map failures to `ApiError`, user-facing messages via utilities/toasts.

**Evidence of judgment:** The frontend must match backend behavior (status codes, validation messages); this is integration work, not generic React boilerplate.

### 4.3 Reservations & Filters

**Decision:** Client-side filter state vs. applied state, pagination tied to search, email validation before calling the API.

**Evidence of judgment:** Avoids unnecessary requests and matches typical “search” UX expectations.

### 4.4 IoT: Real-Time and Dashboard Composition

**Decision:** Combine REST (initial load) with Socket.io (live updates), expose connection status, separate concerns (telemetry vs. alerts vs. twin vs. desired config).

**Evidence of judgment:** Tradeoffs around loading states, refetch, and user feedback (toasts) are product decisions.

### 4.5 Admin-Only IoT (Feature)

**Decision:** `GET /auth/me` drives role; `ProtectedRoute` guards `/spaces/:spaceId/iot`; non-admins are redirected and do not see the IoT entry CTA.

**Evidence of judgment:** Security is not “UI-only” by assumption—the backend must still enforce authorization; the UI layer reflects role for UX and routing.

### 4.6 Place Imagery

**Decision:** Static assets under `public/places/` with `resolvePlaceCoverSrc` / `getPlaceCoverSrc` + optional `imageUrl` from API later.

**Evidence of judgment:** Consistent visuals across `PlaceCard`, `SpaceCard`, and `SpaceDetail` without hardcoding URLs in every component.

---

## 5. AI Usage Boundaries

| Use case | AI role | Human role |
|----------|---------|------------|
| UI look & feel (baseline) | — | Requirements fed into [Google Stitch](https://stitch.withgoogle.com/); [mockup project](https://stitch.withgoogle.com/projects/4526015576909533545) as inspiration; implementation adapts it |
| Component layout | Drafting JSX + Tailwind | Information hierarchy, spacing, copy |
| Hooks | Query/mutation wiring | Query keys, invalidation, enabled flags |
| IoT UI | Panel structure | Which metrics matter, modal behavior |
| Cypress | Spec skeletons | Fixture data, assertions, stable selectors |
| Auth UI | Route guard + provider | Role model, redirect behavior, backend contract |
| README / docs | Drafting | Accurate commands, env vars, run instructions |

AI was used to **accelerate implementation**; humans set **requirements interpretation**, **UX**, and **API alignment**.

---

## 6. Conclusion

AI was used as a productivity tool for:

- Reducing boilerplate in React components and hooks
- Speeding up Cypress specs and support setup
- Iterating quickly on IoT and reservation UIs

Human expertise drove:

- **Stack and structure** (Vite, React Query, router, Tailwind)
- **Design baseline** (Stitch mockup as requirements-based inspiration; adaptation to real components, routes, and data)
- **Business-aligned UX** (reservations, filters, modals, tables)
- **IoT UX** (dashboard layout, real-time behavior, error states)
- **Auth integration** (role-based IoT access aligned with `/auth/me`)
- **Quality** (E2E coverage, type-safe API usage, consistent error handling)

The project demonstrates **clear ownership** of design and integration, with AI supporting **speed and consistency**, not replacing domain judgment or backend contract discipline.
