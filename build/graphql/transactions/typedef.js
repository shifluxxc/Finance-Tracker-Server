"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedefs = void 0;
exports.typedefs = `#graphql

  input TransactionInput {
    amount: Float!
    description: String
    month: Int!
    year: Int!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    id: ID!
    amount: Float
    description: String
    month: Int
    year: Int
    categoryId: ID
  }

  type Category {
    id: ID!
    name: String!
  }

  type Transaction {
    id: ID!
    amount: Float!
    description: String
    month: Int
    year: Int
    category: Category
  }

  type MonthExpense {
  month: String!
  total: Float!
}

type CategoryBreakdown {
  category: String!
  percentage: Float!
}
`;
