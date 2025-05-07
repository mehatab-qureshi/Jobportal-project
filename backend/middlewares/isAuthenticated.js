//Ye middleware JWT token verify karne ke liye likha gaya hai. Agar token valid hai, toh user next step (route handler) me ja sakta hai, warna unauthorized error milega.

import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next) => {
try {
    const token = req.cookies.token;  //Frontend ya client request ke sath cookie me token bhejta hai, Yahan hum cookie se token nikal rahe hain.
    if(!token){  //if we dont(!) get token then...
        return res.status(401).json({
            message:"User not authenticated",
            success:false,
        })
    };
    //if we get token then verify/decode...
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    //if token does not decode or failed to decode then
    if(!decode){
        return res.status(401).json({
            message:"Invalid token",
            success:false,
        })
    }
    //if token gets decode then we are storing decoded/verified userid in req.id for further use...
    req.id = decode.userId; //Ye line ensure karti hai ki Aage ke routes/controllers me current logged-in user ka ID milta rahe // Tu req.id me dal raha hai taaki baaki code me use kar sake.
 
    next();  //next() ka use hota hai next function ya route execute karne ke liye agar sab kuch sahi ho..(login hota)
} catch (error) {
 console.log(error)   
}
}
export default isAuthenticated;