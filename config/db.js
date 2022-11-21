import mongoose from 'mongoose';

/**
 * mongodb connection
 */
export const mongoDBConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected`.bgGreen.black.bold);
    } catch (err) {
        console.error(`Error: ${err.message}`.bgRed.white.bold);
       
    }
}


