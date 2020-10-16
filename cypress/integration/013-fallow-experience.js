describe('Fallow Experience page directly', function () {
  it('should prevent access', function () {
    cy.visit('/fallow-experience', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Fallow Experience page ', function () {
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
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/fallow-experience');
    cy.get('h1').should('contain', 'Do you control fallow deer');
  });

  it('blank entry + main button should navigate to same page with error', function () {
    cy.visit('/fallow-experience');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/fallow-experience');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'You must select yes or no');
  });

  it('"yes" radio + main button should display form', function () {
    cy.visit('/fallow-experience');
    cy.get('#main-content form input[type="radio"][value="yes"]').click();
    cy.get('#main-content form input#fallow-experience-years').click();
    cy.get('#main-content form input#fallow-control-number').click();
  });

  it('"yes" radio + main button should display form and try to submit empty form but get errors', function () {
    cy.visit('/fallow-experience');
    cy.get('#main-content form input[type="radio"][value="yes"]').click();
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/fallow-experience');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'You must enter the number of years experience you have controlling fallow deer')
      .and('contain', 'You must enter the number of fallow deer you have controlled in the last 5 years');
  });

  it('"yes" radio + main button should display form and try to submit with invalid chars in experience but get errors', function () {
    cy.visit('/fallow-experience');
    cy.get('#main-content form input[type="radio"][value="yes"]').click();
    cy.get('input[type="text"]#fallow-experience-years').type('ab');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/fallow-experience');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number of years experience you have controlling fallow deer must only contain numbers'
    );
  });

  it('"yes" radio + main button should display form and try to submit with invalid chars in experience and control but get errors', function () {
    cy.visit('/fallow-experience');
    cy.get('#main-content form input[type="radio"][value="yes"]').click();
    cy.get('input[type="text"]#fallow-experience-years').type('ab');
    cy.get('input[type="text"]#fallow-control-number').type('ab');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/fallow-experience');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');
    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The number of years experience you have controlling fallow deer must only contain numbers')
      .and('contain', 'The number of fallow deer you control must only contain numbers');
  });
});
