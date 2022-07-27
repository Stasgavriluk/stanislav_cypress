import {transaction} from "../selectors/new-transaction";
import {another_user_info} from "../selectors/sign_in_page";

describe('New Transaction', () => {
    beforeEach('visit main page', () => {
        cy.visit('/')
        cy.ui_login()
        cy.intercept("GET", "/users*").as("allUsers")
        cy.get(transaction.new_transaction).click()
        cy.wait("@allUsers")
    })

    it('navigates to the new transaction form, selects a user and submits a transaction payment', function () {
        const payment = {
            amount: "35",
            description: "Sushi dinner 🍣",
        }
        cy.get(transaction.user_list_search_input).type(another_user_info.first_name)
        cy.wait("@usersSearch")
        cy.get(transaction.user_list).contains(another_user_info.first_name).click()
        cy.get(transaction.create_amount_input).type(payment.amount)
        cy.get(transaction.create_description_input).type(payment.description)
        cy.get(transaction.create_submit_payment).click()
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')
        cy.get(transaction.create_another_transaction).click()
        cy.get(transaction.app_name_logo).click()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.wait("@personalTransactions")
        cy.get(transaction.transaction_list).first().should('contain', payment.description)
        cy.get(transaction.alert_bar_success).should('not.exist')
    })

    it('navigates to the new transaction form, selects a user and submits a transaction request', function () {
        const request = {
            amount: "95",
            description: "Fancy Hotel 🏨",
        }
        cy.get(transaction.user_list_search_input).type(another_user_info.first_name)
        cy.wait("@usersSearch")
        cy.get(transaction.user_list).contains(another_user_info.first_name).click()
        cy.get(transaction.create_amount_input).type(request.amount)
        cy.get(transaction.create_description_input).type(request.description)
        cy.get(transaction.create_submit_request).click()
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')
        cy.get(transaction.return_to_transactions).click()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.get(transaction.transaction_list).first().should('contain', request.description)
    })

    it("displays new transaction errors", function () {
        cy.get(transaction.user_list).contains(another_user_info.first_name).click()
        cy.get(transaction.create_amount_input).type("43").clear().blur()
        cy.get("#transaction-create-amount-input-helper-text").should("be.visible")
            .and("contain", "Please enter a valid amount")
        cy.get(transaction.create_description_input).type("Fun").clear().blur()
        cy.get("#transaction-create-description-input-helper-text").should("be.visible")
            .and("contain", "Please enter a note")
        cy.get(transaction.create_submit_payment).should("be.disabled")
        cy.get(transaction.create_submit_request).should("be.disabled")

    })

    it("submits a transaction payment and verifies the deposit for the receiver", function () {
        const payment = {
            amount: "25",
            description: "Indian Food",
        }
        cy.get(transaction.user_list_search_input).type(another_user_info.first_name)
        cy.wait("@usersSearch")
        cy.get(transaction.user_list).contains(another_user_info.first_name).click()
        cy.get(transaction.create_amount_input).type(payment.amount)
        cy.get(transaction.create_description_input).type(payment.description)
        cy.get(transaction.create_submit_payment).click()
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')
        cy.switch_user()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.wait("@personalTransactions")
        cy.get(transaction.transaction_list).first().should('contain', payment.description)


    })

    it("submits a transaction request and accepts the request for the receiver", function () {
        const request = {
            amount: "10",
            description: "Fancy Hotel 🏨",
        }
        cy.get(transaction.user_list_search_input).type(another_user_info.first_name)
        cy.wait("@usersSearch")
        cy.get(transaction.user_list).contains(another_user_info.first_name).click()
        cy.get(transaction.create_amount_input).type(request.amount)
        cy.get(transaction.create_description_input).type(request.description)
        cy.get(transaction.create_submit_request).click()
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')
        cy.switch_user()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.wait("@personalTransactions")
        cy.get(transaction.transaction_list).first().should('contain', request.description)
    })

    it("searches for a user by attribute", function () {

    })
})