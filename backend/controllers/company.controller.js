import {Company} from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const registerCompany = async (req,res) =>{
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message:"Company Name is required.",
                success:false  //False rakha hai, kyunki request fail ho gayi validation mein.
            })
        }
        let company = await Company.findOne({name:companyName})  //refer /1:43:48,, name:companyName means name==companyName(here we are comparing)
        //this below is for to allow only unique company name to be created
        if(company){
            return res.status(400).json({
                message:"You can't register with the same company.",
                success:false
            })    
        }
        company = await Company.create({
            name:companyName,
            userId:req.id //is req.id me verified userId stored hai isliye ye use krrhe aur company userID me store krre
        })
        return res.status(201).json({   //201 coz CREATED/REGISTERED
            message:"Company Registered Successfully",
            company,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCompany = async (req,res) => {
    try {
        const userId = req.id;  //loggedin user id,,, req.id se me user ke userid ko extract kiya aur req.id obj nhi hai isliye userId ko desturctre krne ki zarurat nhi padi
        const companies = await Company.find({userId}); //phir us userid se company database me search kr rha hu 
        if(!companies){  //agar database me vo userid nhi mila toh error throw!!
            return res.status(404).json({
                message:"Companies not found.",
                success:false 
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

//get company by id
export const getCompanyById = async (req,res) => {
    try {
        const companyId = req.params.id;  //param mtlb ex:route profile/update/:id yahase id ko get krunga isko params kehte hai
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message:"Company not found.",
                success:false
            })
        }
        return res.status(200).json({
            company,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

//updating company info
export const updateCompany = async (req,res) =>{
    try {
        const {name, description, website, location} = req.body;
        //  console.log(name, description, website, location) //this was just for testing
        const file = req.file;
        //cloudinary part...
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);//ab ye file upload ho jayega cloudinary pe
        const logo = cloudResponse.secure_url; //public url milega jise koi b access kr skta h
        

        const updateData = {name, description, website, location, logo}; //LOGO was now added while cloudinary part

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true}); //this new:true is to get the updated data/save the data
    if(!company){
        return res.status(404).json({
             message:"Company not found.",
             success:false
        })
    }
    return res.status(200).json({
        message:"Company information updated successfully",
        // company,
        success:true
    })
    } catch (error) {
        console.log(error)
    }
}