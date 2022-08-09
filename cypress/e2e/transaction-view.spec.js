import {notification} from "../selectors/notification";
import {transaction} from "../selectors/new-transaction";

const userA = {
    username: "Allie2",
    name: "Kaylin Homenick",
};

const userB = {
    username: "Katharina_Bernier",
    name: "Edgar Johns",
};

const password = "s3cret";
const noteText = "Thank You";
const transactionAmount = "5";

describe("Transaction View", function () {

    before("db:seed", () => {
        cy.task("db:seed");
    });

    beforeEach("intercept requests and login", () => {
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("PATCH", "/transactions/*").as("updateTransaction");
        cy.intercept("GET", "/transactions/*").as("getTransactions");
        cy.intercept("POST", "/likes/*").as("like");
        cy.intercept("POST", "/comments/*").as("comment");
        cy.ui_login(userA.username, password);
    });

    it("transactions navigation tabs are hidden on a transaction view page", function () {
        cy.get(transaction.transaction_list)
            .first()
            .click()
            .wait("@getTransactions");
        cy.location("pathname").should("include", "/transaction");
        cy.get(transaction.everyone_tab).should("not.exist");
        cy.get(transaction.friends_tab).should("not.exist");
        cy.get(transaction.personal_tab).should("not.exist");
        cy.get(transaction.detail_header).should("be.visible");
    });

    it("likes a transaction", function () {
        cy.get(transaction.transaction_list)
            .first()
            .click()
            .wait("@getTransactions");
        cy.get(notification.like_button)
            .click()
            .wait("@like")
            .its("response.statusCode")
            .should("eq", 200);
        cy.get(notification.like_count).should("contain", 1);
        cy.get(notification.like_button).should("be.disabled");
    });

    it("comments on a transaction", function () {
        cy.get(transaction.transaction_list)
            .first()
            .click()
            .wait("@getTransactions");

            cy.get(notification.comment_field)
                .type(noteText + "{enter}")
                .wait("@comment")
                .its("response.statusCode")
                .should("eq", 200);
            cy.get(notification.comments_list).should("contain", noteText);
    });

    it("accepts a transaction request", function () {
        cy.get(transaction.new_transaction_button).click()
        transaction.createRequestTransaction(
            transactionAmount,
            noteText,
            userB.name
        );
        cy.ui_switchUser(userB.username, password);
        cy.get(transaction.personal_tab).click();
        cy.get(transaction.transaction_list)
            .contains(`${userA.name} requested ${userB.name}`)
            .click({ force: true })
            .wait("@getTransactions");
        cy.get(transaction.reject_transaction_request_button).should("be.enabled");
        cy.get(transaction.accept_transaction_request_button)
            .should("be.enabled")
            .click()
            .wait("@updateTransaction")
            .its("response.statusCode")
            .should("eq", 204);
    });

    it("rejects a transaction request", function () {
        cy.get(transaction.new_transaction_button).click()
        transaction.createRequestTransaction(
            transactionAmount,
            noteText,
            userB.name
        );
        cy.ui_switchUser(userB.username, password);
        cy.get(transaction.personal_tab).click();
        cy.get(transaction.transaction_list)
            .contains(`${userA.name} requested ${userB.name}`)
            .click({ force: true })
            .wait("@getTransactions");
        cy.get(transaction.accept_transaction_request_button).should("be.enabled");
        cy.get(transaction.reject_transaction_request_button)
            .should("be.enabled")
            .click()
            .wait("@updateTransaction")
            .its("response.statusCode")
            .should("eq", 204);
    });

    it("does not display accept/reject buttons on completed request", function () {
        cy.get(transaction.new_transaction_button).click()
        transaction.createRequestTransaction(
            transactionAmount,
            noteText,
            userB.name
        );
        cy.ui_switchUser(userB.username, password);
        cy.get(transaction.personal_tab).click();
        cy.get(transaction.transaction_list)
            .contains(`${userA.name} requested ${userB.name}`)
            .click({ force: true })
            .wait("@getTransactions");
        cy.get(transaction.accept_transaction_request_button).should("be.enabled");
        cy.get(transaction.reject_transaction_request_button)
            .should("be.enabled")
            .click()
            .wait("@updateTransaction")
            .its("response.statusCode")
            .should("eq", 204);
        cy.get(transaction.accept_transaction_request_button).should("not.exist");
        cy.get(transaction.reject_transaction_request_button).should("not.exist");
    });
});
