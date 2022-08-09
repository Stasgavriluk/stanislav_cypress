export const transaction = {
    new_transaction_button: "[data-test='nav-top-new-transaction']",
    search_input: '[data-test="user-list-search-input"]',
    contacts_list_item: '[data-test*="user-list-item"]',
    contacts_list: "[data-test='users-list']",
    selected_contact_title: ".MuiBox-root > .MuiGrid-container > :nth-child(2) > .MuiTypography-root",
    amount_field: "#amount",
    amount_validation_message: "#transaction-create-amount-input-helper-text",
    note_field: "#transaction-create-description-input",
    note_validation_message: "#transaction-create-description-input-helper-text",
    create_submit_payment: "[data-test='transaction-create-submit-payment']",
    create_submit_request: "[data-test='transaction-create-submit-request']",
    user_balance: '[data-test="sidenav-user-balance"]',
    alert_bar_success: "[data-test='alert-bar-success']",
    create_another_transaction: "[data-test='new-transaction-create-another-transaction']",
    return_to_transactions: "[data-test='new-transaction-return-to-transactions']",
    app_name_logo: "[data-test='app-name-logo']",
    personal_tab: "[data-test='nav-personal-tab']",
    everyone_tab: '[data-test="nav-public-tab"]',
    friends_tab: '[data-test="nav-contacts-tab"]',
    transaction_list: "[data-test='transaction-list']",
    accept_transaction_request_button:
        '[data-test*="transaction-accept-request"]',
    reject_transaction_request_button:
        '[data-test*="transaction-reject-request"]',
    transaction_item: '[data-test*="transaction-item"]',
    tabs: '[data-test="nav-transaction-tabs"]',
    detail_header: '[data-test="transaction-detail-header"]',

    createPayTransaction(
        transactionAmount,
        noteText,
        receiverName = "Edgar Johns"
    ) {
        cy.wait("@getUsers")
        cy.get(transaction.contacts_list)
            .should("be.visible")
            .contains(receiverName)
            .click({ force: true })
        cy.get(transaction.selected_contact_title).should(
            "have.text", receiverName)
        cy.get(transaction.amount_field)
            .type(transactionAmount)
            .should("contain.value", transactionAmount);
        cy.get(transaction.note_field)
            .type(noteText)
            .should("contain.value", noteText);
        cy.get(transaction.create_submit_payment).click();
        cy.wait("@createTransaction").its("response.statusCode").should("eq", 200);
        cy.wait("@checkAuth");
        cy.get(transaction.alert_bar_success).should('be.visible').and('have.text', 'Transaction Submitted!')

    },
    createRequestTransaction(
        transactionAmount,
        noteText,
        receiverName = "Edgar Johns"
    ) {
        cy.wait("@getUsers");
        cy.get(transaction.contacts_list)
            .should("be.visible")
            .contains(receiverName)
            .click({ force: true })
        cy.get(transaction.selected_contact_title).should(
            "have.text",
            receiverName
        );
        cy.get(transaction.amount_field)
            .type(transactionAmount)
            .should("contain.value", transactionAmount);
        cy.get(transaction.note_field)
            .type(noteText)
            .should("contain.value", noteText);
        cy.get(transaction.create_submit_request).click();
        cy.wait("@createTransaction").its("response.statusCode").should("eq", 200);
        cy.wait("@checkAuth");
    },
}

