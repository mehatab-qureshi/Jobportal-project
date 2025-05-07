import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const usegetAllJobs = () => {
  const dispatch = useDispatch();
  const {searchedQuery} = useSelector(store=>store.job); //s1: got query which containes keywords
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // console.log("Fetching jobs...");
        const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        // dispatch({ type: "job/setAllJobs", payload: res.data.jobs });
        //   console.log("Jobs response:", res.data.jobs); // see if jobs aa rahe hai backend se
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllJobs();
  }, []);
};

export default usegetAllJobs;
