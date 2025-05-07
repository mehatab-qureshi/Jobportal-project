import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  //yaha pe get krna hai useGetallCompanies ko...
  const { companies, searchCompanyByText } = useSelector( //Ye companies ka pura array aur searchCompanyByText ki latest value lega.
    (store) => store.company
  );
  //aur is companies ko tablebody me display krnge

  //ab filter ke liye state..
  const [filterCompany, setFilterCompany] = useState(companies);
  //aur iske baad me useEffect use krunga
  const navigate = useNavigate();
  //Jab bhi companies ya searchCompanyByText badlega, useEffect chalega:
  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => { //Ye har company ke liye chalega.Har company ka name check karega.
        if (!searchCompanyByText) { //Agar searchCompanyByText khaali hai (user ne kuch type nahi kiya hai), to saari companies return kar dega
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany); //Ab jo bhi filter hua result, use state me set kar diya.Ab table sirf wahi companies dikhata hai jo filterCompany me hai.
  }, [companies, searchCompanyByText]); //companies & searchcompany isliye lagaya idhr ki jab useEffect tabhi call hoga jab ye compnies change hogi ya toh searchcompny hogi tab ye dono call honge tabhi useeffct work krega
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany?.map((company) => (  // Sirf wo companies show hongi jo filter me bachi hain.
            <tr>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div onClick={()=>navigate(`/admin/companies/${company._id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
