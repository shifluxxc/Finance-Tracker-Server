"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
   type Query {
   transactions: [Transaction!]
   monthWiseExpenses: [MonthExpense!]!
   categoryExpensePercentage: [CategoryBreakdown!]!
}

`;
