describe('Hotel Management Journey', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete the main user journey: add hotel and view comparison', () => {
    // Test homepage load
    cy.contains('SakuYado').should('be.visible')
    cy.contains('Find the Best Value Hotels').should('be.visible')
    
    // Navigate to add hotel page
    cy.get('[data-testid="add-hotel-link"]').click()
    cy.url().should('include', '/hotels/add')
    
    // Add first hotel
    cy.addHotel('Tokyo Hotel', 150, 8.5, 'USD')
    
    // Should redirect to compare page
    cy.url().should('include', '/hotels/compare')
    cy.contains('Hotel Comparison').should('be.visible')
    
    // Verify hotel appears in comparison
    cy.contains('Tokyo Hotel').should('be.visible')
    cy.contains('$150.00').should('be.visible')
    cy.contains('8.5').should('be.visible')
    
    // Verify value score calculation (8.5 / 150 = 0.0567)
    cy.contains('0.0567').should('be.visible')
    
    // Add another hotel from the comparison page
    cy.get('[data-testid="add-another-hotel"]').click()
    cy.url().should('include', '/hotels/add')
    
    cy.addHotel('Osaka Hotel', 100, 7.0, 'USD')
    
    // Back to comparison page
    cy.url().should('include', '/hotels/compare')
    
    // Verify both hotels are displayed
    cy.contains('Tokyo Hotel').should('be.visible')
    cy.contains('Osaka Hotel').should('be.visible')
    
    // Verify hotels are sorted by value score (Osaka: 0.07, Tokyo: 0.0567)
    cy.get('[data-testid="hotel-card"]').first().should('contain', 'Osaka Hotel')
    cy.get('[data-testid="hotel-card"]').last().should('contain', 'Tokyo Hotel')
  })

  it('should handle form validation on add hotel page', () => {
    cy.visit('/hotels/add')
    
    // Try to submit empty form
    cy.get('[data-testid="add-hotel-button"]').click()
    
    // Should show validation errors
    cy.contains('Hotel name is required').should('be.visible')
    cy.contains('Price must be greater than 0').should('be.visible')
    cy.contains('Rating must be between 0 and 10').should('be.visible')
    
    // Test invalid price
    cy.get('[data-testid="hotel-name"]').type('Test Hotel')
    cy.get('[data-testid="hotel-price"]').type('-10')
    cy.get('[data-testid="hotel-rating"]').type('5')
    cy.get('[data-testid="add-hotel-button"]').click()
    
    cy.contains('Price must be greater than 0').should('be.visible')
    
    // Test invalid rating
    cy.get('[data-testid="hotel-price"]').clear().type('100')
    cy.get('[data-testid="hotel-rating"]').clear().type('15')
    cy.get('[data-testid="add-hotel-button"]').click()
    
    cy.contains('Rating must be between 0 and 10').should('be.visible')
    
    // Test valid form
    cy.get('[data-testid="hotel-rating"]').clear().type('8.5')
    cy.get('[data-testid="add-hotel-button"]').click()
    
    // Should successfully redirect
    cy.url().should('include', '/hotels/compare')
  })

  it('should persist hotels in localStorage', () => {
    // Add a hotel
    cy.addHotel('Persistent Hotel', 200, 9.0)
    
    // Verify it's in comparison
    cy.contains('Persistent Hotel').should('be.visible')
    
    // Refresh the page
    cy.reload()
    
    // Hotel should still be there
    cy.contains('Persistent Hotel').should('be.visible')
    cy.contains('$200.00').should('be.visible')
    cy.contains('9.0').should('be.visible')
  })

  it('should handle empty state on comparison page', () => {
    cy.visit('/hotels/compare')
    
    // Should show empty state message
    cy.contains('No hotels added yet').should('be.visible')
    cy.get('[data-testid="add-first-hotel"]').should('be.visible')
    
    // Clicking should navigate to add hotel page
    cy.get('[data-testid="add-first-hotel"]').click()
    cy.url().should('include', '/hotels/add')
  })
})