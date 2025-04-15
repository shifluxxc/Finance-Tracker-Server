export const mutations = `#graphql
    type Mutation {
    addBudget(categoryId: ID!, amount: Float! ): Budget!
    editBudget(id: ID!, amount: Float!): Budget!
  }
`;
