import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {main_page} from "../selectors/main_page.selector";

describe('UI test for sign-up, login and logout', () => {
    const userName = "Kilian12"
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
        cy.ui_sign_up(userName, password)
    })

    // login
    it('should allow a visitor to login', () => {
        cy.ui_login(userName, password)
    })

    //logout
    it('should allow a visitor to logout', () => {
        cy.get(main_page.onboarding_dialog_content).should('be.visible')
        cy.get('[data-test="user-onboarding-next"]').click()
        cy.ui_onboarding()
        cy.ui_logout()
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
