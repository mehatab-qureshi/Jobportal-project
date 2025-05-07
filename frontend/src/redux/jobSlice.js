import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [], //2
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs:[],
    searchedQuery:"",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSigleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    SetSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs:(state,action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery:(state,action) => {
       state.searchedQuery =action.payload;
    }
  },
});

export const { setAllJobs, setSigleJob, setAllAdminJobs, SetSearchJobByText, setAllAppliedJobs, setSearchedQuery } =
  jobSlice.actions;
export default jobSlice.reducer;
