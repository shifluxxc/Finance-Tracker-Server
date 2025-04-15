"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedefs = void 0;
exports.typedefs = `#graphql
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
