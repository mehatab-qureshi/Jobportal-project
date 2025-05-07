import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] }); //.files ek array-like object hai. [0] ka matlab: pehli file lo (kyunki multiple files bhi choose ho sakti hai, lekin humein ek hi chahiye).?. ka matlab: agar files undefined ho (kisi wajah se), to error na aaye. Safe check.
  };

  const submitHandler = async (e) => {
    e.preventDefault(); //Form ka default reload behavior rok raha hai. Jaise hi submit karte ho, page reload na ho

    //ab me file/photo behjunga to vo form me convert krega, isliyee..
    const formData = new FormData(); //FormData() ek built-in JS object hai jo form ke sare fields + file ko package karke bhejne me help karta hai
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      //Yaha check ho raha hai agar file hai to hi usko formData me daalo.
      formData.append("file", input.file); //File image, PDF, CV, kuch bhi ho sakti hai.
    }

    //here we are calling api
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        //axios ka use user ko register karne ke liye, POST request bhej raha hai usually form submit ya data save karne ke liye hota hai.
        `${USER_API_END_POINT}/register`, //Ye endpoint hai jaha data jaa raha hai.
        formData, // File/image ke sath form data backend ko bhej sakte ho.Ye browser ko batata hai ke form data ke andar file bhi hai.
        {
          headers: {
            "Content-Type": "multipart/form-data", //multipart/form-data ka use ho raha hai file(jaise profile pic, CV, etc.) bhejne ke liye.
          },
          withCredentials: true, //Agar tu cookies ya authentication token use kar raha hai (jaise JWT in cookies), tab zaruri hota hai.Ye ensure karta hai ke cookies frontend se backend me jayein.
        }
      );

      //now we need here toast so we get it from shadcn "sooner"
      if (res.data.success) {
        //Ye check karta hai ki API se success: true aaya hai ya nahi. Agar aaya, matlab registration successful hai.
        navigate("/login"); //React Router ka function hai.User ko login page pe redirect kar deta haiJaise hi signup successful hota hai, wo automatically /login pe chala jaata ha
        toast.success(res.data.message); //Ye ek chhota popup (notification) dikhata hai.res.data.message me jo backend se message aata hai (e.g., "Registration successful!") usko toast success ke form me display karta hai.
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false)); //here we are turning off loading
    }
  };

    //ye isliye jab user already login h phir bhi route k help se signup page search krke enter kre to home page pe li jayega
      useEffect(()=>{
        if(user){
          navigate("/")
        }
      },[])

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Mahetab"
              className="border border-gray-200"
            />
          </div>
          <div className="my-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Mahetab123@gmail.com"
              className="border border-gray-200"
            />
          </div>
          <div className="my-4">
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="989385933"
              className="border border-gray-200"
            />
          </div>
          <div className="my-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              className="border border-gray-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2 ">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role == "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role == "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>
          {loading ? ( //this is for loading symbol spinner
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            //this is else part if loaded then this will run
            <Button type="submit" className="w-full my-4 bg-black text-white">
              Signup
            </Button>
          )}
          <span className="text-sm">
            Already have an account?
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
