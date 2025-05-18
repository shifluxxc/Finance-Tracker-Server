export const typedefs = `#graphql
type User {
  id: ID!
  name: String!
  email: String!
  budgets: [Budget!]
  transactions: [Transaction!]
}

type AuthPayload {
  token: String!
  user: User!
}
  
` ;