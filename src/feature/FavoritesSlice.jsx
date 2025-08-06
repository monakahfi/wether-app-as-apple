import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const fetchHistory = createAsyncThunk(
  "historyWeather/fetchHistoryWeather",
  async(cityName, thunkAPI)=> {
  try {
      const key = "207d4477b43c4ed78ff103733250306";
      const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}history.json?key=${key}&q=${cityName}&dt=${today}`);
    return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
  }
}
);
 const initialState ={
  location:{},
  isLoading:false,
  error: null
 }

 const historySlice = createSlice({

   name:"history",
   initialState,
   reducers:{},
   extraReducers:(builder)=>{
    builder.addCase(fetchHistory.pending, (state)=>{
       state.isLoading = true;
        state.error = null;
    })
      .addCase(fetchHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.location = action.payload.location;
     
    
    })
          .addCase(fetchHistory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          });
   }
  }
 )


 export default historySlice.reducer;
 export {fetchHistory};