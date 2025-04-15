export const queries = `#graphql
   type Query {
   transactions: [Transaction!]
   monthWiseExpenses: [MonthExpense!]!
   categoryExpensePercentage: [CategoryBreakdown!]!
}

`;
