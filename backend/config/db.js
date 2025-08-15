import mongoose from "mongoose";

export const connectDB = async() =>{
    try{
        const connectDBInstance= await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`\n MongoDB connected:${connectDBInstance.connection.host}`)
    }
    catch(error){
        console.error("ERROR",error);
        process.exit(1)
    }
}
