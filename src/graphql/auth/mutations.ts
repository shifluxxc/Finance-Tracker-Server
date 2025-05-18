export const mutations = `#graphql
type Mutation {
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}`;