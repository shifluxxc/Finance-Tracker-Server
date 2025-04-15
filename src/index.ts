import { InitGraphqlServer } from "./graphql/index";
import { connectDB } from './db';
import { Category } from './models/Category';

InitGraphqlServer();

const connectToDB = async () => {
    console.log("gg"); 
    await connectDB(); 

    const initialCategories = [
        { name: 'Food & Dining' },
        { name: 'Housing' },
        { name: 'Transportation' },
        { name: 'Utilities' },
        { name: 'Entertainment' },
        { name: 'Shopping' },
        { name: 'HealthCare' },
        { name: 'Personal' },
        { name: 'Income' },
    ];

    try {
        // Check if categories already exist
        const existingCategories = await Category.find();

        if (existingCategories.length === 0) {
            // Create the initial categories
            await Category.insertMany(initialCategories);
            console.log('Initial categories created');
        } else {
            console.log('Categories already exist');
        }
    } catch (error) {
        console.error('Error creating initial categories:', error);
    }
}

connectToDB();
