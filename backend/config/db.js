


const mongoose = require("mongoose");
const connectDB = async ()=>{
  MONGODB_URI="mongodb+srv://support-desk:hyper@hyper.nevrtvo.mongodb.net/?retryWrites=true&w=majority"
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