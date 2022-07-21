import {sign_in_page, user_info} from "../selectors/sign_in_page";

describe('UI test for sign-up, login and logout', () => {
    beforeEach('Visit sign-up page', () => {
        cy.visit('/')
        })
        it('should allow a visitor to sign-up', () => {
            cy.get(sign_in_page.link).click()
            cy.url().should('contain', '/signup')
            cy.get(sign_in_page.signup_title).should("be.visible").and("contain", "Sign Up")
            cy.get(sign_in_page.signup_first_name).type(user_info.first_name)
            cy.get(sign_in_page.signup_last_name).type(user_info.last_name)
            cy.get(sign_in_page.signup_username).type(user_info.username)
            cy.get(sign_in_page.signup_password).type(user_info.password)
            cy.get(sign_in_page.signup_confirm_password).type(user_info.password)
            cy.get(sign_in_page.signup_submit).click()
        })

        it('should allow a visitor to login', () => {
            cy.get(sign_in_page.username_field).type(user_info.username)
            cy.get(sign_in_page.password_field).type(user_info.password)
            cy.get(sign_in_page.checkbox).check()
            cy.get(sign_in_page.button).click()
        })

        it('should allow a visitor to logout', () => {
            cy.get(sign_in_page.log_out).should('be.visible').click()
            cy.url().should('contain', '/signin')

        })
    })
