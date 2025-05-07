import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const companyArray = [];

const Postjob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate()

  const { companies } = useSelector((store) => store.company); //yaha me store se companies laru so that display krne ke liye
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  //ye input ke liye
  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() == value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //ab ye kya krega ki jab ham create krke submit krnge toh jobs page me display krega..
      const res = await axios.post(`${JOB_API_END_POINT}/post`,input,{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      if(res.data.success){ //agar data success aya toh
        toast.success(res.data.message); //successfully created krke popup aayega 
        navigate("/admin/jobs");  //aur jobs page pe redirect krega
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong while posting the job";
      toast.error(message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>No of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {
              //yaha pe hum companies display krwa rhe h jitne bhi available hai so that usi ek me hm job create kr ske
              companies.length > 0 && (
                <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {
                      companies.map((company)=>{
                        return (
                          <SelectItem value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              )
            }
          </div>
          {loading ? ( //this is for loading symbol spinner
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            //this is else part if loaded then this will run
            <Button type="submit" className="w-full my-4 bg-black text-white">
              Post New Job
            </Button>
          )}

          {/*this is for: agar ek bhi company registerd nhi hai toh job post nhi krskte toh usi ke liye hai ye..error batana k liye */}
          {companies.length == 0 && (
            <p className="text-xs  text-red-600 font-bold text-center my-3">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Postjob;
