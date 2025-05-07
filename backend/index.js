import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"; //after installing we import and use it to access the env file(Environment variables:jaise API keys, database connection strings, ya app configuration values(sensitive data))
dotenv.config({}); //helps to access the env file(ka use aapke project me .env file se environment variables ko load karne ke liye kiya jata hai.)
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"

const app = express();

//middleware
app.use(express.json()); //JSON data(jo api me hai client se liya hua) ko parse krke store karne ke liye use hota hai
app.use(express.urlencoded({ extended: true })); //Jab aap form submit karte ho, jo data send hota hai wo URL encoded format me hota hai aur ye middleware data ko parse karke, aapke code me req.body me store karta hai.
app.use(cookieParser()); //helps to read cookies from website and use it

const corsOptions = {
  origin: "http://localhost:5173", // Allow only this origin
  credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions)); // Now other websites can access our API!

const PORT = process.env.PORT || 3000;

//all api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is Running on port ${PORT}`);
});