/// <reference types="cypress" />
import {functions} from "../helpers/functions";
import {main_page} from "../selectors/main_page.selector";

describe('bank accounts tests', () => {
    const username = functions.generateUsername()
    const password = "RestTest1!"
    const bankName = "Privat Bank";

    before("Prepare account", () => {
        cy.task("db:seed");
        cy.sign_up_API(username, password);
        cy.login_ui(username, password);
        cy.onboarding_ui();
        cy.logout_ui();
    });

    beforeEach(
        "Intercept graphql requests and proceed to bank accounts page",
        () => {
            cy.login_ui(username, password);
            cy.get(main_page.bank_accounts_button).click();
            cy.url().should("contain", "bankaccounts");
            cy.intercept("POST", "/graphql", (req) => {
                const {body} = req;

                if (
                    body.hasOwnProperty("operationName") &&
                    body.operationName === "ListBankAccount"
                ) {
                    req.alias = "gqlListBankAccountQuery";
                }

                if (
                    body.hasOwnProperty("operationName") &&
                    body.operationName === "CreateBankAccount"
                ) {
                    req.alias = "gqlCreateBankAccountMutation";
                }

                if (
                    body.hasOwnProperty("operationName") &&
                    body.operationName === "DeleteBankAccount"
                ) {
                    req.alias = "gqlDeleteBankAccountMutation";
                }
            });
        }
    );

    // errors for bank account page
    it('should show error for bank field', () => {
        cy.get(main_page.bankaccount_new).click()
        cy.get(main_page.bankaccount_validation_message).should('not.exist')
        cy.get(main_page.bank_name).click().blur()
        cy.get(main_page.bankaccount_validation_message).should('be.visible').and('have.text', 'Enter a bank name')
    })

    it('should show error for routing number field', () => {
        cy.get(main_page.bankaccount_new).click()
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
        cy.get(main_page.bankaccount_new).click()
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

    it("allows user to create new bank account", () => {
        cy.get(main_page.bankaccount_new).click()
        cy.get(main_page.bank_name).clear().type(bankName);
        cy.get(main_page.routing_number).clear().type("123123123");
        cy.get(main_page.account_number).clear().type("1231231232");
        cy.get(main_page.bankaccount_submit_button).should("be.enabled").click();
        cy.wait("@gqlCreateBankAccountMutation")
            .its("response.statusCode")
            .should("eq", 200);
        cy.get(main_page.bank_accounts_list).should("contain", bankName);
    });

    // delete bank account
    it('should delete bank account', () => {
        cy.get(main_page.bank_accounts_delete).first().click();
        cy.wait("@gqlDeleteBankAccountMutation")
            .its("response.statusCode")
            .should("eq", 200);
        cy.get(main_page.bank_accounts_list).children().contains("Deleted");
    })
})

