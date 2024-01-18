


const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI
const connectDB = async ()=>{
 
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`Database Connected ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
module.exports = connectDB;