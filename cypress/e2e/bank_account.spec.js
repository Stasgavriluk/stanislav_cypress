import {user_info} from "../selectors/sign_in_page";
import {main_page} from "../selectors/main_page.selector";

describe('bank accounts tests', () => {
    before('visit onboarding page', () => {
        cy.ui_sign_up()
        cy.ui_login(user_info.username, user_info.password)
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
    })

    it('should show error for account number field', () => {
        cy.get(main_page.account_number_validation_message).should('not.exist')
        cy.get(main_page.account_number).click().blur()
        cy.get(main_page.account_number_validation_message).should('be.visible').and('have.text', 'Enter a valid bank account number')
        cy.get(main_page.account_number).type('567').blur()
        cy.get(main_page.account_number_validation_message).should('be.visible').and('have.text', 'Must contain at least 9 digits')
        cy.get(main_page.account_number).clear()
    })

    // successful onboarding
    it('should successful onboarding', () => {
        cy.ui_onboarding()
    })

    // delete bank account
    it('should delete bank account', () => {
        // cy.ui_logout()
        // cy.ui_login(user_info.username, user_info.password)
        // cy.get(main_page.onboarding_dialog_content).should('be.visible')
        // cy.get('[data-test="user-onboarding-next"]').click()
        // cy.ui_onboarding()
        cy.get(main_page.bank_accounts_button).should('be.visible').click()
        cy.get(main_page.bank_accounts_list).should('be.visible')
        cy.get(main_page.bank_accounts_delete).should('be.visible').click()
        cy.get(main_page.bank_accounts_list).contains( 'Deleted')
    })
})

