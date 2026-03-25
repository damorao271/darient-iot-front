// Global support file — runs before every spec
// Add custom commands or global beforeEach hooks here

const API = 'http://localhost:3000'

// Mock /auth/me as admin for all tests so protected routes and
// the IoT Dashboard button are accessible by default.
beforeEach(() => {
  cy.intercept('GET', `${API}/auth/me`, { fixture: 'auth-me-admin.json' }).as('getAuthMe')
})

// Silence uncaught socket.io errors that would otherwise fail tests
// (the dev server may not have a real WebSocket backend in test mode)
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('WebSocket') ||
    err.message.includes('socket') ||
    err.message.includes('io is not defined')
  ) {
    return false
  }
})
