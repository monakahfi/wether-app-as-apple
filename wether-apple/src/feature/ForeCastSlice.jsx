import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const fetchForeCastWeather = createAsyncThunk(
  "forecastWeather/fetchForeCastWeather",
  async (cityName, thunkAPI) => {
    try {
      const key = "207d4477b43c4ed78ff103733250306";
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}forecast.json?key=${key}&q=${cityName}&days=10&aqi=yes&alerts=yes`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

const initialState = {
  location: {},
  current: {},
  forecast: {
    forecastday: []
  },
  alerts:{
    alert:[]
  },
 
  isLoading: false,
  error: null
};

const forecastWeatherSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForeCastWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
     .addCase(fetchForeCastWeather.fulfilled, (state, action) => {
  state.isLoading = false;
  state.current = action.payload.current;
  state.location = action.payload.location;
  state.forecast= action.payload.forecast; 
  state.alerts = action.payload.alerts?.alert || [];

})
      .addCase(fetchForeCastWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});



export default forecastWeatherSlice.reducer;
export { fetchForeCastWeather };
