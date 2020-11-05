describe('dsc1 details page directly', function () {
  it('should prevent access', function () {
    cy.visit('/dsc1-details', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('DSC1 Details page ', function () {
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
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/dsc1-details');
    cy.get('h1').should('contain', 'What are your Deer Stalking Certificate 1 details?');
  });

  it('blank entry + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'You must provide qualification details');
  });

  it('filled-out dsc1 entry with no number + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');

    cy.get('input[type="text"]#qualification-date-dsc1Day').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Month').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'Deer Stalking Certificate 1 Number must be 5 characters or fewer'
    );
  });

  it('filled-out dsc1 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');
    cy.get('input[type="text"]#qualification-reference').type('test123');
    cy.get('input[type="text"]#qualification-date-dsc1Day').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Month').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'Deer Stalking Certificate 1 Number must only contain numbers'
    );
  });

  it('filled-out dsc1 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');
    cy.get('input[type="text"]#qualification-reference').type('123456');
    cy.get('input[type="text"]#qualification-date-dsc1Day').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Month').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'Deer Stalking Certificate 1 Number must be 5 characters or fewer'
    );
  });

  it('filled-out dsc1 entry with future date + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');

    cy.get('input[type="text"]#qualification-reference').type('12345');
    cy.get('input[type="text"]#qualification-date-dsc1Day').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Month').type('01');
    cy.get('input[type="text"]#qualification-date-dsc1Year').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your Deer Stalking Certificate 1 must be in the past'
    );
  });

  it('filled-out dsc1 entry with invalid date + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');

    cy.get('input[type="text"]#qualification-reference').type('12345');
    cy.get('input[type="text"]#qualification-date-dsc1Day').type('31');
    cy.get('input[type="text"]#qualification-date-dsc1Month').type('02');
    cy.get('input[type="text"]#qualification-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your Deer Stalking Certificate 1 must be a real date'
    );
  });

  it('filled-out dsc1 entry with no date + main button should navigate to same page with error', function () {
    cy.visit('/dsc1-details');

    cy.get('input[type="text"]#qualification-reference').type('12345');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/dsc1-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The date you obtained your Deer Stalking Certificate 1 must include a year')
      .and('contain', 'The date you obtained your Deer Stalking Certificate 1 must include a month')
      .and('contain', 'The date you obtained your Deer Stalking Certificate 1 must include a day');
  });
});
