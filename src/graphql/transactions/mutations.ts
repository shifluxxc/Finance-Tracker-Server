export const mutations = `#graphql
    type Mutation {
    addTransaction(amount: Float!, description: String!, categoryId: ID!): Transaction!
    editTransaction(id: ID!, amount: Float, description: String, categoryId: ID): Transaction!
    deleteTransaction(id: ID!): String!
    }
`;
