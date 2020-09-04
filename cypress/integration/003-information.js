describe('information page directly', function () {
  it('should prevent access', function () {
    cy.visit('/information', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('information page ', function () {
  beforeEach(() => {
    // GET `/start`
    cy.visit('/start');

    // POST `/start`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/information`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/information');
    cy.get('h1').should('contain', 'information do you need to provide');
  });

  it('main button should navigate to gdpr', function () {
    cy.visit('/information');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/gdpr');
  });
});
