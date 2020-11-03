describe('Confirm page directly', function () {
  it('should prevent access', function () {
    cy.visit('/confirm', {failOnStatusCode: false});
    cy.get('h1').should('contain', 'there is a problem with the service');
  });
});

describe('Confirm page ', function () {
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
    cy.get('#main-content form button.naturescot-forward-button').click();
    // POST `/best-practice`
    // ~GET `/referee`~
    // POST `/referee`
    cy.get('#main-content form input[type="text"]#referee-name').type('Test User');
    cy.get('#main-content form input[type="text"]#referee-email').type('testuser@email.com');
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/details`~
    // FILL the form
    cy.get('input[type="text"]#full-name').type('Nature Scot', {delay: 1});
    cy.get('input[type="text"]#address-line-1').type('Great Glen House', {delay: 1});
    cy.get('input[type="text"]#address-town').type('Inverness', {delay: 1});
    cy.get('input[type="text"]#address-postcode').type('IV3 8NW', {delay: 1});
    cy.get('input[type="tel"]#phone-number').type('01463 725 000', {delay: 1});
    cy.get('input[type="text"]#email-address').type('licensing@nature.scot', {delay: 1});
    // POST `/details`
    cy.get('#main-content form button.naturescot-forward-button').click();
    // ~GET `/confirm`~
  });

  it('should allow access if the user visits all the pages in order', function () {
    cy.visit('/confirm');
    cy.get('h1').should('contain', 'answers before sending');
  });
});
