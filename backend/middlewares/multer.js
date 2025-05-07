//Yeh code frontend se aayi file (image/photo) ko backend me receive aur handle karne ke liye hai. Hum multer naam ke middleware ka use kar rahe hain.

import multer from "multer";

//this multer is for to receive files in backend that are sent by frontend in register ie files form 
//now we will create one storage..
const storage = multer.memoryStorage();
//Yahan hum define kar rahe hain ki file ko kaise aur kahan store karna hai.
// /memoryStorage() ka matlab:File ko RAM me temporarily store karega.
//Ye tab useful hai jab hum file ko directly Cloudinary ya AWS S3 pe upload karte hain bina disk pe save kiye.
//Agar tu file ko local disk pe save karna chahta hota toh diskStorage() use karta.

export const singleUpload = multer({storage}).single("file"); 
//Note: the file name shld be same as in input type filed
//multer({storage}): Ye multer ko batata hai ki file kaha store karni hai.Yahan humne storage banaya hai with memoryStorage(), matlab file RAM me store hogi (temporary, bina file system me save kiye).

//.single("file"):Ek hi file aayegi form se