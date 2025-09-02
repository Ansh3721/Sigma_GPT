import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoutes from "./routs/chat.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(express.json()); // <-- this parses JSON body
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5000;

app.use("/api",chatRoutes);


const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  }
  catch(err){
    console.log(err);
  }
};


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  connectDB();
});
