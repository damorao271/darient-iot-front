const API = 'http://localhost:3000'

const TODAY = new Date()
const FUTURE_DATE = new Date(TODAY)
FUTURE_DATE.setDate(TODAY.getDate() + 7)
const FUTURE_DATE_STR = FUTURE_DATE.toISOString().split('T')[0]

describe('Space Detail page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/spaces/space-1`, {
      fixture: 'space-detail.json',
    }).as('getSpace')
    cy.intercept('GET', `${API}/reservations*`, {
      fixture: 'reservations.json',
    }).as('getReservations')
    cy.visit('/spaces/space-1')
    cy.wait('@getSpace')
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders space name, capacity and IoT Dashboard link', () => {
    cy.contains('Boardroom A').should('be.visible')
    cy.contains('20 Capacity').should('be.visible')
    cy.contains('IoT Dashboard').should('be.visible')
  })

  it('renders breadcrumb with place name', () => {
    cy.contains('Downtown Hub').should('be.visible')
    cy.contains('REF-001').should('be.visible')
  })

  it('IoT Dashboard button navigates to IoT page', () => {
    cy.intercept('GET', `${API}/spaces/space-1/telemetry*`, {
      fixture: 'iot-telemetry.json',
    })
    cy.intercept('GET', `${API}/spaces/space-1/alerts*`, {
      fixture: 'iot-alerts.json',
    })
    cy.intercept('GET', `${API}/spaces/space-1/device`, {
      fixture: 'iot-device-twin.json',
    })
    cy.contains('IoT Dashboard').click()
    cy.url().should('include', '/spaces/space-1/iot')
  })

  // ── Create Reservation form ────────────────────────────────────────────────

  it('shows Create Reservation form', () => {
    cy.contains('Create Reservation').should('be.visible')
    cy.contains('Confirm Booking').should('be.visible')
  })

  it('shows validation errors when submitting empty form', () => {
    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.contains('Confirm Booking').click()
    })
    cy.contains('Invalid email').should('be.visible')
    cy.contains('Required').should('be.visible')
  })

  it('shows invalid email error for bad email input', () => {
    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.get('input[type="email"]').type('not-an-email')
      cy.contains('Confirm Booking').click()
    })
    cy.contains('Invalid email').should('be.visible')
  })

  it('end time select is disabled until start time is chosen', () => {
    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.get('select[name="endTime"]').should('be.disabled')
      cy.get('select[name="startTime"]').select('09:00')
      cy.get('select[name="endTime"]').should('not.be.disabled')
    })
  })

  it('end time only shows options after the selected start time', () => {
    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.get('select[name="startTime"]').select('14:00')
      cy.get('select[name="endTime"]').within(() => {
        // Options before 14:00 must not be present (e.g. 09:00 should not be there)
        cy.get('option[value="09:00"]').should('not.exist')
        // Options after 14:00 must be present
        cy.get('option[value="15:00"]').should('exist')
      })
    })
  })

  it('successfully submits the form and resets it', () => {
    cy.intercept('POST', `${API}/reservations`, {
      fixture: 'reservation-created.json',
    }).as('createReservation')

    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.get('input[type="email"]').type('newuser@example.com')
      cy.get('input[type="date"]').type(FUTURE_DATE_STR)
      cy.get('select[name="startTime"]').select('09:00')
      cy.get('select[name="endTime"]').select('10:00')
      cy.contains('Confirm Booking').click()
    })
    cy.wait('@createReservation')
    // Form resets after success
    cy.get('[data-cy="create-reservation-form"]').within(() => {
      cy.get('input[type="email"]').should('have.value', '')
    })
  })

  // ── Reservations table ─────────────────────────────────────────────────────

  it('renders reservations table rows', () => {
    cy.wait('@getReservations')
    cy.contains('john@example.com').should('be.visible')
    cy.contains('jane@example.com').should('be.visible')
  })

  it('validates email in the reservation filter', () => {
    cy.get('[data-cy="reservation-filter-email"]').type('bad-email')
    cy.get('[data-cy="reservation-filter-search"]').click()
    cy.contains('Enter a valid email address').should('be.visible')
  })

  it('validates date range in the reservation filter', () => {
    cy.get('[data-cy="reservation-filter-from"]').type('2026-04-30')
    cy.get('[data-cy="reservation-filter-to"]').type('2026-04-01')
    cy.get('[data-cy="reservation-filter-search"]').click()
    cy.contains('From date must be before').should('be.visible')
  })

  it('clears the filter and resets inputs', () => {
    cy.get('[data-cy="reservation-filter-email"]').type('test@example.com')
    cy.get('[data-cy="reservation-filter-clear"]').click()
    cy.get('[data-cy="reservation-filter-email"]').should('have.value', '')
  })

  // ── Cancel Reservation modal ───────────────────────────────────────────────

  it('opens the cancel confirmation modal', () => {
    cy.wait('@getReservations')
    cy.get('[data-cy="reservation-row"]')
      .first()
      .find('[data-cy="cancel-reservation-btn"]')
      .click()
    cy.get('[data-cy="cancel-reservation-modal"]').should('be.visible')
  })

  it('closes cancel modal without action', () => {
    cy.wait('@getReservations')
    cy.get('[data-cy="reservation-row"]')
      .first()
      .find('[data-cy="cancel-reservation-btn"]')
      .click()
    cy.get('[data-cy="cancel-reservation-modal"]').within(() => {
      cy.contains('button', 'Cancel').click()
    })
    cy.get('[data-cy="cancel-reservation-modal"]').should('not.exist')
  })

  it('confirms cancellation and closes modal', () => {
    cy.intercept('DELETE', `${API}/reservations/res-1`, {
      statusCode: 200,
      body: {},
    }).as('cancelReservation')
    cy.intercept('GET', `${API}/reservations*`, {
      fixture: 'reservations.json',
    })

    cy.wait('@getReservations')
    cy.get('[data-cy="reservation-row"]')
      .first()
      .find('[data-cy="cancel-reservation-btn"]')
      .click()
    cy.get('[data-cy="cancel-reservation-modal"]').within(() => {
      cy.contains('button', 'Cancel reservation').click()
    })
    cy.wait('@cancelReservation')
    cy.get('[data-cy="cancel-reservation-modal"]').should('not.exist')
  })

  // ── Edit Reservation modal ─────────────────────────────────────────────────

  it('opens the edit reservation modal with current data', () => {
    cy.wait('@getReservations')
    cy.get('[data-cy="reservation-row"]')
      .first()
      .find('[data-cy="edit-reservation-btn"]')
      .click()
    cy.get('[data-cy="edit-reservation-modal"]').should('be.visible')
    cy.get('[data-cy="edit-reservation-modal"]').within(() => {
      cy.get('input[type="email"]').should('have.value', 'john@example.com')
    })
  })
})
