import mongoose from 'mongoose';
import { Transaction } from '../../models/Transaction';

export const resolvers = {
  Query: {
    transactions: async () => {
      const transactions = await Transaction.find().populate('category');
      return transactions.filter(transaction => transaction.category);
    },

    monthWiseExpenses: async () => {
      const results = await Transaction.aggregate([
        {
          $group: {
            _id: {
              year: '$year',
              month: '$month',
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: [
                    { $lt: ['$_id.month', 10] },
                    { $concat: ['0', { $toString: '$_id.month' }] },
                    { $toString: '$_id.month' },
                  ],
                },
              ],
            },
            total: 1,
          },
        },
        { $sort: { month: 1 } },
      ]);

      return results;
    },

    categoryExpensePercentage: async () => {
      const totalAmountAgg = await Transaction.aggregate([
        { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
      ]);
      const totalAmount = totalAmountAgg[0]?.total || 0;

      const categoryAgg = await Transaction.aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: { $abs: '$amount' } },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        {
          $unwind: '$categoryInfo',
        },
        {
          $project: {
            category: '$categoryInfo.name',
            percentage: {
              $round: [
                {
                  $multiply: [{ $divide: ['$total', totalAmount] }, 100]
                },
                1 // round to 1 decimal place
              ]
            },
          },
        },
        { $sort: { percentage: -1 } },
      ]);

      return categoryAgg;
    },
  },

  Mutation: {
    addTransaction: async (
      _: any,
      {
        amount,
        description,
        categoryId,
      }: {
        amount: number;
        description: string;
        categoryId: string;
      }
    ) => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const transaction = new Transaction({
        amount,
        description,
        month: currentMonth,
        year: currentYear,
        category: categoryId,
      });

      await transaction.save();
      return transaction.populate('category');
    },

    editTransaction: async (
      _: any,
      {
        id,
        amount,
        description,
        categoryId,
      }: {
        id: string;
        amount?: number;
        description?: string;
        categoryId?: string;
      }
    ) => {
      const transaction = await Transaction.findById(id);
      if (!transaction) throw new Error('Transaction not found');

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      transaction.amount = amount ?? transaction.amount;
      transaction.description = description ?? transaction.description;
      transaction.month = transaction.month ?? currentMonth;
      transaction.year = transaction.year ?? currentYear;
      if (categoryId) {
        try {
          transaction.category = new mongoose.Types.ObjectId(categoryId);
        } catch (error) {
          throw new Error('Invalid category ID');
        }
      }

      await transaction.save();
      return transaction.populate('category');
    },

    deleteTransaction: async (_: any, { id }: { id: string }) => {
      const deleted = await Transaction.findByIdAndDelete(id);
      if (!deleted) throw new Error('Transaction not found');
      return 'Transaction deleted successfully';
    },
  },

  Transaction: {
    id: (parent: any) => parent._id.toString(),
  },

  Category: {
    id: (parent: any) => parent._id.toString(),
  },
};
