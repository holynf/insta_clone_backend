import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (err) {
        console.log("error while connecting to your DataBase : ", err);
        process.exit(1);
    }
};
