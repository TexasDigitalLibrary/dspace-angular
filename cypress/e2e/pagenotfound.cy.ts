import { testA11y } from 'cypress/support/utils';

describe('PageNotFound', () => {
  it('should contain element ds-pagenotfound when navigating to page that does not exist', () => {
    // request an invalid page (UUIDs at root path aren't valid)
    cy.visit('/e9019a69-d4f1-4773-b6a3-bd362caa46f2', { failOnStatusCode: false });
    cy.get('ds-pagenotfound').should('be.visible');

    // Analyze <ds-pagenotfound> for accessibility issues
    testA11y('ds-pagenotfound');
  });

  it('should not contain element ds-pagenotfound when navigating to existing page', () => {
    cy.visit('/home');
    cy.get('ds-pagenotfound').should('not.exist');
  });

});
