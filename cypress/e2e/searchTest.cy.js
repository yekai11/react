/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Search feature", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  it("displays default search page", () => {
    cy.get("#search-input").should("exist");
    cy.get("#search-button").should("exist");
    cy.get("#login-button").should("exist");
  });

  it("search with valid input and goes back to search page", () => {
    const searchTerm = "ni hao ma";

    cy.get("#search-input").type(`${searchTerm}`);
    cy.get("#search-button").click();

    cy.get("#search-result").should("have.text", searchTerm);
    cy.get("#back-button").click();
    cy.get("#search-input").should("exist");
    cy.get("#search-button").should("exist");
    cy.get("#login-button").should("exist");
  });

  it("search with invalid input and stays at search page", () => {
    const searchTerm = "<script>";

    cy.window().then((w) => (w.beforeReload = true));

    cy.get("#search-input").type(`${searchTerm}`);

    cy.get("#search-input").should(
      "have.value",
      searchTerm,
      "beforeReload",
      true
    );

    cy.get("#search-button").click();

    cy.get("#search-input").should(
      "not.have.value",
      searchTerm,
      "beforeReload"
    );
  });
});
