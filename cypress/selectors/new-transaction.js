export const transaction = {
    new_transaction_button: "[data-test='nav-top-new-transaction']",
    search_input: '#user-list-search-input',

    contacts_list: "[data-test='users-list']",
    contacts_list_item: '[data-test*="user-list-item"]',
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
    transaction_list: "[data-test='transaction-list']",

    createPayTransaction(transactionAmount, noteText) {
        cy.wait("@getUsers")
        cy.get(transaction.contacts_list)
            .should("be.visible")
            .contains("Edgar Johns")
            .click()
        cy.get(transaction.selected_contact_title).should(
            "have.text", "Edgar Johns")
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
    createRequestTransaction(transactionAmount, noteText) {
        cy.wait("@getUsers");
        cy.get(transaction.contacts_list)
            .should("be.visible")
            .contains("Edgar Johns")
            .click();
        cy.get(transaction.selected_contact_title).should(
            "have.text",
            "Edgar Johns"
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

