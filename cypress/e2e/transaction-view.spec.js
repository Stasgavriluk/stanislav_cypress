import {notification} from "../selectors/notification";
import {transaction} from "../selectors/new-transaction";

describe("Transaction View", function () {

    beforeEach(function () {
        cy.task("db:seed");

        cy.intercept("GET", "/transactions*").as("personalTransactions");
        cy.intercept("GET", "/transactions/public*").as("publicTransactions");
        cy.intercept("GET", "/transactions/*").as("getTransaction");
        cy.intercept("PATCH", "/transactions/*").as("updateTransaction");

        cy.intercept("GET", "/checkAuth").as("userProfile");
        cy.intercept("GET", "/notifications").as("getNotifications");
        cy.intercept("GET", "/bankAccounts").as("getBankAccounts");

        const username = "Katharina_Bernier"
        const password = "s3cret"
        cy.ui_login(username, password)
        cy.get(transaction.personal_tab).click();
        cy.wait("@personalTransactions");
    });

    it("transactions navigation tabs are hidden on a transaction view page", function () {
        cy.get(transaction.transaction_item).first().click({ force: true });
        cy.location("pathname").should("include", "/transaction");
        cy.get(transaction.tabs).should("not.exist");
        cy.get(transaction.detail_header).should("be.visible");
    });

    it("likes a transaction", function () {
        cy.get(transaction.transaction_item).first().click({ force: true });
        cy.wait("@getTransaction");

        cy.get(notification.like_button).click();
        cy.get(notification.like_count).should("contain", 1);
        cy.get(notification.like_button).should("be.disabled");
    });

    it("comments on a transaction", function () {
        cy.get(transaction.transaction_item).first().click({ force: true });
        cy.wait("@getTransaction");

        const comments = ["Thank you!", "Appreciate it."];

        comments.forEach((comment, index) => {
            cy.get(notification.comment).type(`${comment}{enter}`);
            cy.get(notification.coments_list).children().eq(index).contains(comment);
        });
        cy.get(notification.coments_list).children().should("have.length", comments.length);
    });

    it("accepts a transaction request", function () {
        cy.visit("/transaction/UKvl6huiDrD3");
        cy.wait("@getTransaction");

        cy.get(transaction.accept_transaction_request_button).click();
        cy.wait("@updateTransaction").its("response.statusCode").should("equal", 204);
        cy.get(transaction.accept_transaction_request_button).should("not.exist");
        cy.get(transaction.detail_header).should("be.visible");
    });

    it("rejects a transaction request", function () {
        cy.visit("/transaction/UKvl6huiDrD3");
        cy.wait("@getTransaction");

        cy.get(transaction.reject_transaction_request_button).click();
        cy.wait("@updateTransaction").its("response.statusCode").should("equal", 204);
        cy.get(transaction.reject_transaction_request_button).should("not.exist");
        cy.get(transaction.detail_header).should("be.visible");
    });

    it("does not display accept/reject buttons on completed request", function () {
        cy.get(transaction.transaction_item).first().click({ force: true });
        cy.wait("@getNotifications");

        cy.get(notification.count).should("be.visible");
        cy.get(transaction.detail_header).should("be.visible");
        cy.get(transaction.accept_transaction_request_button).should("not.exist");
        cy.get(transaction.reject_transaction_request_button).should("not.exist");
    });
});
