interface Viewport {
  name: string;
  width: number;
  height: number;
}

describe('Multi-Hotel Comparison', () => {
  const viewports: Viewport[] = Cypress.env('viewports') || [{ name: 'default', width: 1280, height: 720 }]

  viewports.forEach((viewport: Viewport) => {
    describe(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
        cy.clearLocalStorage()
      })

  it('should handle multiple hotels with different currencies', () => {
    // Add hotels with different currencies
    cy.addHotel('Tokyo Hotel', 15000, 8.5, 'JPY')
    cy.addHotel('London Hotel', 120, 7.8, 'GBP') 
    cy.addHotel('New York Hotel', 200, 8.0, 'USD')
    cy.addHotel('Berlin Hotel', 90, 7.5, 'EUR')
    
    // Verify all hotels are displayed (works for both mobile cards and desktop table)
    cy.get('body').should('contain', 'Tokyo Hotel')
    cy.get('body').should('contain', 'London Hotel')
    cy.get('body').should('contain', 'New York Hotel')
    cy.get('body').should('contain', 'Berlin Hotel')
    
    // Verify currency formatting - check existence without visibility constraint
    cy.get('body').should('contain', '15,000.00 JPY')
    cy.get('body').should('contain', '120.00 GBP')
    cy.get('body').should('contain', '200.00 USD')
    cy.get('body').should('contain', '90.00 EUR')
    
    // Verify value scores are calculated correctly
    cy.get('body').should('contain', '0.0833') // Berlin: 7.5/90
    cy.get('body').should('contain', '0.065') // London: 7.8/120
    cy.get('body').should('contain', '0.04') // New York: 8.0/200
    cy.get('body').should('contain', '0.0006') // Tokyo: 8.5/15000
  })

  it('should sort hotels by value score in descending order', () => {
    // Add hotels with known value scores
    cy.addHotel('Best Value', 50, 8.0) // 0.1600
    cy.addHotel('Good Value', 100, 8.0) // 0.0800
    cy.addHotel('Poor Value', 200, 8.0) // 0.0400
    cy.addHotel('Worst Value', 400, 8.0) // 0.0200
    
    // Verify hotels are in correct order
    const expectedOrder = ['Best Value', 'Good Value', 'Poor Value', 'Worst Value']
    
    // Check sorting order based on viewport
    if (viewport.width < 1024) {
      // Mobile viewport - check mobile cards
      cy.get('[data-testid="hotel-card-mobile"]').each(($el, index) => {
        cy.wrap($el).should('contain', expectedOrder[index])
      })
    } else {
      // Desktop viewport - check desktop rows
      cy.get('[data-testid="hotel-row-desktop"]').each(($el, index) => {
        cy.wrap($el).should('contain', expectedOrder[index])
      })
    }
  })

  it('should display statistics for multiple hotels', () => {
    // Add multiple hotels
    cy.addHotel('Hotel A', 100, 8.0)
    cy.addHotel('Hotel B', 150, 7.5)
    cy.addHotel('Hotel C', 200, 9.0)
    
    // Check if statistics section exists
    cy.get('[data-testid="statistics"]').should('be.visible')
    
    // Check Hotels count
    cy.contains('Hotels').should('be.visible')
    cy.get('body').should('contain', '3')
    
    // Check Top Score (Hotel A: 8.0/100 = 0.08)
    cy.contains('Top Score').should('be.visible')
    cy.get('body').should('contain', '0.08')
    
    // Check Lowest Price
    cy.contains('Lowest Price').should('be.visible')
    cy.get('body').should('contain', '100.00 USD')
    
    // Check Highest Rating
    cy.contains('Highest Rating').should('be.visible')
    cy.get('body').should('contain', '9.0')
  })

  it('should handle edge cases with extreme values', () => {
    // Add hotels with edge case values
    cy.addHotel('Expensive Luxury', 10000, 10.0)
    cy.addHotel('Budget Option', 1, 1.0)
    cy.addHotel('Free Stay', 0.01, 5.0) // Minimum price
    
    // Verify all hotels are displayed (works for both mobile cards and desktop table)
    cy.get('body').should('contain', 'Expensive Luxury')
    cy.get('body').should('contain', 'Budget Option')
    cy.get('body').should('contain', 'Free Stay')
    
    // Verify extreme value scores
    cy.get('body').should('contain', '500') // Free Stay: 5.0/0.01
    cy.get('body').should('contain', '1')   // Budget: 1.0/1
    cy.get('body').should('contain', '0.001')   // Luxury: 10.0/10000
  })

  it('should maintain functionality with many hotels', () => {
    // Add 10 hotels to test performance
    const hotels = [
      { name: 'Hotel 1', price: 100, rating: 8.0 },
      { name: 'Hotel 2', price: 120, rating: 7.5 },
      { name: 'Hotel 3', price: 80, rating: 8.5 },
      { name: 'Hotel 4', price: 150, rating: 9.0 },
      { name: 'Hotel 5', price: 90, rating: 7.8 },
      { name: 'Hotel 6', price: 200, rating: 8.2 },
      { name: 'Hotel 7', price: 75, rating: 7.0 },
      { name: 'Hotel 8', price: 180, rating: 8.8 },
      { name: 'Hotel 9', price: 110, rating: 7.2 },
      { name: 'Hotel 10', price: 95, rating: 8.3 }
    ]
    
    hotels.forEach(hotel => {
      cy.addHotel(hotel.name, hotel.price, hotel.rating)
    })
    
    // Verify all hotels are displayed (works for both mobile cards and desktop table)
    hotels.forEach(hotel => {
      cy.get('body').should('contain', hotel.name)
    })
    
    // Verify the page is still responsive - check viewport-appropriate elements
    if (viewport.width < 1024) {
      // Mobile viewport - check mobile cards
      cy.get('[data-testid="hotel-card-mobile"]').should('have.length', 10)
    } else {
      // Desktop viewport - check desktop rows
      cy.get('[data-testid="hotel-row-desktop"]').should('have.length', 10)
    }
    
    // Test that we can still navigate back to add more
    cy.get('[data-testid="add-another-hotel"]').should('be.visible').click()
    cy.url().should('include', '/hotels/add')
  })

  it('should handle decimal precision correctly', () => {
    // Add hotels with values that test decimal precision
    cy.addHotel('Precision Test 1', 33.33, 9.99)
    cy.addHotel('Precision Test 2', 66.67, 5.55)
    cy.addHotel('Precision Test 3', 99.99, 1.11)
    
    // Verify precise value score calculations
    cy.get('body').should('contain', '0.2997') // 9.99/33.33
    cy.get('body').should('contain', '0.0832') // 5.55/66.67
    cy.get('body').should('contain', '0.0111') // 1.11/99.99
  })
    })
  })
})