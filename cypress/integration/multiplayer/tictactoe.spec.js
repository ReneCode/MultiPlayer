const URL_START = "http://localhost:3000";

describe("tictactoe", () => {
  beforeEach(() => {
    cy.visit(URL_START);
  });

  it("list games", () => {
    cy.get("[data-cy=game-name-container] > :nth-child(2)").should(
      "have.text",
      "Tic Tac Toe"
    );

    cy.get("[data-cy=game-name-container] > :nth-child(3)").should(
      "have.text",
      "Five in a row"
    );
  });

  it("start tictactoe", () => {
    cy.get("[data-cy=game-name-container] > :nth-child(2)").click();
    cy.url().should("include", `${URL_START}/g/`);
  });
});
