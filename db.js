import mongoose from "mongoose";

export function mongoConnect(){
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }; 
   try {
       mongoose.connect(process.env.MONGO_URL, params)
       console.log("Mongo db is connected")
   } catch (error) {
       console.log(error)
   }
}