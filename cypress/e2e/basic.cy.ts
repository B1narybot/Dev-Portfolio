describe('empty spec', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the main heading', () => {
    // Check that the h1 element exists and contains the text "ABOUT"
    cy.get('h1')
      .should('contain', 'ABOUT')
      .and('be.visible');
  });

  it('renders the image', () => {
    // Check that the image is visible and has a valid natural width
    cy.get('img')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });
});
