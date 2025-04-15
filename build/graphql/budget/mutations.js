"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    type Mutation {
    addBudget(categoryId: ID!, amount: Float! ): Budget!
    editBudget(id: ID!, amount: Float!): Budget!
  }
`;
