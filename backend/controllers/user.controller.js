import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const register = async (req, res) => {
  try {
    //taking data entered by client from req.body
    const { fullname, email, phoneNumber, password, role } = req.body; //we are getting data from req.bodyfullmame,emial,role(student/recruiter)....etc
    // console.log(fullname, email, phoneNumber, password, role);
    if (!fullname || !email || !phoneNumber || !password || !role) {
      //if among this has not entered by user then send error
      return res.status(400).json({
        //error name!!
        message: "Something is missing", ///error sent
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file); //getDataUri fetches the data/get the data 
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    //check USERID already exists or not!
    const user = await User.findOne({ email }); //check weather the user id already exists or not by findOne(email)
    if (user) {
      //if exits then..
      return res.status(400).json({
        //400 display error!!
        message: "User already exits with this email.",
        success: false,
      });
    }
    //creating HASHPASSWORD
    const hashedPassword = await bcrypt.hash(password, 10); //converting password into hash which has been entered by the user, 10 length of the pswd shld b hashed(security lvl)

    //finally now creating the USER profile in User database model
    await User.create({
      //creating the user with tha abv given field
      fullname, //fields...
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    //taking data enter by client from req.body
    //replaced with const { email, password, role } = req.body; //when user logins then im taking this datA From req.body
    const email = Array.isArray(req.body.email)
      ? req.body.email[0]
      : req.body.email;
    const password = Array.isArray(req.body.password) //so that to get password in stirng
      ? req.body.password[0]
      : req.body.password;
    const role = Array.isArray(req.body.role)
      ? req.body.role[0]
      : req.body.role;
    // console.log(email, password, role);
    if (!email || !password || !role) {
      //check if weathr the client has entered all the data
      return res.status(400).json({
        message: "Something is Missing.", //sending error if somting is missing
        success: false,
      });
    }
    //check USERID already exists or not!
    let user = await User.findOne({ email }); //checking weather user id is already created or not
    if (!user) {
      //if not exists then...
      return res.status(400).json({
        message: "Incorrect email or password.", //Error emial id not exists
        success: false,
      });
    }
    // console.log("User:", user);
    // console.log("Entered Password:", password, typeof password);
    // console.log("Stored Password:", user.password, typeof user.password);
    //check PASSWORD matches with existing pwd or not
    //replace const isPasswordMatch = await bcrypt.compare(password[0], user.password); //checking pwd of user with existing hashed password when the user logins and has enterd the correct existing email/userid, (password:enterpwd, user.password:hashedpwd)=if this both matches then logins else fails
    const actualPassword = Array.isArray(password) ? password[0] : password;
    const isPasswordMatch = await bcrypt.compare(actualPassword, user.password);
    if (!isPasswordMatch) {
      //if password not matches
      return res.status(400).json({
        message: "Incorrect email or password,", ///displays the error when the pwd doesnt matches with existing hashed pwd
        success: false,
      });
    }
    //check ROLE correct or not!
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't with current role.",
        success: false,
      });
    }
    //generating TOKEN DATA..
    const tokenData = {
      userId: user.id, //user.id database ka id hai jo mongodb auto generate krta h jab login kiye ke baad!
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    //creating user
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    //storing the TOKEN IN COOKIE
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      //"" is empty token means token has deleted
      message: "Logged out Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file; //resume file
    const fileUri = getDataUri(file); //Tu file (jo multer se aaya hoga – jisme originalname & buffer hota hai) ko base64 URI format mein convert kar raha hai.
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content); //Tu ab us base64 image ko Cloudinary par upload kar raha hai.

    //cloudinary part.....!!
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(","); //converting skills from string to array by spilling with comma
    }
    //this is for: checks id first if valid then updates else not ie if user is loggedin with id then we can update else shows error
    const userId = req.id; //can update only whhen the profile is authentic..req.id is from middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    //Updating data to usermodule(replacing this with new data in usermodule)
    //   user.fullname = fullname,
    //   user.email = email,
    //   user.phoneNumber = phoneNumber,
    //   user.profile.bio = bio,
    //   user.profile.skills = skillsArray
    if (fullname) user.fullname = fullname; //with this we can now update either fullname
    if (email) user.email = email; //or email
    if (phoneNumber) user.phoneNumber = phoneNumber; //or phonenumber
    if (bio) user.profile.bio = bio; //or bio
    if (skills) user.profile.skills = skillsArray; //or skills

    //resume comes later here....
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; //save the cloudinary url;
      user.profile.resumeOriginalName = file.originalname; //this displays the resume uploaded original filename ex:mehatabResume.pdf
      await user.save();
    }

    await user.save(); // saving the updated data
    //creating user
    user = {
      _id: user.id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    //returning the user(the updated data is returned here)
    return res.status(200).json({
      message: "Profile updated successfully.",
      user, //returning user
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
