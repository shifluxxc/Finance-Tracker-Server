export const queries = `#graphql
    type Query {
    categories: [Category!]
    recentBudgets: [Budget!]!
    monthWiseBudget: [BudgetSummaryByMonth!]!
    categoryWiseBudgetPercentage: [CategoryBudgetPercentage!]!
  }
`;

