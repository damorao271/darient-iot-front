const API = 'http://localhost:3000'

describe('Browse Places page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/places*`, { fixture: 'places.json' }).as('getPlaces')
  })

  it('renders the sidebar and page heading', () => {
    cy.visit('/')
    cy.contains('Technical Assesment').should('be.visible')
    cy.contains('Places').should('be.visible')
  })

  it('shows place cards after data loads', () => {
    cy.visit('/')
    cy.wait('@getPlaces')
    cy.get('[data-cy="place-card"]').should('have.length', 2)
    cy.contains('Downtown Hub').should('be.visible')
    cy.contains('West Side Office').should('be.visible')
  })

  it('shows loading skeletons while fetching', () => {
    cy.intercept('GET', `${API}/places*`, (req) => {
      req.reply({ fixture: 'places.json', delay: 800 })
    }).as('slowPlaces')

    cy.visit('/')
    cy.get('.animate-pulse').should('exist')
    cy.wait('@slowPlaces')
    cy.get('[data-cy="place-card"]').should('have.length.at.least', 1)
  })

  it('shows an error alert when the API fails', () => {
    cy.intercept('GET', `${API}/places*`, { statusCode: 500, body: { message: 'Server error' } }).as('failedPlaces')
    cy.visit('/')
    cy.wait('@failedPlaces')
    cy.get('[data-cy="api-error-alert"]').should('be.visible')
  })

  it('retries after an API error', () => {
    // React Query retries on 5xx errors up to 2 times (failureCount < 2),
    // so 3 total requests fail before the error state is shown.
    // Register the success intercept first (lower priority), then the error
    // intercept with times:3 on top (higher priority, expires after 3 uses).
    cy.intercept('GET', `${API}/places*`, { fixture: 'places.json' }).as('placesSuccess')
    cy.intercept({ method: 'GET', url: `${API}/places*`, times: 3 }, {
      statusCode: 500,
      body: { success: false, statusCode: 500, message: 'Server error', error: 'Internal Server Error', timestamp: '', path: '/places' },
    }).as('placesError')

    cy.visit('/')
    cy.get('[data-cy="api-error-alert"]').should('be.visible')
    cy.contains('button', 'Retry').click()
    cy.get('[data-cy="place-card"]').should('have.length', 2)
  })

  it('navigates to Place Spaces on "View Spaces" click', () => {
    cy.visit('/')
    cy.wait('@getPlaces')
    cy.intercept('GET', `${API}/places/place-1/spaces*`, { fixture: 'place-spaces.json' }).as('getSpaces')
    cy.get('[data-cy="place-card"]').first().contains('View Spaces').click()
    cy.url().should('include', '/places/place-1/spaces')
  })

  it('sidebar Locations link navigates to home', () => {
    cy.visit('/places/place-1/spaces')
    cy.intercept('GET', `${API}/places/place-1/spaces*`, { fixture: 'place-spaces.json' })
    cy.contains('a', 'Locations').first().click()
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  })
})
