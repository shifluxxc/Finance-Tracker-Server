export const mutations = `#graphql
    type Mutation {
        addTransaction(amount: Float!, description: String!, categoryId: ID!, year: Int!, month: Int!): Transaction!
        editTransaction(id: ID!, amount: Float, description: String, categoryId: ID, year: Int, month: Int): Transaction!
        deleteTransaction(id: ID!): String!
    }
`;