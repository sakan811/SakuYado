describe('Multi-Hotel Comparison', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('should handle multiple hotels with different currencies', () => {
    // Add hotels with different currencies
    cy.addHotel('Tokyo Hotel', 15000, 8.5, 'JPY')
    cy.addHotel('London Hotel', 120, 7.8, 'GBP') 
    cy.addHotel('New York Hotel', 200, 8.0, 'USD')
    cy.addHotel('Berlin Hotel', 90, 7.5, 'EUR')
    
    // Verify all hotels are displayed
    cy.contains('Tokyo Hotel').should('be.visible')
    cy.contains('London Hotel').should('be.visible')
    cy.contains('New York Hotel').should('be.visible')
    cy.contains('Berlin Hotel').should('be.visible')
    
    // Verify currency formatting
    cy.contains('¥15,000.00').should('be.visible')
    cy.contains('£120.00').should('be.visible')
    cy.contains('$200.00').should('be.visible')
    cy.contains('€90.00').should('be.visible')
    
    // Verify value scores are calculated correctly
    cy.contains('0.0833').should('be.visible') // Berlin: 7.5/90
    cy.contains('0.0650').should('be.visible') // London: 7.8/120
    cy.contains('0.0400').should('be.visible') // New York: 8.0/200
    cy.contains('0.0006').should('be.visible') // Tokyo: 8.5/15000
  })

  it('should sort hotels by value score in descending order', () => {
    // Add hotels with known value scores
    cy.addHotel('Best Value', 50, 8.0) // 0.1600
    cy.addHotel('Good Value', 100, 8.0) // 0.0800
    cy.addHotel('Poor Value', 200, 8.0) // 0.0400
    cy.addHotel('Worst Value', 400, 8.0) // 0.0200
    
    // Verify hotels are in correct order
    const expectedOrder = ['Best Value', 'Good Value', 'Poor Value', 'Worst Value']
    
    cy.get('[data-testid="hotel-card"]').each(($el, index) => {
      cy.wrap($el).should('contain', expectedOrder[index])
    })
  })

  it('should display statistics for multiple hotels', () => {
    // Add multiple hotels
    cy.addHotel('Hotel A', 100, 8.0)
    cy.addHotel('Hotel B', 150, 7.5)
    cy.addHotel('Hotel C', 200, 9.0)
    
    // Check if statistics section exists
    cy.get('[data-testid="statistics"]').should('be.visible')
    
    // Verify statistics calculations
    // Average price: (100 + 150 + 200) / 3 = 150
    cy.contains('Average Price').should('be.visible')
    cy.contains('$150.00').should('be.visible')
    
    // Average rating: (8.0 + 7.5 + 9.0) / 3 = 8.17
    cy.contains('Average Rating').should('be.visible')
    cy.contains('8.17').should('be.visible')
    
    // Best value score: 9.0/200 = 0.045
    cy.contains('Best Value Score').should('be.visible')
    cy.contains('0.0450').should('be.visible')
  })

  it('should handle edge cases with extreme values', () => {
    // Add hotels with edge case values
    cy.addHotel('Expensive Luxury', 10000, 10.0)
    cy.addHotel('Budget Option', 1, 1.0)
    cy.addHotel('Free Stay', 0.01, 5.0) // Minimum price
    
    // Verify all hotels are displayed
    cy.contains('Expensive Luxury').should('be.visible')
    cy.contains('Budget Option').should('be.visible')
    cy.contains('Free Stay').should('be.visible')
    
    // Verify extreme value scores
    cy.contains('500.0000').should('be.visible') // Free Stay: 5.0/0.01
    cy.contains('1.0000').should('be.visible')   // Budget: 1.0/1
    cy.contains('0.0010').should('be.visible')   // Luxury: 10.0/10000
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
    
    // Verify all hotels are displayed
    hotels.forEach(hotel => {
      cy.contains(hotel.name).should('be.visible')
    })
    
    // Verify the page is still responsive
    cy.get('[data-testid="hotel-card"]').should('have.length', 10)
    
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
    cy.contains('0.2997').should('be.visible') // 9.99/33.33
    cy.contains('0.0833').should('be.visible') // 5.55/66.67
    cy.contains('0.0111').should('be.visible') // 1.11/99.99
  })
})