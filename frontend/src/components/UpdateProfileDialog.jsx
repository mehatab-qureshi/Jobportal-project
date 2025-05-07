import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth); //we are getting login user data from store
  //now to fill the initial user data in input fields we do..
  const [input, setInput] = useState({
    fullname: user?.fullname, //?. Yani agar user exist karta hai tabhi user.fullname le — warna undefined return karo. Isse error nahi aayega agar user ya profile nahi mila toh.
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map((skill) => skill),
    file: user?.profile?.resume,
  });

  //jab api call lagake data submit krte tab user ko update krna hoga/replace krna hoga jo bhi data purana wala save tha store me
  const dispatch = useDispatch(); //AFTER THIS attch muulter to routes coz we are sending form data to backend.

  const channgeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0]; //[0] ka mtlb jo first file(0th index)pe hogi vo utna he display hogi
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    //ab api call lagani hogi idhr so ham is data/input fileds ko form data me convert krunga ie..
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    //ab idhr api call lagana hoga
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      //itna hone ke baad tume ek res aayega
      if (res.data.success) {
        //Agar backend response ke andar success: true aaya Tab samjho update ho gaya profile
        dispatch(setUser(res.data.user)); //Is line ka matlab: Redux store me user ki nayi info daal do
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      // Safe error handling
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally { 
      setLoading(false);
    }
    setOpen(false); //this will close the dialogbox of updataProfile after submitted.
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="bg-white sm:max-w-[425px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={input.fullname} //yaha data to get kr rhe hai or PLACED HERE the data.
                  onChange={channgeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={channgeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">
                  Number
                </Label>
                <Input
                  id="number"
                  name="number"
                  value={input.phoneNumber}
                  onChange={channgeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={channgeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">
                  Skills
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={channgeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Resume
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              {loading ? ( //this is for loading symbol spinner
                <Button className="w-full my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                //this is else part if loaded then this will run
                <Button
                  type="submit"
                  className="w-full my-4 bg-black text-white"
                >
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
