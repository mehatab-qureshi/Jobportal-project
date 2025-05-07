import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];
const LatestJobs = () => {
  const { allJobs = [] } = useSelector(store => store.job);
  // console.log("Redux allJobs:", allJobs); //ye redux me jobs store hai ky nhi check krne agar  Redux me allJobs empty hai — iska matlab hai: hook sahi kaam kar raha hai, lekin dispatch kaam nahi kar raha.

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6a38c2]">Latest & Top </span>Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {(allJobs?.length || 0) <= 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
