describe('Best Practice page directly', function () {
  it('should prevent access', function () {
    cy.visit('/best-practice', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Best Practice page ', function () {
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
    // CLICK dsc1
    cy.get('#main-content form input[type="radio"][value="dsc1"]').click();
    // POST `/qualification`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/dsc1-details`~
    // POST `/dsc1-details`
    cy.get('#main-content form input[type="text"]#dsc1-number').type('12345');
    cy.get('#main-content form input[type="text"]#dsc1-date-dsc1Day').type('01');
    cy.get('#main-content form input[type="text"]#dsc1-date-dsc1Month').type('01');
    cy.get('#main-content form input[type="text"]#dsc1-date-dsc1Year').type(todaysDate);
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/red-experience`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/red-experience`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/roe-experience`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/roe-experience`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/sika-experience`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/sika-experience`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/fallow-experience`~
    // CLICK no
    cy.get('#main-content form input[type="radio"][value="no"]').click();
    // POST `/fallow-experience`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/best-practice`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/best-practice');
    cy.get('h1').should(
      'contain',
      'Do you have a sound knowledge and understanding of Scotland’s Wild Deer Best Practice Guides?'
    );
  });

  it('"no" checkbox + main button should navigate to same page with error', function () {
    cy.visit('/best-practice');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/best-practice');
    cy.get('h2#error-summary-title').should('contain', 'There is a problem');
    cy.get('span#bestPractice-error').should('contain', 'You must confirm');
  });
});
