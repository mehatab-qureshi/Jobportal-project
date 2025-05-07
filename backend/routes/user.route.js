import  express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router(); //we get router in express so

router.route("/register").post(singleUpload,register); //router.route se post/get/put(http methods).. ek he line me likh skte
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;

//singleUpload ek middleware h jo check krega ki sab proper way me hai tabhi register chalega
///Iska kaam hai: request me jo file aayi hai (image/photo), usko handle karna (usually via multer ya cloudinary).
//Ye ek function (middleware) bana raha hai jiska kaam hai file lena frontend se.