/// <reference types="cypress" />
import {functions} from "../helpers/functions";
import {main_page} from "../selectors/main_page.selector";

describe('bank accounts tests', () => {
    const userName = functions.generateUsername()
    const password = "RestTest1!"

    before('visit onboarding page', () => {
        cy.task("db:seed");
        cy.ui_sign_up(userName, password)
        cy.ui_login(userName, password)
        cy.get(main_page.onboarding_dialog_content).should('be.visible')
        cy.get('[data-test="user-onboarding-next"]').click()
    })

    // errors for bank account page
    it('should show error for bank field', () => {
        cy.get(main_page.bankaccount_validation_message).should('not.exist')
        cy.get(main_page.bank_name).click().blur()
        cy.get(main_page.bankaccount_validation_message).should('be.visible').and('have.text', 'Enter a bank name')
    })

    it('should show error for routing number field', () => {
        cy.get(main_page.routing_number_validation_message).should('not.exist')
        cy.get(main_page.routing_number).click().blur()
        cy.get(main_page.routing_number_validation_message).should('be.visible').and('have.text', 'Enter a valid bank routing number')
        cy.get(main_page.routing_number).type('567').blur()
        cy.get(main_page.routing_number_validation_message).should('be.visible').and('have.text', 'Must contain a valid routing number')
        cy.get(main_page.routing_number).clear()
        cy.get(main_page.routing_number).type('1234214232').blur()
        cy.get(main_page.routing_number_validation_message).should('be.visible').and('have.text', 'Must contain a valid routing number')
        cy.get(main_page.routing_number).clear()
    })

    it('should show error for account number field', () => {
        cy.get(main_page.account_number_validation_message).should('not.exist')
        cy.get(main_page.account_number).click().blur()
        cy.get(main_page.account_number_validation_message).should('be.visible').and('have.text', 'Enter a valid bank account number')
        cy.get(main_page.account_number).type('567').blur()
        cy.get(main_page.account_number_validation_message).should('be.visible').and('have.text', 'Must contain at least 9 digits')
        cy.get(main_page.account_number).clear()
        cy.get(main_page.account_number).type('1424124142141424').blur()
        cy.get(main_page.account_number_validation_message).should('be.visible').and('have.text', 'Must contain no more than 12 digits')
        cy.get(main_page.account_number).clear()
    })

    // successful onboarding
    it('should successful onboarding', () => {
        cy.ui_onboarding()
    })

    // delete bank account
    it('should delete bank account', () => {
        cy.reload()
        cy.ui_sign_up(userName, password)
        cy.ui_login(userName, password)
        cy.get(main_page.onboarding_dialog_content).should('be.visible')
        cy.get('[data-test="user-onboarding-next"]').click()
        cy.ui_onboarding()
        cy.get(main_page.bank_accounts_button).should('be.visible').click()
        cy.get(main_page.bank_accounts_list).should('be.visible')
        cy.get(main_page.bank_accounts_delete).should('be.visible').click()
        cy.get(main_page.bank_accounts_list).contains('Deleted')
    })
})

