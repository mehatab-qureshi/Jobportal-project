import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setSigleJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job); //job ko fetch krre h
  const { user } = useSelector((store) => store.auth);
  // const isApplied = true;
  const isInitiallyApplied =
    singleJob?.applications?.some(
      //singlejob me(redux) applications h phir usme applicant hai jo ham userid se match krnege, if match then applied else not applied.
      (application) => application.applicant == user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  //ab muje job ki id nikalni hai toh..
  const params = useParams();
  const jobId = params.id;

  const dispatch = useDispatch();

  const applyJobhandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          //yahan ham total applicants counts ko update krre h
          ...singleJob, //a pehle ka data as usual rahega
          applications: [...singleJob.applications, { applicant: user?._id }], //data ko update krre ie applicants ko
        };
        dispatch(setSigleJob(updatedSingleJob)); //helps us to real time UI update..yani ham redux me update krre h aur ye UI ko bhi update krne me help karega
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }; //ab iske baad apply btn pe jaake onclick laga dena...

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        // console.log("Fetching jobs...");
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSigleJob(res.data.job));
          // dispatch({ type: "job/setAllJobs", payload: res.data.jobs });
          //   console.log("Jobs response:", res.data.jobs); // see if jobs aa rahe hai backend se
          setIsApplied( //ensures the state is in sync with fetched data
            res.data.job.applications.some(
              (application) => application.applicant == user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.position} Position
            </Badge>
            <Badge className="text-[#f83002] font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-bold" variant="ghost">
              {singleJob?.salary}LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobhandler} //mtlb already apply h toh null else applyhandler ko call krre
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-[#7209b7] hover:bg-[#5f32ad] text-white"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary}LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
