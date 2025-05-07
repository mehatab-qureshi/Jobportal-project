import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();

  //now integrating api of registercompany...
  const registerNewCompany = async () => {
    if(!companyName.trim()){
      toast.error("Company Name cannot be empty!");
      return;
    }
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName }, //idhr hm input se data lere hai idhr
        {
          //ye islie lagaya jata h taki register vhi banda krskta jo authenticated ho...
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //itna kuch hone ke baad hame response milega jaha pe hm check kr sktea
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id; //Jo API ne company create/update karke response me bheji, uska _id le raha hai aur navigate me dalre
        navigate(`/admin/companies/${companyId}`); //ye isliye kyu ki jab register hoga toh mujhe ek page pe bhejna h jaha pe vo company ko edit audit krskta
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to give your company name? you can change this
            later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          onChange={(e) => setCompanyName(e.target.value)} //setcompanyName se input se data leke save krre companyName
        />
        <div className="flex items-center gap-2 my-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
          >
            Cancel
          </Button>
          <Button onClick={registerNewCompany} className="bg-black text-white">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
