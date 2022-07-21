import {sign_in_page} from "../selectors/sign_in_page";

describe('UI tests for sign in page', () => {

    before('visiting sign in page', () => {
        cy.visit('/')
    })

    it('should show "Real World App logo"', () => {
        cy.get(sign_in_page.logo_image).should('be.visible').and('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
    })

    it('should show "Sign in" title', () => {
        cy.get(sign_in_page.title_text).should('be.visible').and('have.text', 'Sign in')
    })

    it('should show typeable Username field', () => {
        cy.get(sign_in_page.username_field).should('be.visible').type('dgrgev').clear()
    })

    it('should show typeable Password field', () => {
        cy.get(sign_in_page.password_field).should('be.visible').type('dgrgev').clear()
    })

    it('should show Username and Password placeholders', () => {
        cy.get(sign_in_page.username_placeholders).should('be.visible').should("have.text", 'Username')
        cy.get(sign_in_page.password_placeholders).should('be.visible').should("have.text", 'Password')
    })

    it('should show Username is required error if user clicks on it and then click outside this field', () => {
        cy.reload()
        cy.get(sign_in_page.username_required).should('not.exist')
        cy.get('.makeStyles-root-1').click()
        cy.get(sign_in_page.username_required).should('be.visible')
    })

    it('check "Remember me" checkbox', () => {
        cy.get(sign_in_page.checkbox).should('not.be.checked')
            .check().should('be.checked')
    })

    it('should show disabled by default sign in btn', () => {
        cy.reload()
        // cy.get('.makeStyles-root-1').click()   if we click anywhere button will be disabled
        cy.get(sign_in_page.button).should('be.disabled') //button is not disabled by default
    })

    it('should have Don\'t have an account? Sign Up clickable link under Sign in btn', () => {
        cy.get(sign_in_page.link).should('be.visible').and('have.attr', 'href', '/signup')
            .click()
        cy.url().should('contain', '/signup')
    })

    it('should show Cypress copyright link that leads to https://www.cypress.io/', () => {
        cy.get(sign_in_page.copyright).should('have.attr', 'href', 'https://cypress.io')
            .and('have.attr', 'target', '_blank')
    })
})
