import { Budget } from '../../models/Budget';
import { Category } from '../../models/Category';

export const resolvers = {
  Query: {
    recentBudgets: async () => {
      return await Budget.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('category');
        },
      
    categories: async () => {
            return await Category.find();
        },
    
    monthWiseBudget: async () => {
            const results = await Budget.aggregate([
              {
                $group: {
                  _id: { month: '$month' }, // only group by month
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
      
    categoryWiseBudgetPercentage: async () => {
            const total = await Budget.aggregate([
              { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
            ]);
            const totalAmount = total[0]?.totalAmount || 1;
      
            const data = await Budget.aggregate([
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
    addBudget: async (_: any, { categoryId, amount }: { categoryId: string; amount: number }) => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const existing = await Budget.findOne({ category: categoryId, month, year });
      if (existing) throw new Error('Budget already set for this category this month');

      const budget = new Budget({ category: categoryId, amount, month, year });
      await budget.save();
      return budget.populate('category');
    },

    editBudget: async (_: any, { id, amount }: { id: string; amount: number }) => {
      const budget = await Budget.findById(id);
      if (!budget) throw new Error('Budget not found');

      budget.amount = amount;
      await budget.save();
      return budget.populate('category');
    },
  },

  Budget: {
    id: (parent: any) => parent._id.toString(),
    },
  
    Category: {
        id: (parent: any) => parent._id.toString(),
      },
};
