import { Budget } from '../../models/Budget';
import { Category } from '../../models/Category';

export const resolvers = {
  Query: {
    recentBudgets: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Budget.find({ user: context.user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('category');
    },

    categories: async () => {
      return await Category.find();
    },

    monthWiseBudget: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const results = await Budget.aggregate([
        { $match: { user: context.user._id } },
        {
          $group: {
            _id: { month: '$month' },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $project: {
            month: '$_id.month',
            totalAmount: 1,
            _id: 0,
          },
        },
        { $sort: { month: 1 } },
      ]);
      return results;
    },

    categoryWiseBudgetPercentage: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const total = await Budget.aggregate([
        { $match: { user: context.user._id } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      ]);
      const totalAmount = total[0]?.totalAmount || 1;

      const data = await Budget.aggregate([
        { $match: { user: context.user._id } },
        {
          $group: {
            _id: '$category',
            categoryTotal: { $sum: '$amount' },
          },
        },
        {
          $project: {
            category: '$_id',
            percentage: {
              $round: [{ $multiply: [{ $divide: ['$categoryTotal', totalAmount] }, 100] }, 1],
            },
            _id: 0,
          },
        },
      ]);

      const populated = await Promise.all(
        data.map(async (item) => {
          const category = await Category.findById(item.category);
          return {
            category,
            percentage: item.percentage,
          };
        })
      );

      return populated;
    },
  },

 Mutation: {
    addBudget: async (
      _: any,
      { categoryId, amount, year, month }: { categoryId: string; amount: number; year: number; month: number },
      context: any
    ) => {
      if (!context.user) throw new Error('Not authenticated');

      const existing = await Budget.findOne({
        category: categoryId,
        month,
        year,
        user: context.user._id,
      });
      if (existing) throw new Error('Budget already set for this category this month');

      const budget = new Budget({
        category: categoryId,
        amount,
        month,
        year,
        user: context.user._id,
      });
      await budget.save();
      return budget.populate('category');
    },

   editBudget: async (
  _: any,
  { id, amount, year, month, categoryId }: { id: string; amount?: number; year?: number; month?: number; categoryId?: string },
  context: any
) => {
  if (!context.user) throw new Error('Not authenticated');
  const budget = await Budget.findOne({ _id: id, user: context.user._id });
  if (!budget) throw new Error('Budget not found');

  budget.amount = amount ?? budget.amount;
  budget.year = year ?? budget.year;
  budget.month = month ?? budget.month;
  if (categoryId) {
    budget.category = new (require('mongoose').Types.ObjectId)(categoryId);
  }

  await budget.save();
  return budget.populate('category');
},

    deleteBudget: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const deleted = await Budget.findOneAndDelete({ _id: id, user: context.user._id });
      if (!deleted) throw new Error('Budget not found');
      return 'Budget deleted successfully';
    },
  },

  Budget: {
    id: (parent: any) => parent._id.toString(),
  },

  Category: {
    id: (parent: any) => parent._id.toString(),
  },
};