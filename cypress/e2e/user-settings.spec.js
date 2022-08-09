import {settings} from "../selectors/user_settings";

describe("User Settings", function () {
    beforeEach(function () {
        cy.task("db:seed");
        cy.intercept("PATCH", "/users/*").as("updateUser");
        cy.intercept("GET", "/notifications*").as("getNotifications");
        const username = "Tavares_Barrows"
        const password = "s3cret"
        cy.ui_login(username, password);
        cy.get(settings.user).click();
    });

    it("renders the user settings form", function () {
        cy.wait("@getNotifications");
        cy.get(settings.user_form).should("be.visible");
        cy.location("pathname").should("include", "/user/settings");
    });

    it("should display user setting form errors", function () {
        ["first", "last"].forEach((field) => {
            cy.get(`#user-settings-${field}Name-input`).type("Abc").clear().blur();
            cy.get(`#user-settings-${field}Name-input-helper-text`)
                .should("be.visible")
                .and("contain", `Enter a ${field} name`);
        });

        cy.get(settings.email_input).type("abc").clear().blur();
        cy.get("#user-settings-email-input-helper-text")
            .should("be.visible")
            .and("contain", "Enter an email address");

        cy.get(settings.email_input).type("abc@bob.").blur();
        cy.get("#user-settings-email-input-helper-text")
            .should("be.visible")
            .and("contain", "Must contain a valid email address");

        cy.get(settings.phone_input).type("abc").clear().blur();
        cy.get("#user-settings-phoneNumber-input-helper-text")
            .should("be.visible")
            .and("contain", "Enter a phone number");

        cy.get(settings.phone_input).type("615-555-").blur();
        cy.get("#user-settings-phoneNumber-input-helper-text")
            .should("be.visible")
            .and("contain", "Phone number is not valid");

        cy.get(settings.submit_button).should("be.disabled");
    });

    it("updates first name, last name, email and phone number", function () {
        cy.get(settings.first_name_input).clear().type("New First Name");
        cy.get(settings.last_name_input).clear().type("New Last Name");
        cy.get(settings.email_input).clear().type("email@email.com");
        cy.get(settings.phone_input).clear().type("6155551212").blur();

        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button).click();

        cy.wait("@updateUser").its("response.statusCode").should("equal", 204);
        cy.get(settings.user_full_name).should("contain", "New First Name");
    });

    it("User should be able to update first name", function () {
        cy.get(settings.first_name_input).clear().type("New First Name");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button).click();
    });

    it("User should be able to update last name", function () {
        cy.get(settings.last_name_input).clear().type("New Last Name");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button).click();
    });

    it("User should be able to update email", function () {
        cy.get(settings.email_input).clear().type("email@email.com");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button).click();
    });

    it("User should be able to update phone number", function () {
        cy.get(settings.phone_input).clear().type("6155551212").blur();
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button).click();
    });
});