import {sign_in_page} from "../selectors/sign_in_page";
import {main_page} from "../selectors/main_page.selector";

Cypress.Commands.add("ui_login", (userName, password) => {
    cy.visit("/signin")
    cy.intercept("POST", "/login").as("signin")
    cy.get(sign_in_page.signin_username).type(userName)
    cy.get(sign_in_page.signin_password).type(password)
    cy.get(sign_in_page.signin_submit).click()
    cy.wait("@signin")
})

Cypress.Commands.add("ui_sign_up", (userName, password) => {
    cy.visit("/signup")
    cy.intercept("POST", "/users").as("signup")
    cy.get(sign_in_page.signup_title).should("be.visible").and("contain", "Sign Up")
    cy.get(sign_in_page.signup_first_name).type('Aleks')
    cy.get(sign_in_page.signup_last_name).type('Morgan')
    cy.get(sign_in_page.signup_username).type(userName)
    cy.get(sign_in_page.signup_password).type(password)
    cy.get(sign_in_page.signup_confirm_password).type(password)
    cy.get(sign_in_page.signup_submit).click()
    cy.wait("@signup")
})

Cypress.Commands.add("ui_onboarding", () => {
    cy.get(main_page.bank_name).type('Privat Bank')
    cy.get(main_page.routing_number).type('123456789')
    cy.get(main_page.account_number).type('987654321')
    cy.get(main_page.bankaccount_submit_button).click()
    cy.get('[data-test="user-onboarding-next"]').click()
})

Cypress.Commands.add("ui_logout", () => {
    cy.get(sign_in_page.log_out).should('be.visible').click()
    cy.url().should('contain', '/signin')
})

