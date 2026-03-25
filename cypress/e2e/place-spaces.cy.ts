const API = 'http://localhost:3000'

describe('Place Spaces page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/places/place-1/spaces*`, { fixture: 'place-spaces.json' }).as('getSpaces')
    cy.visit('/places/place-1/spaces')
    cy.wait('@getSpaces')
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('shows the place name and space count', () => {
    cy.contains('Downtown Hub — Spaces').should('be.visible')
    cy.contains('2 Spaces').should('be.visible')
  })

  it('renders a card for each space', () => {
    cy.get('[data-cy="space-card"]').should('have.length', 2)
    cy.contains('Boardroom A').should('be.visible')
    cy.contains('Focus Room B').should('be.visible')
  })

  it('space card with reservations shows them', () => {
    cy.contains('Focus Room B').closest('[data-cy="space-card"]').within(() => {
      cy.contains('alice@example.com').should('be.visible')
    })
  })

  it('space card without reservations shows No reservations', () => {
    cy.contains('Boardroom A').closest('[data-cy="space-card"]').within(() => {
      cy.contains('No reservations').should('be.visible')
    })
  })

  // ── Create Space modal ─────────────────────────────────────────────────────

  it('opens the Create Space modal when button is clicked', () => {
    cy.get('[data-cy="create-space-btn"]').click()
    cy.contains('Create New Space').should('be.visible')
  })

  it('shows validation errors when submitting an empty create form', () => {
    cy.get('[data-cy="create-space-btn"]').click()
    cy.get('[data-cy="space-form"]').within(() => {
      cy.get('button[type="submit"]').click()
    })
    cy.contains('Required').should('be.visible')
  })

  it('closes the modal when Cancel is clicked', () => {
    cy.get('[data-cy="create-space-btn"]').click()
    cy.contains('Create New Space').should('be.visible')
    cy.contains('button', 'Cancel').click()
    cy.contains('Create New Space').should('not.exist')
  })

  it('successfully creates a space and closes the modal', () => {
    cy.intercept('POST', `${API}/spaces`, { fixture: 'space-created.json' }).as('createSpace')
    cy.intercept('GET', `${API}/places/place-1/spaces*`, { fixture: 'place-spaces.json' }).as('refetchSpaces')

    cy.get('[data-cy="create-space-btn"]').click()
    cy.get('[data-cy="space-form"]').within(() => {
      cy.get('input[name="name"]').type('New Meeting Room')
      cy.get('input[name="capacity"]').clear().type('10')
      cy.get('button[type="submit"]').click()
    })
    cy.wait('@createSpace')
    cy.contains('Create New Space').should('not.exist')
  })

  // ── Edit Space modal ───────────────────────────────────────────────────────

  it('opens Edit Space modal with pre-filled values', () => {
    cy.get('[data-cy="space-card"]').first().find('[aria-label="Edit space"]').click()
    cy.contains('Edit Space').should('be.visible')
    cy.get('input[name="name"]').should('have.value', 'Boardroom A')
    cy.get('input[name="capacity"]').should('have.value', '20')
  })

  // ── Delete Space modal ─────────────────────────────────────────────────────

  it('delete button only appears on spaces without reservations', () => {
    // Boardroom A has no reservations → delete button visible
    cy.contains('Boardroom A').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').should('exist')
    // Focus Room B has reservations → no delete button
    cy.contains('Focus Room B').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').should('not.exist')
  })

  it('opens delete confirmation modal', () => {
    cy.contains('Boardroom A').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').click()
    cy.contains('Delete Space').should('be.visible')
    cy.contains('Are you sure you want to delete the').should('be.visible')
  })

  it('cancels delete and keeps modal closed', () => {
    cy.contains('Boardroom A').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').click()
    cy.contains('Delete Space').should('be.visible')
    cy.get('[data-cy="delete-space-modal"]').within(() => {
      cy.contains('button', 'Cancel').click()
    })
    cy.contains('Delete Space').should('not.exist')
  })

  it('confirms delete, calls API, and closes modal', () => {
    cy.intercept('DELETE', `${API}/spaces/space-1`, { statusCode: 200, body: {} }).as('deleteSpace')
    cy.intercept('GET', `${API}/places/place-1/spaces*`, { fixture: 'place-spaces.json' })

    cy.contains('Boardroom A').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').click()
    cy.get('[data-cy="delete-space-modal"]').within(() => {
      cy.contains('button', 'Delete').click()
    })
    cy.wait('@deleteSpace')
    cy.contains('Delete Space').should('not.exist')
  })

  it('shows error inside delete modal when API fails', () => {
    cy.intercept('DELETE', `${API}/spaces/space-1`, {
      statusCode: 409,
      body: { success: false, statusCode: 409, message: 'Cannot delete space with reservations', error: 'Conflict' },
    }).as('deleteFail')

    cy.contains('Boardroom A').closest('[data-cy="space-card"]').find('[aria-label="Delete space"]').click()
    cy.get('[data-cy="delete-space-modal"]').within(() => {
      cy.contains('button', 'Delete').click()
    })
    cy.wait('@deleteFail')
    cy.get('[data-cy="delete-space-modal"]').find('[role="alert"]').should('be.visible')
    cy.contains('Delete Space').should('be.visible')
  })

  // ── Navigation ─────────────────────────────────────────────────────────────

  it('"See details" link navigates to SpaceDetail', () => {
    cy.intercept('GET', `${API}/spaces/space-1`, { fixture: 'space-detail.json' })
    cy.intercept('GET', `${API}/reservations*`, { fixture: 'reservations.json' })
    cy.contains('Boardroom A').closest('[data-cy="space-card"]').contains('See details').click()
    cy.url().should('include', '/spaces/space-1')
  })
})
