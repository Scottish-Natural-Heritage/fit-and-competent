describe('qualification page directly', function () {
  it('should prevent access', function () {
    cy.visit('/qualification', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Qualification page ', function () {
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
    // ~GET `/qualification`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/qualification');
    cy.get('h1').should('contain', 'What is the highest Level of Deer Stalking Certificate you hold?');
  });

  it('blank entry + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'You must select at least one qualification you hold');
  });

  it('"dsc1" radio + main button should navigate to dsc1-details', function () {
    cy.visit('/qualification');
    cy.get('#main-content form input[type="radio"][value="dsc1"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');
  });

  it('"dsc2" radio + main button should navigate to dsc2-details', function () {
    cy.visit('/qualification');
    cy.get('#main-content form input[type="radio"][value="dsc2"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc2-details');
  });

  it('"other" radio + main button should navigate to other-qualification-details', function () {
    cy.visit('/qualification');
    cy.get('#main-content form input[type="radio"][value="other"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-qualification-details');
  });
});
