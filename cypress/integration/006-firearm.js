describe('Firearm page directly', function () {
  it('should prevent access', function () {
    cy.visit('/firearm', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Firearm page ', function () {
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
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/firearm');
    cy.get('h1').should('contain', 'Firearm Certificate details');
  });

  it('blank entries + main button should navigate to same page with error', function () {
    cy.visit('/firearm');
    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/firearm');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should('contain', 'You must enter the number found on your firearm certificate.')
      .and('contain', 'Please enter a valid year')
      .and('contain', 'Please enter a valid month')
      .and('contain', 'Please enter a valid day');
  });

  it('filled-out entries with future date + main button should navigate to same page with error', function () {
    cy.visit('/firearm');

    cy.get('input[type="text"]#certificate-number').type('123456789');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedDay').type('01');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedMonth').type('01');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedYear').type('2999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/firearm');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should(
        'contain',
        'Your firearm certificate issue date can not be a future date.'
        );
  });

  it('filled-out entries with past date + main button should navigate to same page with error', function () {
    cy.visit('/firearm');

    cy.get('input[type="text"]#certificate-number').type('123456789');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedDay').type('01');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedMonth').type('01');
    cy.get('input[type="text"]#certificate-issued-certificateIssuedYear').type('1999');

    cy.get('#main-content form button.naturescot-forward-button').click();
    cy.url().should('include', '/firearm');

    cy.get('h2#error-summary-title').should('contain', 'There is a problem');

    cy.get('.govuk-error-summary ul li a')
      .should(
        'contain',
        'Your firearm certificate must be less than five years old.'
        );
  });
});
