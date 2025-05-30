import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import usegetAllJobs from "@/hooks/useGetAllJobs";

// const randomJobs = [1, 2, 3];

const Browse = () => {
  usegetAllJobs(); //yaha pe get kiye isliye kyu ki isme code likhe isi browser page ke related
  const {allJobs} = useSelector(store=>store.job); //get alljobs from store to display 
  const dispatch = useDispatch();
  //cleanup
  useEffect(()=>{
    return ()=>{
      dispatch(setSearchedQuery(""))
    }
  },[])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">Search Results ({allJobs.length})</h1>
        <div className="grid grid-cols-3 gap-4 ">
          {allJobs.map((job) => {
            return <Job key={job._id} job={job}/>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
