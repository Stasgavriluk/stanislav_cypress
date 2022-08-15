import {notification} from "../selectors/notification";
import {transaction} from "../selectors/new-transaction";

const userA = {
    username: 'Katharina_Bernier',
    name: 'Edgar Johns',
}

const userB = {
    username: 'Tavares_Barrows',
    name: 'Arely Kertzmann',
}

const userC = {
    username: 'Allie2',
    name: 'Kaylin Homenick',
}

const password = 's3cret'
const transactionAmount = "5";

describe("Notifications", function () {

    beforeEach("intercept API calls", () => {
        cy.task("db:seed");
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("PATCH", "/transactions/*").as("updateTransaction");
        cy.intercept("GET", "/transactions").as("getTransactions");
        cy.intercept("POST", "/likes/*").as("like");
        cy.intercept("GET", "/notifications").as("getNotifications");
        cy.intercept("POST", "/comments/*").as("comment");
    });

    it('User A likes a transaction of User B; User B gets notification that User A liked transaction ', function () {
        cy.log_in_API(userB.username, password)
        cy.wait('@getNotifications')
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(
            transactionAmount,
            "B paid A",
            userA.name
        );

        cy.switchUser_API(userA.username, password);
        cy.get(transaction.personal_tab)
            .click()
            .wait("@getTransactions")
            .its("response.statusCode")
            .should("eq", 200);
        cy.get(transaction.transaction_list)
            .contains(`${userB.name} paid ${userA.name}`)
            .first()
            .click({force: true});
        cy.url().should("contain", "/transaction");
        cy.get(notification.like_button).click();
        cy.wait("@like").its("response.statusCode").should("eq", 200);
        cy.get(notification.like_button).should('be.disabled');
        cy.switchUser_API(userB.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userA.name} liked a transaction`
        );
    });

    it("When user C likes a transaction between user A and user B, user A and user B should get notifications that user C liked transaction", () => {
        cy.log_in_API(userB.username, password);
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(
            transactionAmount,
            "B paid A",
            userA.name
        );
        cy.switchUser_API(userC.username, password);
        cy.get(transaction.transaction_list)
            .contains(`${userB.name} paid ${userA.name}`)
            .first()
            .click({force: true});
        cy.url().should("contain", "/transaction");
        cy.get(notification.like_button).click();
        cy.wait("@like").its("response.statusCode").should("eq", 200);
        cy.get(notification.like_button).should('be.disabled');
        cy.switchUser_API(userA.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userC.name} liked a transaction`
        );
        cy.switchUser_API(userB.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userC.name} liked a transaction`
        );
    });

    it("When user A comments on a transaction of user B, user B should get notification that User A commented on their transaction", () => {
        const commentText = "Thank You";

        cy.log_in_API(userB.username, password);
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(
            transactionAmount,
            "B paid A",
            userA.name
        );
        cy.switchUser_API(userA.username, password);
        cy.get(transaction.personal_tab).click().wait("@getTransactions");
        cy.get(transaction.transaction_list)
            .contains(`${userB.name} paid ${userA.name}`)
            .first()
            .click({force: true});
        cy.url().should("contain", "/transaction");
        cy.get(notification.comment_field)
            .should("be.visible")
            .type(`${commentText}{enter}`);
        cy.wait("@comment").its("response.statusCode").should("eq", 200);
        cy.get(notification.comments_list).should("contain", commentText);
        cy.switchUser_API(userA.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userA.name} commented on a transaction`
        );
    });

    it("When user C comments on a transaction between user A and user B, user A and B should get notifications that user C commented on their transaction", () => {
        const commentText = "Thank You";

        cy.log_in_API(userB.username, password);
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(
            transactionAmount,
            "B paid A",
            userA.name
        );
        cy.switchUser_API(userC.username, password);
        cy.get(transaction.transaction_list)
            .contains(`${userB.name} paid ${userA.name}`)
            .first()
            .click({force: true});
        cy.url().should("contain", "/transaction");
        cy.get(notification.comment_field)
            .should("be.visible")
            .type(`${commentText}{enter}`);
        cy.wait("@comment").its("response.statusCode").should("eq", 200);
        cy.get(notification.comments_list).should("contain", commentText);
        cy.switchUser_API(userA.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userC.name} commented on a transaction`
        );
        cy.switchUser_API(userB.username, password);
        cy.get(notification.link).click();
        cy.url().should("contain", "/notifications");
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userC.name} commented on a transaction`
        );
    });

    it("When user A sends a payment to user B, user B should be notified of payment", () => {
        cy.log_in_API(userA.username, password);
        cy.get(transaction.new_transaction_button).click()
        transaction.createPayTransaction(
            transactionAmount,
            "A paid B",
            userB.name
        );
        cy.switchUser_API(userB.username, password);
        cy.get(notification.link).click();
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userB.name} received payment`
        );
    });

    it("When user A sends a payment request to user C, user C should be notified of request from user A", () => {
        cy.log_in_API(userA.username, password);
        cy.get(transaction.new_transaction_button).click()
        transaction.createRequestTransaction(
            transactionAmount,
            "A requests C",
            userC.name
        );
        cy.switchUser_API(userC.username, password);
        cy.get(notification.link).click();
        cy.wait("@getNotifications");
        cy.get(notification.list).should(
            "contain",
            `${userA.name} requested payment`
        );
    });

})

