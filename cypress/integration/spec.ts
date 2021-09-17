import { first } from "cypress/types/lodash";

var mockDocs = {data: [
  {
    _id: "1",
    name: "Test Doc1",
    html: "Test content1"
  }
]}; 

describe("Application actions", () => {

  beforeEach(() => {
    mockDocs = {data: [
      {
        _id: "1",
        name: "Test Doc1",
        html: "Test content1"
      }
    ]}; 

    cy.intercept(
      {
        method: 'GET', // Route all GET requests
        url: 'https://jsramverk-editor-rois20.azurewebsites.net/allDocs', // that have a URL that matches '/users/*'
      },
      mockDocs // and force the response to be: []
    ).as('getDocs');

    cy.intercept(
      {
        method: 'POST', // Route all GET requests
        url: 'https://jsramverk-editor-rois20.azurewebsites.net/save', // that have a URL that matches '/users/*'
      },
      {
        statusCode: 201,
      }
    ).as('getDocs');
    cy.visit('/');
  }); 

  it('loads existing documents', () => {
    // Confirm the added element exists in list.
    cy.wait('@getDocs').then((res) => {
      cy.get('.doc-list-container').first().contains('Test Doc1');
    });
  });

  it('saves new document', () => {
    cy.get('#save').first().click();
    cy.get('#filename-input').first().type("Test Doc2");
    cy.get('#confirm-save').first().click().then(() => {
      mockDocs.data.push({
        _id: "2",
        name: "Test Doc2",
        html: "Test content2"
      });
    });

    cy.intercept(
      {
        method: 'GET', // Route all GET requests
        url: 'https://jsramverk-editor-rois20.azurewebsites.net/allDocs', // that have a URL that matches '/users/*'
      },
      mockDocs
    ).as('getDocs'); // and assign an alias 

    // Confirm POST route is called.
    cy.waitFor('@saveDoc');

    // Confirm the added element exists in list.
    cy.wait('@getDocs').then((res) => {
      cy.get('.doc-list-container').first().contains('Test Doc1');
      cy.get('.doc-list-container').first().contains('Test Doc2');
    });
  });

  it('updates existing document', () => {
    cy.intercept(
      {
        url: 'https://jsramverk-editor-rois20.azurewebsites.net/update', // that have a URL that matches '/users/*'
      },
      {
        statusCode: 200,
      }
    ).as('updateDocs');
    cy.get('.doc-list-container').get('li').first().click();
    cy.get('#save').first().click();
    cy.get('#filename-input').first().type("Updated Document");
    cy.get('#confirm-save').first().click().then(() => {
      mockDocs.data[0].name = "Updated Document";
      mockDocs.data[0].html = "Updated Contents";
    });

    cy.intercept(
      {
        method: 'GET', // Route all GET requests
        url: 'https://jsramverk-editor-rois20.azurewebsites.net/allDocs', // that have a URL that matches '/users/*'
      },
      mockDocs
    ).as('getDocs'); // and assign an alias 

    // Confirm POST route is called.
    cy.waitFor('@updateDoc');

    // Confirm the added element exists in list.
    cy.wait('@getDocs').then((res) => {
      cy.get('.doc-list-container').first().contains('Updated Document');
    });
  });
});
