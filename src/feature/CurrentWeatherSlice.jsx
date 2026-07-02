import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentWeather = createAsyncThunk(
  "currentWeather/fetchCurrentWeather",
  async (cityName, thunkAPI) => {
    try {
      const key = "61bf21e74fbe226da33151612e1a4947";
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}weather?q=${cityName}&appid=${key}&units=metric`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

const initialState = {
  data: {},
  isLoading: false,
  error: null,
};

const WeatherCurrentSlice = createSlice({
  name: "currentWeather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
       

        state.isLoading = false;
        const cityId = action.payload.id;
        state.data[cityId] = action.payload;
        
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default WeatherCurrentSlice.reducer;
