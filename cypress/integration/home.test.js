describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    
    it('Visits various links', () => {
        cy.get('a').contains('sep.com').then(link => {
            cy.request(link.prop('href')).its('status').should('eq', 200)
        })

        cy.contains('Ute').closest('.Card').click()
        cy.get("h1").should('contain', 'Ute')

        cy.visit('/')
        cy.contains('Bones.live').closest('.Card').get('a').then(link => {
            cy.request(link.prop('href')).its('status').should('eq', 200)
        })

        cy.visit('/')
        cy.contains('Losing Sleep').closest('.Card').click()
        cy.get('h1').should('contain', 'Losing Sleep')

        cy.visit('/')
        cy.contains('Yikes Dog').closest('.Card').click()
        cy.get('header').should('contain', 'Yikes Dog')
    })
})