import {sign_in_page} from "../selectors/sign_in_page";
import {user_info} from "../selectors/sign_in_page";

describe('UI tests for sign in page', () => {

    beforeEach('visiting sign in page', () => {
        cy.visit('/')
        cy.intercept("POST", "/users").as("signup")
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
        cy.get(sign_in_page.username_required).should('not.exist')
        cy.get('.makeStyles-root-1').click()
        cy.get(sign_in_page.username_required).should('be.visible')
    })

    it('check "Remember me" checkbox', () => {
        cy.get(sign_in_page.checkbox).check()
    })

    it('should show disabled by default sign in btn', () => {
        //cy.get('.makeStyles-root-1').click()  //can complete test with click everywhere and then button will be disabled
        cy.get(sign_in_page.button).should('be.disabled') //button is not disabled by default
    })

    it('should have Don\'t have an account? Sign Up clickable link under Sign in btn', () => {
        cy.get(sign_in_page.link).should('be.visible').and('have.attr', 'href', '/signup')
            .click()
        cy.url().should('contain', '/signup')
    })

    it('should show Cypress copyright link that leads to https://www.cypress.io/', () => {
        cy.get(sign_in_page.copyright).should('have.attr', 'href', 'https://cypress.io')
    })

    // Homework 19.07:
    // 1. should allow a visitor to sign-up
    // 2. should allow a visitor to login
    // 3. should allow a visitor to logout

    it('should allow a visitor to sign-up', () => {

        cy.get(sign_in_page.link).click()
        cy.get(sign_in_page.signup_title).should("be.visible").and("contain", "Sign Up")
        cy.get(sign_in_page.signup_first_name).type(user_info.first_name)
        cy.get(sign_in_page.signup_last_name).type(user_info.last_name)
        cy.get(sign_in_page.signup_username).type(user_info.username)
        cy.get(sign_in_page.signup_password).type(user_info.password)
        cy.get(sign_in_page.signup_confirm_password).type(user_info.password)
        cy.get(sign_in_page.signup_submit).click()
        cy.wait("@signup")
    })

    it('should allow a visitor to login', () => {
        cy.get(sign_in_page.username_field).type(user_info.username)
        cy.get(sign_in_page.password_field).type(user_info.password)
        cy.get(sign_in_page.checkbox).check()
        cy.get(sign_in_page.button).click()
    })
})

describe('UI test for logout', () => {

    it('should allow a visitor to logout', () => {
        cy.get(sign_in_page.log_out).click()
        cy.location("pathname").should("eq", "/signin")
    })
})