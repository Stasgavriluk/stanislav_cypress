import {settings} from "../selectors/user_settings";
import {functions} from "../helpers/functions";

const username = functions.generateUsername();
const password = "RestTest1!";
const firstName = "Huge";
const lastName = "Onil";
const email = "hugeonil@mailinator.com";
const phoneNumber = "0987654321";

describe("User Settings", function () {
    before("prepare an account", () => {
        cy.task("db:seed");
        cy.sign_up_ui(username, password);
        cy.login_ui(username, password);
        cy.onboarding_ui();
        cy.logout_ui();
    });

    beforeEach(function () {
        cy.login_ui(username, password);
        cy.get(settings.user).click();
        cy.url().should("contain", "/user/settings");
        cy.intercept("PATCH", "/users/*").as("updateUser");
    });

    it("renders the user settings form", function () {
        cy.get(settings.user_form).should("be.visible");
        cy.get(settings.first_name_input).should("be.visible");
        cy.get(settings.last_name_input).should("be.visible");
        cy.get(settings.email_input).should("be.visible");
        cy.get(settings.phone_input).should("be.visible");
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
        cy.get(settings.first_name_input).clear().type(firstName);
        cy.get(settings.last_name_input).clear().type(lastName);
        cy.get(settings.email_input).clear().type(email);
        cy.get(settings.phone_input).clear().type(phoneNumber).blur();

        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button)
            .click()
            .wait("@updateUser")
            .its("response.statusCode")
            .should("eq", 204);
        cy.get(settings.user_full_name).should("contain", firstName);
    });

    it("User should be able to update first name", function () {
        cy.get(settings.first_name_input).clear().type("New First Name");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button)
            .click()
            .wait("@updateUser")
            .its("response.statusCode")
            .should("eq", 204);
    });

    it("User should be able to update last name", function () {
        cy.get(settings.last_name_input).clear().type("New Last Name");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button)
            .click()
            .wait("@updateUser")
            .its("response.statusCode")
            .should("eq", 204);
    });

    it("User should be able to update email", function () {
        cy.get(settings.email_input).clear().type("email@email.com");
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button)
            .click()
            .wait("@updateUser")
            .its("response.statusCode")
            .should("eq", 204);
    });

    it("User should be able to update phone number", function () {
        cy.get(settings.phone_input).clear().type("6155551212").blur();
        cy.get(settings.submit_button).should("not.be.disabled");
        cy.get(settings.submit_button)
            .click()
            .wait("@updateUser")
            .its("response.statusCode")
            .should("eq", 204);
    });
});