/// <reference types="cypress" />
import {functions} from "../helpers/functions";
import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";

describe('UI tests for sign in page', () => {

    before('visiting sign in page', () => {
        cy.task("db:seed");
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

    it('should show enabled by default sign in btn', () => {
        cy.reload()
        cy.get(sign_in_page.signin_submit).should('be.enabled')
    })

    it('should have Don\'t have an account? Sign Up clickable link under Sign in btn', () => {
        cy.get(sign_in_page.link).should('be.visible').should('have.text', "Don't have an account? Sign Up").and('have.attr', 'href', '/signup')
    })

    it('should show Cypress copyright link that leads to https://www.cypress.io/', () => {
        cy.get(sign_in_page.copyright).should('have.attr', 'href', 'https://cypress.io')
            .and('have.attr', 'target', '_blank')
    })
})

describe('UI test for sign-up, login and logout', () => {
    const username = functions.generateUsername()
    const password = "RestTest1!"

    before('Visit sign-up page', () => {
        cy.visit('/')
        cy.get(sign_in_page.link).click()
        cy.url().should('contain', '/signup')
    })

    // errors for sign-up page
    it('should show validation errors for first name field', () => {
        cy.get(sign_up_page.first_name_validation_message).should('not.exist')
        cy.get(sign_up_page.first_name_field).click().blur()
        cy.get(sign_up_page.first_name_validation_message).should('be.visible').and('have.text', 'First Name is required')
    })

    it('should show validation errors for last name field', () => {
        cy.get(sign_up_page.last_name_validation_message).should('not.exist')
        cy.get(sign_up_page.last_name_field).click().blur()
        cy.get(sign_up_page.last_name_validation_message).should('be.visible').and('have.text', 'Last Name is required')
    })

    it('should show validation errors for username field', () => {
        cy.get(sign_up_page.username_validation_message).should('not.exist')
        cy.get(sign_up_page.username_field).click().blur()
        cy.get(sign_up_page.username_validation_message).should('be.visible').and('have.text', 'Username is required')
    })

    it('should show validation errors for password field', () => {
        cy.get(sign_up_page.password_validation_message).should('not.exist')
        cy.get(sign_up_page.password_field).click().blur()
        cy.get(sign_up_page.password_validation_message).should('be.visible').and('have.text', 'Enter your password')
        cy.get(sign_up_page.password_field).type('566').blur()
        cy.get(sign_up_page.password_validation_message).should('be.visible').and('have.text', 'Password must contain at least 4 characters')
        cy.get(sign_up_page.password_field).clear()
    })

    it('should show validation errors for password confirmation field', () => {
        cy.get(sign_up_page.confirm_password_validation_message).should('not.exist')
        cy.get(sign_up_page.confirm_password_field).click().blur()
        cy.get(sign_up_page.confirm_password_validation_message).should('be.visible').and('have.text', 'Confirm your password')
        cy.get(sign_up_page.confirm_password_field).type('rwtgwrtv').blur()
        cy.get(sign_up_page.confirm_password_validation_message).should('be.visible').and('have.text', 'Password does not match')
        cy.get(sign_up_page.confirm_password_field).clear()
    })

    // sign-up
    it('should allow a visitor to sign-up', () => {
        cy.sign_up_ui(username, password);
    })

    // login
    it('should allow a visitor to login', () => {
        cy.login_ui(username, password);
    })

    //logout
    it('should allow a visitor to logout', () => {
        cy.onboarding_ui()
        cy.logout_ui()
    })

    // errors for login
    it('should show login errors for login with invalid credentials', () => {
        cy.get(sign_in_page.username_field).type('bobross')
        cy.get(sign_in_page.password_field).type('qfrfrrf')
        cy.get(sign_in_page.signin_submit).click()
        cy.get(sign_in_page.sign_in_error).should('be.visible').and('have.text', 'Username or password is invalid')
    })

    it('should show error when inputted password is less than 4 symbols', () => {
        cy.reload()
        cy.get(sign_in_page.username_field).type('bobross')
        cy.get(sign_in_page.password_field).type('566').blur()
        cy.get(sign_in_page.password_validation_message).should('be.visible').and('have.text', 'Password must contain at least 4 characters')
        cy.get(sign_in_page.password_field).type('5465').blur()
        cy.get(sign_in_page.password_validation_message).should('not.exist')
    })
})
