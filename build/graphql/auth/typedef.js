"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedefs = void 0;
exports.typedefs = `#graphql
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
  
`;
