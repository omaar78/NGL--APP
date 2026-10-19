import  mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URL)

// console.log(
//     await mongoose.connection.db.listCollections().toArray()
// );