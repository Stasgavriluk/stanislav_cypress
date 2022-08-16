import {functions} from "../../helpers/functions";

const username = functions.generateUsername()
    const password = "RestTest1!"
    const bankName = "Monobank"
    const accountNumber = "123456789"
    const routingNumber = "987654321"

let bankAccountId = "";

describe("", () => {
  before("prepare account", () => {
    cy.task("db:seed");
    cy.sign_up_API(username, password);
  });

  beforeEach("login using api", () => {
    cy.log_in_API(username, password);
  });

  it("creates new bank account", () => {
    cy.create_bank_account_API(bankName, accountNumber, routingNumber);
    cy.create_bank_account_API(bankName, accountNumber, routingNumber).then(
      (response) => {
        bankAccountId = response.body.account.id;
      }
    );
  });

  it("deletes created bank account", () => {
    cy.delete_bank_account_API(bankAccountId);
  });

  it("adds contact", () => {
    cy.add_contact_API("t45AiwidW");
  });

  it("removes added contact", () => {
    cy.delete_contact_API("t45AiwidW");
  });
});