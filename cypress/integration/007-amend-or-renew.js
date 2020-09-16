describe('Amend or Renew page directly', function () {
  it('should prevent access', function () {
    cy.visit('/amend-or-renew', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Amend or Renew page ', function () {
  const todaysDate = Cypress.moment().format('YYYY');

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

    // ~GET `/conviction`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/conviction`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/firearm`~
    // POST `/firearm`
    cy.get('#main-content form input[type="text"]#certificate-number').type('123456789');
    cy.get('#main-content form input[type="text"]#certificate-issued-certificateIssuedDay').type('01');
    cy.get('#main-content form input[type="text"]#certificate-issued-certificateIssuedMonth').type('01');
    cy.get('#main-content form input[type="text"]#certificate-issued-certificateIssuedYear').type(todaysDate);
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/amend-or-renew');
    cy.get('h1').should('contain', 'What would you like to do?');
  });
});
