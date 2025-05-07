import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = (companyId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // console.log("Fetching jobs...");
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { ///get ham idhr postman ko refer krre. udhr jo api address hoga input search pe vhi same idhr
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies)); //COMPANIES isliye kyu ki backend me vhi return krra hu res.data me ie companycontroller me
        // dispatch({ type: "job/setAllJobs", payload: res.data.jobs });
        //   console.log("Jobs response:", res.data.jobs); // see if jobs aa rahe hai backend se
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, []);
};

export default useGetAllCompanies;
//AB ISKO DISPLAY KRNA HOGA kaha pe companiestable page pe!!!
