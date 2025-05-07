import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies(); //saare companies render hogi.
  const dispatch = useDispatch();
  //ab filter ko pata lage ham kya type krre hai uske liye a state banana hoga...
  const [input, setInput] = useState("");
  //aur ab useEffect laga..jab me input(filter) me type kuch krunga toh udhr vo ana chaiye
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]); 
  //Ye input ki value ko Redux store ke searchCompanyByText state me update karega.

  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)} //Ye setInput us text ko input state me save kar raha hai.
          />
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="bg-black text-white"
          >
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
