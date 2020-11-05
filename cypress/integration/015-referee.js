describe('Referee details page directly', function () {
  it('should prevent access', function () {
    cy.visit('/referee', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Referee Details page ', function () {
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
    cy.get('#main-content form input[type="text"]#qualification-reference').type('12345');
    cy.get('#main-content form input[type="text"]#qualification-date-dsc1Day').type('01');
    cy.get('#main-content form input[type="text"]#qualification-date-dsc1Month').type('01');
    cy.get('#main-content form input[type="text"]#qualification-date-dsc1Year').type(todaysDate);
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

    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/best-practice`~
    // CLICK agree checkbox
    cy.get('#main-content form input[type="checkbox"]#bestPractice').click();
    // POST `/best-practice`
    // ~GET `/referee`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/referee');
    cy.get('h1').should('contain', 'Please provide details of a referee');
  });

  it('blank entry + main button should navigate to same page with error', function () {
    cy.visit('/referee');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/referee');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The full name of your referee is required')
      .and('contain', 'You must enter the email that can be used to contact your referee');
  });

  it('filled-out referee entry with no name + main button should navigate to same page with error', function () {
    cy.visit('/referee');

    cy.get('input[type="text"]#referee-email').type('TestReferee@email.com');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/referee');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'The full name of your referee is required');
  });

  it('filled-out referee entry with no email + main button should navigate to same page with error', function () {
    cy.visit('/referee');
    cy.get('input[type="text"]#referee-name').type('Test Referee');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/referee');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'You must enter the email that can be used to contact your referee'
    );
  });

  it('filled-out referee entry with invalid email + main button should navigate to same page with error', function () {
    cy.visit('/referee');
    cy.get('input[type="text"]#referee-name').type('Test Referee');
    cy.get('input[type="text"]#referee-email').type('TestReferee email.com');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/referee');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'You must enter a valid email address');
  });
});
