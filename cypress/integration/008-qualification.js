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
    // ~GET `/amend-or-renew`~
    // CLICK Apply for a new registration
    cy.get('#main-content form input[type="checkbox"]#application-type').click();
    // POST `/amend-or-renew`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/qualification`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/qualification');
    cy.get('h1').should('contain', 'What are the details of your deer stalking certificate?');
  });

  it('blank entry + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'You must provide details for at least one qualification');
  });

  it('filled-out dsc1 entry with no number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc1-date-dsc1Day').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Month').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 1 Qualification must be less than or equal to 5 characters'
    );
  });

  it('filled-out dsc1 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('input[type="text"]#dsc1-number').type('test123');
    cy.get('input[type="text"]#dsc1-date-dsc1Day').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Month').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 1 Qualification must only contain numbers'
    );
  });

  it('filled-out dsc1 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('input[type="text"]#dsc1-number').type('123456');
    cy.get('input[type="text"]#dsc1-date-dsc1Day').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Month').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 1 Qualification must be less than or equal to 5 characters'
    );
  });

  it('filled-out dsc1 entry with future date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc1-number').type('12345');
    cy.get('input[type="text"]#dsc1-date-dsc1Day').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Month').type('01');
    cy.get('input[type="text"]#dsc1-date-dsc1Year').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your DSC 1 qualification must be in the past'
    );
  });

  it('filled-out dsc1 entry with invalid date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc1-number').type('12345');
    cy.get('input[type="text"]#dsc1-date-dsc1Day').type('31');
    cy.get('input[type="text"]#dsc1-date-dsc1Month').type('02');
    cy.get('input[type="text"]#dsc1-date-dsc1Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your DSC 1 qualification must be a real date'
    );
  });

  it('filled-out dsc1 entry with no date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc1-number').type('12345');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The date you obtained your DSC 1 qualification must include a year')
      .and('contain', 'The date you obtained your DSC 1 qualification must include a month')
      .and('contain', 'The date you obtained your DSC 1 qualification must include a day');
  });

  it('filled-out dsc2 entry with no number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc2-date-dsc2Day').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Month').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 2 Qualification must be less than or equal to 5 characters'
    );
  });

  it('filled-out dsc2 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('input[type="text"]#dsc2-number').type('test123');
    cy.get('input[type="text"]#dsc2-date-dsc2Day').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Month').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 2 Qualification must only contain numbers'
    );
  });

  it('filled-out dsc2 entry with invalid number + main button should navigate to same page with error', function () {
    cy.visit('/qualification');
    cy.get('input[type="text"]#dsc2-number').type('123456');
    cy.get('input[type="text"]#dsc2-date-dsc2Day').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Month').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The number on your DSC 2 Qualification must be less than or equal to 5 characters'
    );
  });

  it('filled-out dsc2 entry with future date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc2-number').type('12345');
    cy.get('input[type="text"]#dsc2-date-dsc2Day').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Month').type('01');
    cy.get('input[type="text"]#dsc2-date-dsc2Year').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your DSC 2 qualification must be in the past'
    );
  });

  it('filled-out dsc2 entry with invalid date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc2-number').type('12345');
    cy.get('input[type="text"]#dsc2-date-dsc2Day').type('31');
    cy.get('input[type="text"]#dsc2-date-dsc2Month').type('02');
    cy.get('input[type="text"]#dsc2-date-dsc2Year').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your DSC 2 qualification must be a real date'
    );
  });

  it('filled-out dsc2 entry with no date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#dsc2-number').type('12345');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The date you obtained your DSC 2 qualification must include a year')
      .and('contain', 'The date you obtained your DSC 2 qualification must include a month')
      .and('contain', 'The date you obtained your DSC 2 qualification must include a day');
  });

  it('filled-out other entry with no name + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#other-date-otherDay').type('01');
    cy.get('input[type="text"]#other-date-otherMonth').type('01');
    cy.get('input[type="text"]#other-date-otherYear').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'Enter the Name of your certificate');
  });

  it('filled-out other entry with future date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#other-name').type('test qualification');
    cy.get('input[type="text"]#other-date-otherDay').type('01');
    cy.get('input[type="text"]#other-date-otherMonth').type('01');
    cy.get('input[type="text"]#other-date-otherYear').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your qualification must be in the past'
    );
  });

  it('filled-out other entry with invalid date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#other-name').type('test qualification');
    cy.get('input[type="text"]#other-date-otherDay').type('31');
    cy.get('input[type="text"]#other-date-otherMonth').type('02');
    cy.get('input[type="text"]#other-date-otherYear').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your qualification must be a real date'
    );
  });

  it('filled-out other entry with no date + main button should navigate to same page with error', function () {
    cy.visit('/qualification');

    cy.get('input[type="text"]#other-name').type('test qualification');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/qualification');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The date you obtained your qualification must include a year')
      .and('contain', 'The date you obtained your qualification must include a month')
      .and('contain', 'The date you obtained your qualification must include a day');
  });
});
