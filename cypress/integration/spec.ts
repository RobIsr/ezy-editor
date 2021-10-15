// var mockDocs:any = null;
// var updatedMockDocs:any = null;
// import { environment } from 'src/environments/environment';
// import { aliasQuery, aliasMutation } from '../utils/graphql-test-utils';

// describe("Application actions", () => {

//   beforeEach(() => {
//     cy.visit('/');
//     cy.get('#email').first().type("test@test.com");
//     cy.get('#password').first().type("test");
//     cy.get('#login-btn').first().click();

//     mockDocs = {data: [
//       {
//         _id: "1",
//         name: "Test Doc1",
//         html: "Test content1"
//       }
//     ]};

//     updatedMockDocs = {data: [
//       {
//         _id: "1",
//         name: "Updated Document",
//         html: "Test content1"
//       }
//     ]};

//     cy.intercept(
//       {
//         method: 'POST', 
//         url: `${environment.apiUrl}/graphql`
//       },
//       mockDocs
//     ).as('getDocs');

//     cy.intercept(
//       {
//         method: 'POST',
//         url: `${environment.apiUrl}/save`
//       },
//       {
//         statusCode: 201,
//       }
//     ).as('save');

//     cy.intercept(
//       {
//         url: `${environment.apiUrl}/update`,
//       },
//       {
//         statusCode: 200,
//       }
//     ).as('updateDoc');

//     cy.waitFor('@getDocs');
//   }); 

//   it('loads existing documents', () => {
//     // Confirm the added element exists in list.
//     cy.get('.doc-list-container').first().contains('Test Doc1');
//   });

//   it('saves new document', () => {
//     cy.get('#save').first().click();
//     cy.get('#filename-input').first().type("Test Doc2");
//     cy.get('#confirm-save').first().click().then(() => {
//       mockDocs.data.push({
//         _id: "2",
//         name: "Test Doc2",
//         html: "Test content2"
//       });
//     });

//     // Confirm POST route is called.
//     cy.waitFor('@saveDoc');

//     // Confirm the added element exists in list.
//     cy.get('.doc-list-container').first().contains('Test Doc1');
//     cy.get('.doc-list-container').first().contains('Test Doc2');
//   });

//   it('updates existing document', () => {
//     cy.get('.doc-list-container').get('li').first().click();
//     cy.get('#save').first().click();
//     cy.get('#filename-input').first().type("Updated Document");
//     cy.get('#confirm-save').first().click();

//     cy.intercept(
//       {
//         method: 'GET', 
//         url: `${environment.apiUrl}/graphql`,
//       },
//       updatedMockDocs,
//     ).as('getUpdatedDocs');

//     // Confirm POST route is called.
//     cy.waitFor('@updateDoc').then(() => {
//       cy.waitFor('@getUpdatedDocs');
//       cy.get('.doc-list-container').first().contains('Updated Document');
//     });
//   });
// });
