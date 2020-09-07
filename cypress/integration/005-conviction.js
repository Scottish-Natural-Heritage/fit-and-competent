describe('Conviction page directly', function () {
  it('should prevent access', function () {
    cy.visit('/conviction', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Conviction page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/information`~
    // POST `/information`
    cy.get('#main-content form button.naturescot-forward-button').click();

    // ~GET `/gdpr`~
    // POST `/gdpr`
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/conviction');
    cy.get('h1').should('contain', 'Have you been convicted of a wildlife crime?');
  });

});
