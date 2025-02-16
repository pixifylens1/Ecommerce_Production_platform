import mongoose from "mongoose";
import dotenv from 'dotenv';
const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`server connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error is ${error}`);
    }
}

export default connectdb;