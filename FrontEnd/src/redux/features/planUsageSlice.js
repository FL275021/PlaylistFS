import { createSlice } from "@reduxjs/toolkit";

const planUsageSlice = createSlice({
  name: "planUsage",
  initialState: {
    data: null,
    status: "idle",
    error: "",
    isUpgrading: false,
  },
  reducers: {
    setUsageLoading: (state) => {
      state.status = "loading";
      state.error = "";
    },
    setUsageData: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = "";
    },
    setUsageError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    setPlanUpgrading: (state, action) => {
      state.isUpgrading = action.payload;
    },
  },
});

export const {
  setPlanUpgrading,
  setUsageData,
  setUsageError,
  setUsageLoading,
} = planUsageSlice.actions;
export default planUsageSlice.reducer;