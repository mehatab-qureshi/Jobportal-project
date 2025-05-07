import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth); //useSelector ek React-Redux hook hai jo Redux store se state ko read karta hai.Iska kaam hai: “Store se koi bhi state nikalni ho, to useSelector use karo.
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: [e.target.value] });
  };

  const submitHandler = async (e) => {
    e.preventDefault(); //Form ka default reload behavior rok raha hai. Jaise hi submit karte ho, page reload na ho

    //here we are calling api
    try {
      dispatch(setLoading(true)); //this is loading,Jab koi API call start hoti hai (like login, register, etc.), hum chahte hain UI me ek loading spinner ya "Please wait..." jaisa message aaye.
      const res = await axios.post(
        //axios ka use user ko register karne ke liye, POST request bhej raha hai usually form submit ya data save karne ke liye hota hai.
        `${USER_API_END_POINT}/login`, //Ye endpoint hai jaha data frontend se jaa raha hai backend ko.
        {
          email: input.email,
          password: input.password,
          role: input.role,
        },
        {
          headers: {
            "Content-Type": "application/json",  //kis type ka data ja raha h ye denote krta ie app/json data with credential true
          },
          withCredentials: true, //Agar tu cookies ya authentication token use kar raha hai (jaise JWT in cookies), tab zaruri hota hai.Ye ensure karta hai ke cookies frontend se backend me jayein.
        }
      );

      //now we need here toast so we get it from shadcn "sooner"
      if (res.data.success) {
        dispatch(setUser(res.data.user)); //ye jab login krte jab user set ho jata hai
        //Ye check karta hai ki API se success: true aaya hai ya nahi. Agar aaya, matlab registration successful hai.
        navigate("/"); //React Router ka function hai.User ko Home page pe redirect kar deta haiJaise hi login successful hota hai, wo automatically /home pe chala jaata ha
        toast.success(res.data.message); //Ye ek chhota popup (notification) dikhata hai.res.data.message me jo backend se message aata hai
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      //Success ho ya fail, dono me loading ko false karna hi padega.
      dispatch(setLoading(false));
    }
  };

  //ye isliye jab user already login h phir bhi route k help se login page search krke enter kre to home page pe li jayega
  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>
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
          </div>

          {loading ? ( //this is for loading symbol spinner
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            //this is else part if loaded then this will run
            <Button type="submit" className="w-full my-4 bg-black text-white">
              Login
            </Button>
          )}

          <span className="text-sm">
            Don't have an account?
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
