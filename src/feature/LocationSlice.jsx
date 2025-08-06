import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// AsyncThunk برای گرفتن لوکیشن و درخواست آب‌وهوا
export const fetchGeoWeather = createAsyncThunk(
  "geoWeather/fetchGeoWeather",
  async (thunkAPI) => {
    try {
      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      const position = await getPosition();
      const lat = Number(position.coords.latitude.toFixed(4));
      const lon = Number(position.coords.longitude.toFixed(4));


      const key = "207d4477b43c4ed78ff103733250306";
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}current.json?key=${key}&q=${lat},${lon}&aqi=yes`
      );
      console.log("Weather Data:", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

const geoWeatherSlice = createSlice({
  name: "geoWeather",
  initialState: {
    location: {},
    current: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeoWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeoWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = action.payload.location;
        state.current = action.payload.current;
      })
      .addCase(fetchGeoWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Location access denied or failed.";
      });
  },
});

export default geoWeatherSlice.reducer;
