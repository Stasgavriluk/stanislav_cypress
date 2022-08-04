import {notification} from "../selectors/notification";
import {transaction} from "../selectors/new-transaction";

describe("Notifications", function () {
    before("db-seed", () => {
        cy.task("db:seed");
    });

    beforeEach(function () {
        cy.intercept('GET', '/notifications*').as('getNotifications')
        cy.intercept('POST', '/transactions').as('createTransaction')
        cy.intercept('PATCH', '/notifications/*').as('updateNotification')
        cy.intercept('POST', '/comments/*').as('postComment')
    })
    const userA = {
        username: 'Katharina_Bernier',
        firstname: 'Edgar',
        lastname: 'Johns',
        id: 't45AiwidW',
    }

    const userB = {
        username: 'Tavares_Barrows',
        firstname: 'Arely',
        lastname: 'Kertzmann',
        id: 'qywYp6hS0U',
    }

    const userC = {
        username: 'Allie2',
        firstname: 'Kaylin',
        lastname: 'Homenick',
        id: 'bDjUb4ir5O',
    }

    const password = 's3cret'

    describe('notifications from user interactions', function () {

        it('User A likes a transaction of User B; User B gets notification that User A liked transaction ', function () {
        cy.ui_login(userA.username, password)
        cy.wait('@getNotifications')
        cy.visit('/transaction/7XaoAWOrn13')

        // cy.get(transaction.personal_tab).click()
        // cy.get(notification.transaction_item).should('contain', userA.id )
        // .and('contain' , userB.id).first().click()

        cy.wait('@getNotifications')
        const likesCountSelector = '[data-test*=transaction-like-count]'
        cy.contains(likesCountSelector, 0)
        cy.get(notification.like_button).click()
        // a successful "like" should disable the button and increment
        // the number of likes
        cy.get(notification.like_button).should('be.disabled')
        cy.contains(likesCountSelector, 1)

        cy.ui_logout()
        cy.ui_login(userB.username, password)
        cy.wait('@getNotifications')
            .its('response.body.results.length')
            .as('preDismissedNotificationCount')

        cy.visit('/notifications')
        cy.wait('@getNotifications')

        cy.get(notification.list_item)
            .first()
            .should('contain', userA.firstname )
            .and('contain', 'liked')

        cy.get(notification.dismiss_button).first().click({ force: true })
        cy.wait('@updateNotification')

        cy.get('@preDismissedNotificationCount').then((count) => {
            cy.get(notification.list_item).should('have.length.lessThan', Number(count))
        })
    })

        it('User C likes a transaction between User A and User B; User A and User B get notifications that User C liked transaction', function () {
        cy.ui_login(userC.username, password)
        cy.wait('@getNotifications')
        cy.visit('/transaction/7XaoAWOrn13')

        const likesCountSelector = '[data-test*=transaction-like-count]'
        cy.contains(likesCountSelector, 1)
        cy.get(notification.like_button).click()
        cy.get(notification.like_button).should('be.disabled')
        cy.contains(likesCountSelector, 2)
        cy.ui_logout()
        cy.ui_login(userA.username, password)

        cy.get(notification.link).click()
        cy.wait('@getNotifications')
        cy.location('pathname').should('equal', '/notifications')

        cy.get(notification.list_item)
            .first()
            .should('contain', userC.firstname)
            .and('contain', 'liked')

        cy.ui_logout()
        cy.ui_login(userB.username, password)

        cy.get(notification.link).click()
        cy.wait('@getNotifications')

        cy.get(notification.list_item)
            .first()
            .should('contain', userC.firstname)
            .and('contain', 'liked')

    })

        it('User A comments on a transaction of User B; User B gets notification that User A commented on their transaction', function () {
        cy.ui_login(userA.username, password)
        cy.wait('@getNotifications')
        cy.visit('/transaction/7XaoAWOrn13')

        cy.get(notification.comment_field).type('Thank You{enter}')
        cy.wait('@postComment')
        cy.ui_logout()
        cy.ui_login(userB.username, password)

        cy.get(notification.link).click()
        cy.wait('@getNotifications')

        cy.get(notification.list_item)
            .first()
            .should('contain', userA.firstname)
            .and('contain', 'commented')
    })

        it('User C comments on a transaction between User A and User B; User A and B get notifications that User C commented on their transaction', function () {
        cy.ui_login(userC.username, password);
        cy.wait('@getNotifications')
        cy.visit('/transaction/7XaoAWOrn13')
        cy.get(notification.comment_field).type('Thank You{enter}')
        cy.wait('@postComment')

        cy.ui_logout()
        cy.ui_login(userA.username, password)
        cy.get(notification.link).click()
        cy.wait('@getNotifications')

        cy.get(notification.list_item)
            .first()
            .should('contain', userC.firstname)
            .and('contain', 'commented')

        cy.ui_logout()
        cy.ui_login(userB.username, password)
        cy.get(notification.link).click()
        cy.wait('@getNotifications')
        cy.get(notification.list_item)
            .first()
            .should('contain', userC.firstname)
            .and('contain', 'commented')
    })

        it('User A sends a payment to User B', function () {
        cy.ui_login(userA.username, password)
        cy.wait('@getNotifications')
        cy.get(transaction.new_transaction_button).click()

        const transactionAmount = 5
        const noteText = '🍕Pizza'

        cy.get(transaction.contacts_list)
            .should('be.visible')
            .contains('Arely Kertzmann')
            .click()
        cy.get(transaction.selected_contact_title).should(
            'have.text', 'Arely Kertzmann')
        cy.get(transaction.amount_field)
            .type(transactionAmount)
            .should('contain.value', transactionAmount)
        cy.get(transaction.note_field)
            .type(noteText)
            .should('contain.value', noteText)
        cy.get(transaction.create_submit_payment).click()
        cy.wait('@createTransaction').its('response.statusCode').should('eq', 200)
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')

        cy.ui_logout()
        cy.ui_login(userB.username, password)
        cy.get(notification.link).click()
        cy.get(notification.list_item)
            .first()
            .should('contain', userB.firstname)
            .and('contain', 'received payment')
    })

        it('User A sends a payment request to User C', function () {
        cy.ui_login(userA.username, password)
        cy.wait('@getNotifications')
        cy.get(transaction.new_transaction_button).click()

        const transactionAmount = 30
        const noteText = '🛫🛬 Airfare'

        cy.get(transaction.contacts_list)
            .should('be.visible')
            .contains('Kaylin Homenick')
            .click()
        cy.get(transaction.selected_contact_title).should(
            'have.text', 'Kaylin Homenick'
        )
        cy.get(transaction.amount_field)
            .type(transactionAmount)
            .should('contain.value', transactionAmount);
        cy.get(transaction.note_field)
            .type(noteText)
            .should('contain.value', noteText);
        cy.get(transaction.create_submit_request).click();
        cy.wait('@createTransaction').its('response.statusCode').should('eq', 200);

        cy.ui_logout()
        cy.ui_login(userC.username, password)
        cy.get(notification.link).click()
        cy.get(notification.list_item)
            .first()
            .should('contain', userA.firstname)
            .and('contain', 'requested payment')
    })
    })
    it('renders an empty notifications state', function () {
        cy.intercept('GET', '/notifications', []).as('notifications')
        cy.ui_login(userA.username, password)
        cy.get(notification.sidenav_notifications).click()
        cy.location('pathname').should('equal', '/notifications')
        cy.get(notification.list).should('not.exist')
        cy.get(notification.list_header).should('contain', 'No Notifications')

    })
})