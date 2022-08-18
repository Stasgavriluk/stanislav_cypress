import {transaction} from "../selectors/new-transaction";

const transactionAmount = "5"
const noteText = "Sushi dinner"

describe('New Transaction', () => {
    const username = "Allie2";
    const password = "s3cret";

    const searchAttrs = [
        "firstName",
        "lastName",
        "username",
        "email",
        "phoneNumber",
    ]

    const targetUser = {
        firstName: "Edgar",
        lastName: "Johns",
        username: "Katharina_Bernier",
        email: "Norene39@yahoo.com",
        phoneNumber: "625-316-9882",
    }

    before("db-seed", () => {
        cy.task("db:seed");
    });

    beforeEach('visit main page', () => {
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("GET", "/users/search*").as("usersSearch");
        cy.log_in_API(username, password)
        cy.get(transaction.new_transaction_button).click()
    })

    it('navigates to the new transaction form, selects a user and submits a transaction payment', function () {
        transaction.createPayTransaction(transactionAmount, noteText)
        cy.get(transaction.create_another_transaction).click()
        cy.get(transaction.app_name_logo).click()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.get(transaction.transaction_list).first().should('contain', noteText)
        cy.get(transaction.alert_bar_success).should('not.exist')
    })

    it('navigates to the new transaction form, selects a user and submits a transaction request', function () {
        transaction.createRequestTransaction(transactionAmount, noteText)
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')
        cy.get(transaction.return_to_transactions).click()
        cy.get(transaction.personal_tab).click().should('have.class', 'Mui-selected')
        cy.get(transaction.transaction_list).first().should('contain', transactionAmount)
    })

    it("displays new transaction errors", function () {
        cy.get(transaction.contacts_list).contains(targetUser.firstName).click({force: true})
        cy.get(transaction.amount_field).type("43").clear().blur()
        cy.get(transaction.amount_validation_message).should("be.visible")
            .and("contain", "Please enter a valid amount")
        cy.get(transaction.note_field).type("Fun").clear().blur()
        cy.get(transaction.note_validation_message).should("be.visible")
            .and("contain", "Please enter a note")
        cy.get(transaction.create_submit_payment).should("be.disabled")
        cy.get(transaction.create_submit_request).should("be.disabled")
    })

    searchAttrs.forEach((attr) => {
        it(`Searching by "${attr}" attribute`, () => {
            cy.wait("@getUsers")
            cy.get(transaction.search_input).click({force: true}).type(targetUser[attr])
            cy.wait("@usersSearch")
                .its("response.body.results")
                .should("have.length.gt", 0)
                .its("length")
                .then((resultsN) => {
                    cy.get(transaction.contacts_list_item)
                        .should("have.length", resultsN)
                        .first()
                        .contains(targetUser[attr])
                })
            cy.focused().clear()
            cy.get(transaction.contacts_list).should("be.empty")
        })
    })
})

context("User is able to receive pay and request transactions", () => {
    const payerUserName = "Allie2";
    const receiverUserName = "Katharina_Bernier";
    const password = "s3cret";

    before("db-seed", () => {
        cy.task("db:seed");
    });

    beforeEach("signin", () => {
        cy.intercept("GET", "/users").as("getUsers")
        cy.intercept("POST", "/transactions").as("createTransaction")
        cy.intercept("GET", "/checkAuth").as("checkAuth")
        cy.intercept("PATCH", "/transactions/*").as("updateTransaction")
    })

    it("submits a transaction payment and verifies the deposit for the receiver", () => {
        let payerStartBalance, receiverStartBalance

        cy.log_in_API(receiverUserName, password)
        cy.get(transaction.user_balance)
            .invoke("text")
            .then((x) => {
                receiverStartBalance = x
                expect(receiverStartBalance).to.match(/\$\d/)
            })
        cy.log_out_API()
        cy.log_in_API(payerUserName, password)
        cy.get(transaction.user_balance)
            .invoke("text")
            .then((x) => {
                payerStartBalance = x
                expect(payerStartBalance).to.match(/\$\d/)
            })
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(transactionAmount, noteText)
        cy.get(transaction.user_balance).should(($el) => {
            expect($el.text()).to.not.equal(payerStartBalance)
        })
        cy.log_out_API()
        cy.log_in_API(receiverUserName, password)
        cy.url().should("not.contain", "/signin")
        cy.get(transaction.user_balance).should(($el) => {
            expect($el.text()).to.not.equal(receiverStartBalance)
        })
    })

    it("submits a transaction request and accepts the request for the receiver", () => {
        let receiverStartBalance

        cy.log_in_API(payerUserName, password)
        cy.get(transaction.user_balance)
            .invoke("text")
            .then((x) => {
                receiverStartBalance = x
                expect(receiverStartBalance).to.match(/\$\d/)
            })
        cy.get(transaction.new_transaction_button).click()
        transaction.createRequestTransaction(transactionAmount, noteText)
        cy.log_out_API()
        cy.log_in_API(receiverUserName, password)
        cy.get(transaction.personal_tab).click()
        cy.get(transaction.transaction_item)
            .first()
            .should("contain", noteText)
            .click({force: true})
        cy.get(transaction.accept_transaction_request_button).click()
        cy.wait("@updateTransaction").its("response.statusCode").should("eq", 204);
        cy.log_out_API()
        cy.log_in_API(payerUserName, password)
        cy.url().should("not.contain", "/signin")
        cy.get(transaction.user_balance).should(($el) => {
            expect($el.text()).to.not.equal(receiverStartBalance)
        })
    })
})

