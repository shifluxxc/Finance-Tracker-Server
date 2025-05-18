import mongoose from 'mongoose';
import { Transaction } from '../../models/Transaction';

export const resolvers = {
  Query: {
    transactions: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const transactions = await Transaction.find({ user: context.user._id }).populate('category');
      return transactions.filter(transaction => transaction.category);
    },

    monthWiseExpenses: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const results = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(context.user._id) } },
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

    categoryExpensePercentage: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const userId = new mongoose.Types.ObjectId(context.user._id);

      const totalAmountAgg = await Transaction.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
      ]);
      const totalAmount = totalAmountAgg[0]?.total || 0;

      const categoryAgg = await Transaction.aggregate([
        { $match: { user: userId } },
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
        { $unwind: '$categoryInfo' },
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

 // ...existing code...
Mutation: {
    addTransaction: async (
      _: any,
      {
        amount,
        description,
        categoryId,
        year,
        month,
      }: {
        amount: number;
        description: string;
        categoryId: string;
        year: number;
        month: number;
      },
      context: any
    ) => {
      if (!context.user) throw new Error('Not authenticated');

      const transaction = new Transaction({
        amount,
        description,
        month,
        year,
        category: categoryId,
        user: context.user._id,
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
        year,
        month,
      }: {
        id: string;
        amount?: number;
        description?: string;
        categoryId?: string;
        year?: number;
        month?: number;
      },
      context: any
    ) => {
      if (!context.user) throw new Error('Not authenticated');
      const transaction = await Transaction.findOne({ _id: id, user: context.user._id });
      if (!transaction) throw new Error('Transaction not found');

      transaction.amount = amount ?? transaction.amount;
      transaction.description = description ?? transaction.description;
      transaction.month = month ?? transaction.month;
      transaction.year = year ?? transaction.year;
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
    // ...existing code...
},
// ...existing code...
};