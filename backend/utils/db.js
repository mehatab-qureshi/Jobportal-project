import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected succesfully");
  } catch (error) {
    console.log("Error");
    
  }
};
export default connectDB;