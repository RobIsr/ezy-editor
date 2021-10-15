// // utils/graphql-test-utils.js

// // Utility to match GraphQL mutation based on the operation name
// export const hasOperationName = (req:any, operationName:any) => {
//     const { body } = req
//     return (
//       body.hasOwnProperty('operationName') && body.operationName === operationName
//     )
//   }
  
//   // Alias query if operationName matches
//   export const aliasQuery = (req:any, operationName:any) => {
//     if (hasOperationName(req, operationName)) {
//       req.alias = `gql${operationName}Query`
//     }
//   }
  
//   // Alias mutation if operationName matches
//   export const aliasMutation = (req:any, operationName:any) => {
//     if (hasOperationName(req, operationName)) {
//       req.alias = `gql${operationName}Mutation`
//     }
//   }