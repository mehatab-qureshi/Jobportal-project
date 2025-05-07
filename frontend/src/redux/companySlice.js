import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [], //ye getallcompanies ke liye jaha saare companies ek saath sabhi render krnge
    searchCompanyByText:"", //ye filter ke liye hoga
  },
  reducers: {
    //actions

    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => { //isko ab ham getallcompanies me use krnge ie hook me
      state.companies = action.payload;
    },
    setSearchCompanyByText:(state,action) =>{
      state.searchCompanyByText = action.payload;
    }
  },
});
export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
