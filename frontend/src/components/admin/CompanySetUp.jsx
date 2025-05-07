import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetUp = () => {
  const params = useParams();
  useGetCompanyById(params.id); //isko job edit ke liye call kiya gaya hai 
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value }); //e.target.value batata hai ki user ne kya likha hai. Toh e.target.name us input ka naam batata hai (jo name="" attribute me likha hota hai)
  };
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0]; //yaha pe file leke are
    setInput({ ...input, file });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    //ab file bhejne k liye form data use krte hai...
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    //aur ab file ke liye pehle check krna ki exist krti h ya nhi agar krti h...
    if (input.file) {
      formData.append("file", input.file);
    }
    //aur ab idhr api call krna...
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`, // /update lagake id get kro param se
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      //ab iske baad mujhe res chahiye
      if (res.data.success) {
        //res.data.success jaise he ye true hota hai toh us case me mujhe toast define krna hai
        toast.success(res.data.message);
        //ab iske(success)k baad mujhe ek page pe bhejna hai
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      //aur Agar error ho toh hum isko toast me dikhaynge
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //company data input me filled ana chahiye iske liye useEffect use krlo...
  //Jab bhi andar likha hua data badlega, tab ye code chalega.
  useEffect(
    () => {
      setInput({
        //singleCompany me jo bhi data aaya hai usko form ke input me set kar do.
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.file || null,
      });
    },
    [singleCompany] // ye [singleCompany] dependency array notice karega bolega — "Arre, isme change aaya!"  to useEffect wala function firse chalega.
    //Iska matlab jitni baar singleCompany ka value change hoga, utni baar ye chalega..agar vo dependency nhi denge toh useEffect sirf ek baar chalega.
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
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
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetUp;
