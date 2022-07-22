import {sign_in_page} from "../selectors/sign_in_page";

Cypress.Commands.add("ui_login", (username, password, { rememberUser = false } = {}) => {
    const signinPath = "/signin"
    cy.intercept("POST", "/login").as("loginUser");
    cy.location("pathname", { log: false }).then((currentPath) => {
        if (currentPath !== signinPath) {
            cy.visit(signinPath);
        }
    })
    cy.get(sign_in_page.username_field).type(username);
    cy.get(sign_in_page.password_field).type(password);

    if (rememberUser) {
        cy.get(sign_in_page.checkbox).find("input").check();
    }

    cy.get(sign_in_page.signin_submit).click();
    cy.wait("@loginUser")
})