describe('Other Qualification Details page directly', function () {
  it('should prevent access', function () {
    cy.visit('/other-qualification-details', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Other Qualification Details page ', function () {
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
    // CLICK other
    cy.get('#main-content form input[type="radio"][value="other"]').click();
    // POST `/qualification`
    cy.get('#main-content form button.naturescot-forward-button').click();
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/other-qualification-details');
    cy.get('h1').should('contain', 'Enter the details of your Other/Equivalent Deer Stalking Certificate below');
  });

  it('filled-out other entry with no name + main button should navigate to same page with error', function () {
    cy.visit('/other-qualification-details');

    cy.get('input[type="text"]#other-date-otherDay').type('01');
    cy.get('input[type="text"]#other-date-otherMonth').type('01');
    cy.get('input[type="text"]#other-date-otherYear').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-qualification-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should('contain', 'Enter the Name of your certificate');
  });

  it('filled-out other entry with future date + main button should navigate to same page with error', function () {
    cy.visit('/other-qualification-details');

    cy.get('input[type="text"]#other-name').type('test qualification');
    cy.get('input[type="text"]#other-date-otherDay').type('01');
    cy.get('input[type="text"]#other-date-otherMonth').type('01');
    cy.get('input[type="text"]#other-date-otherYear').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-qualification-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your certificate must be in the past'
    );
  });

  it('filled-out other entry with invalid date + main button should navigate to same page with error', function () {
    cy.visit('/other-qualification-details');

    cy.get('input[type="text"]#other-name').type('test qualification');
    cy.get('input[type="text"]#other-date-otherDay').type('31');
    cy.get('input[type="text"]#other-date-otherMonth').type('02');
    cy.get('input[type="text"]#other-date-otherYear').type('2020');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-qualification-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a').should(
      'contain',
      'The date you obtained your certificate must be a real date'
    );
  });

  it('filled-out other entry with no date + main button should navigate to same page with error', function () {
    cy.visit('/other-qualification-details');

    cy.get('input[type="text"]#other-name').type('test qualification');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/other-qualification-details');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'The date you obtained your certificate must include a year')
      .and('contain', 'The date you obtained your certificate must include a month')
      .and('contain', 'The date you obtained your certificate must include a day');
  });
});
