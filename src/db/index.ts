// src/db/index.ts
import mongoose from 'mongoose';
import { Category } from '../models/Category';



const categories = [
  'Food & Dining',
  'Housing',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'HealthCare',
  'Personal',
  'Income',
];

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || (process.env.DOCKER ? 'mongodb://myuser:mypassword@mongo:27017/mydatabase?authSource=admin' : 'mongodb://myuser:mypassword@localhost:27017/mydatabase?authSource=admin'));
    console.log('MongoDB connected');

    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
      //  console.log(`Inserted category: ${name}`);
      } else {
     //   console.log(`Category already exists: ${name}`);
      }
    }

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
