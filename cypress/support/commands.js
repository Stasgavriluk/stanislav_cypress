import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {main_page} from "../selectors/main_page.selector";

const apiUrl = "http://localhost:3001";

Cypress.Commands.add("login_ui", (username, password) => {
    cy.visit("/signin")
    cy.intercept("POST", "/login").as("signin")
    cy.get(sign_in_page.signin_username).type(username)
    cy.get(sign_in_page.signin_password).type(password)
    cy.get(sign_in_page.signin_submit).click()
    cy.wait("@signin")
})

Cypress.Commands.add("sign_up_ui", (username, password) => {
    cy.visit("/signup")
    cy.intercept("POST", "/users").as("signup")
    cy.get(sign_in_page.signup_title).should("be.visible").and("contain", "Sign Up")
    cy.get(sign_in_page.signup_first_name).type('Aleks')
    cy.get(sign_in_page.signup_last_name).type('Morgan')
    cy.get(sign_in_page.signup_username).type(username)
    cy.get(sign_in_page.signup_password).type(password)
    cy.get(sign_in_page.signup_confirm_password).type(password)
    cy.get(sign_up_page.signup_submit).click()
    cy.wait("@signup")
})

Cypress.Commands.add("onboarding_ui", () => {
    cy.get(main_page.onboarding_dialog_content).should('be.visible')
    cy.get('[data-test="user-onboarding-next"]').click()
    cy.get(main_page.bank_name).type('Privat Bank')
    cy.get(main_page.routing_number).type('123456789')
    cy.get(main_page.account_number).type('987654321')
    cy.get(main_page.bankaccount_submit_button).click()
    cy.get('[data-test="user-onboarding-next"]').click()
})

Cypress.Commands.add("logout_ui", () => {
    cy.get(sign_in_page.log_out).should('be.visible').click()
    cy.url().should('contain', '/signin')
})

Cypress.Commands.add("switchUser_ui", (username, password) => {
    cy.logout_ui()
    cy.login_ui(username, password)
})

Cypress.Commands.add("sign_up_API", (username, password) => {
    return cy.request("POST", `${apiUrl}/users`, {
        firstName: "Aleks",
        lastName: "Morgan",
        username,
        password: password,
        confirmPassword: password,
    })
})

Cypress.Commands.add("log_in_API", (username, password ) => {
    const log = Cypress.log({
        name: "loginbyxstate",
        displayName: "LOGIN BY XSTATE",
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
    });

    cy.intercept("POST", "/login").as("loginUser");
    cy.intercept("GET", "/checkAuth").as("getUserProfile");
    cy.visit("/signin", { log: false });

    cy.window({ log: false }).then((win) =>
        win.authService.send("LOGIN", { username, password })
    );

    cy.wait("@loginUser").then((loginUser) => {
        log.set({
            consoleProps() {
                return {
                    username,
                    password,
                    userId: loginUser.response.body.user.id,
                };
            },
        });
    });
    cy.url().should("not.contain", "/signin");

    return cy
        .get('[data-test="list-skeleton"]')
        .should("not.exist")
        .then(() => {
            log.snapshot("after");
            log.end();
        });
})

Cypress.Commands.add("log_out_API", ( ) => {
    const log = Cypress.log({
        name: "logoutByXstate",
        displayName: "LOGOUT BY XSTATE",
        message: [`🔒 Logging out current user`],
        // @ts-ignore
        autoEnd: false,
    });

    cy.window({ log: false }).then((win) => {
        log.snapshot("before");
        win.authService.send("LOGOUT");
    });

    return cy
        .location("pathname")
        .should("equal", "/signin")
        .then(() => {
            log.snapshot("after");
            log.end();
        });
})

Cypress.Commands.add("switchUser_API", (username, password = "s3cret") => {
    cy.log_out_API();
    cy.log_in_API(username, password);
})

Cypress.Commands.add("create_bank_account_API", (bankName, accountNumber, routingNumber) => {
    cy.request("POST", `${apiUrl}/bankAccounts`, {
        bankName,
        accountNumber,
        routingNumber,
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.account.id).to.be.a("string");
    })
})

Cypress.Commands.add("delete_bank_account_API", (bankAccountId) => {
    cy.request("DELETE", `${apiUrl}/bankAccounts/${bankAccountId}`)
        .then((response) => {
        expect(response.status).to.eq(200);
    })
})

Cypress.Commands.add("add_contact_API", (userId) => {
    cy.request("POST", `${apiUrl}/contacts`, {
        contactUserId: userId,
    })
        .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.contact.id).to.be.a("string");
    })
});

Cypress.Commands.add("delete_contact_API", (userId) => {
    cy.request("DELETE", `${apiUrl}/contacts/${userId}`)
        .then((response) => {
            expect(response.status).to.eq(200);
        })
});