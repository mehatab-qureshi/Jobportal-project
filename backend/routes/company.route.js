import  express from "express";
import { registerCompany, getCompany, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router(); //we get router in express so

router.route("/register").post(isAuthenticated,registerCompany); //router.route se post/get/put(http methods).. ek he line me likh skte
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany); //idhr multer ie singleUpload ki zarurat h nhi toh undefined error ayega backend se

export default router;
