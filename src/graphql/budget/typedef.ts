export const typedefs = `#graphql
  type Category {
    id: ID!
    name: String!
  }

  type Budget {
    id: ID!
    category: Category
    amount: Float!
    month: Int!
    year: Int!
  }

  type CategoryBudgetPercentage {
    category: Category!
    percentage: Float!
  }

  type BudgetSummaryByMonth {
    month: Int!
    totalAmount: Float!
  }

`;
