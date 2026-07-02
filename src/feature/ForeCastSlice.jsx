import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const fetchForeCastWeather = createAsyncThunk(
  "fetchForeCastWeather/forecastWeather",
  async ({lat,lon}, thunkAPI) => {
    try {
      
    
    
      const key =  'cfa24f1f6b74f41f792e479df926307e';
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}forecast/daily?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
      console.log("Weather Data:", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

const initialState = {
data:{},

  isLoading: false,
  error: null
};

const forecastWeatherSlice = createSlice({
  name: "forecast",
  initialState,
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchForeCastWeather.pending, (state) => {
        state.isLoading = true;
        
      })
     .addCase(fetchForeCastWeather.fulfilled, (state, action) => {
  state.isLoading = false;
state.data = action.payload;
})
      .addCase(fetchForeCastWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});



export default forecastWeatherSlice.reducer;
export { fetchForeCastWeather };
