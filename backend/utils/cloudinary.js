import { v2 as cloudinary } from "cloudinary"; //Ye Cloudinary library ka v2 version import karta hai, jo latest syntax use karta hai.
import dotenv from "dotenv"; // file mein stored environment variables ko load karta hai (jaise API keys).
 dotenv.config(); //e line .env file ke andar ke values (CLOUD_NAME, API_KEY, API_SECRET) ko process.env ke through accessible banata hai.


 //Ye Cloudinary ke config function ko use karke tere Cloudinary account ko authenticate karta hai using environment variables.
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME, //Tera Cloudinary project/account ka naam
    api_key:process.env.API_KEY, // Authentication ke liye public key
    api_secret:process.env.API_SECRET //Private key (isse safe rakhna)
})
export default cloudinary;