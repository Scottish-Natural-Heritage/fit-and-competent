describe('GDPR page directly', function () {
  it('should prevent access', function () {
    cy.visit('/gdpr', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('GDPR page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/information`~
    // POST `/information`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/gdpr`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/gdpr');
    cy.get('h1').should('contain', 'How we use your information');
  });

});
