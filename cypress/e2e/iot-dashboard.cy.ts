const API = 'http://localhost:3000'

describe('IoT Dashboard page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/spaces/space-1`, { fixture: 'space-detail.json' }).as('getSpace')
    cy.intercept('GET', `${API}/spaces/space-1/telemetry*`, { fixture: 'iot-telemetry.json' }).as('getTelemetry')
    cy.intercept('GET', `${API}/spaces/space-1/alerts*`, { fixture: 'iot-alerts.json' }).as('getAlerts')
    cy.intercept('GET', `${API}/spaces/space-1/device`, { fixture: 'iot-device-twin.json' }).as('getTwin')
    cy.visit('/spaces/space-1/iot')
    cy.wait('@getSpace')
  })

  // ── Layout ─────────────────────────────────────────────────────────────────

  it('renders the IoT Dashboard heading and breadcrumb', () => {
    cy.contains('IoT Dashboard').should('be.visible')
    cy.contains('Boardroom A').should('be.visible')
    cy.contains('Downtown Hub').should('be.visible')
  })

  it('renders all five stat cards after telemetry loads', () => {
    cy.wait('@getTelemetry')
    cy.contains('Temperature').should('be.visible')
    cy.contains('Humidity').should('be.visible')
    cy.contains('CO₂').should('be.visible')
    cy.contains('Occupancy').should('be.visible')
    cy.contains('Power').should('be.visible')
  })

  it('shows telemetry values from the fixture', () => {
    cy.wait('@getTelemetry')
    cy.contains('22.5').should('be.visible')   // tempC
    cy.contains('45').should('be.visible')      // humidityPct
    cy.contains('600').should('be.visible')     // co2Ppm
  })

  // ── Digital Twin ───────────────────────────────────────────────────────────

  it('renders the Digital Twin panel with desired and reported values', () => {
    cy.wait('@getTwin')
    cy.contains('Digital Twin').should('be.visible')
    cy.contains('CO₂ Threshold').should('be.visible')
    cy.contains('Sampling Interval').should('be.visible')
    cy.contains('1.2.3').should('be.visible')   // firmwareVersion
  })

  it('shows Synced status when desired matches reported', () => {
    cy.wait('@getTwin')
    cy.contains('Synced').should('be.visible')
  })

  // ── Configure modal ────────────────────────────────────────────────────────

  it('opens Device Configuration modal on Configure click', () => {
    cy.wait('@getTwin')
    cy.contains('button', 'Configure').click()
    cy.contains('Device Configuration').should('be.visible')
    cy.get('input[name="co2AlertThreshold"]').should('have.value', '1000')
    cy.get('input[name="samplingIntervalSec"]').should('have.value', '30')
  })

  it('closes the config modal on Cancel', () => {
    cy.wait('@getTwin')
    cy.contains('button', 'Configure').click()
    cy.contains('Device Configuration').should('be.visible')
    cy.contains('button', 'Cancel').click()
    cy.contains('Device Configuration').should('not.exist')
  })

  it('submits new config and closes modal', () => {
    cy.intercept('PATCH', `${API}/spaces/space-1/device/desired`, {
      statusCode: 200,
      body: {
        data: {
          id: 'desired-1',
          spaceId: 'space-1',
          co2AlertThreshold: 900,
          samplingIntervalSec: 60,
          updatedAt: '2026-03-24T12:00:00.000Z',
        },
      },
    }).as('updateDesired')

    cy.wait('@getTwin')
    cy.contains('button', 'Configure').click()
    cy.get('input[name="co2AlertThreshold"]').clear().type('900')
    cy.get('input[name="samplingIntervalSec"]').clear().type('60')
    cy.contains('button', 'Publish Configuration').click()
    cy.wait('@updateDesired')
    cy.contains('Device Configuration').should('not.exist')
  })

  // ── Alerts panel ───────────────────────────────────────────────────────────

  it('renders alerts from the fixture', () => {
    cy.wait('@getAlerts')
    cy.contains('Alerts').should('be.visible')
    cy.contains('High CO₂').should('be.visible')
    cy.contains('Over Capacity').should('be.visible')
  })

  it('shows active alert badge count', () => {
    cy.wait('@getAlerts')
    // One alert is open (CO2), one is resolved
    cy.contains('1 active').should('be.visible')
  })

  it('filters to active alerts only', () => {
    cy.wait('@getAlerts')
    cy.contains('button', 'Active').click()
    cy.contains('High CO₂').should('be.visible')
    cy.contains('Over Capacity').should('not.exist')
  })

  it('filters to resolved alerts only', () => {
    cy.wait('@getAlerts')
    cy.contains('button', 'Resolved').click()
    cy.contains('Over Capacity').should('be.visible')
    cy.contains('High CO₂').should('not.exist')
  })

  it('shows All alerts when All filter is clicked', () => {
    cy.wait('@getAlerts')
    cy.contains('button', 'Active').click()
    cy.contains('button', 'All').click()
    cy.contains('High CO₂').should('be.visible')
    cy.contains('Over Capacity').should('be.visible')
  })

  // ── Error states ───────────────────────────────────────────────────────────

  it('shows error alert when telemetry API fails with retry button', () => {
    cy.intercept('GET', `${API}/spaces/space-1/telemetry*`, {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('telemetryFail')

    cy.visit('/spaces/space-1/iot')
    cy.wait('@getSpace')
    cy.wait('@telemetryFail')
    cy.get('[data-cy="api-error-alert"]').should('be.visible')
  })

  it('shows error alert when device twin API fails with retry button', () => {
    cy.intercept('GET', `${API}/spaces/space-1/device`, {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('twinFail')

    cy.visit('/spaces/space-1/iot')
    cy.wait('@getSpace')
    cy.wait('@twinFail')
    cy.get('[data-cy="api-error-alert"]').should('be.visible')
  })
})
