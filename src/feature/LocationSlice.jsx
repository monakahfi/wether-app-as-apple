import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// AsyncThunk برای گرفتن لوکیشن و درخواست آب‌وهوا
export const fetchGeoWeather = createAsyncThunk(
  "fetchGeoWeather/geoWeather",
  async (thunkAPI) => {
    try {
      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      const position = await getPosition();
      const lat = Number(position.coords.latitude.toFixed(4));
      const lon = Number(position.coords.longitude.toFixed(4));


      const key = '61bf21e74fbe226da33151612e1a4947';
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`

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
  data: {},     // همه داده‌ها یکجا
  isLoading: false,
  error: "",
},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeoWeather.pending, (state) => {
        state.isLoading = true;
        
      })
 .addCase(fetchGeoWeather.fulfilled, (state, action) => {
  state.isLoading = false;
  state.data = action.payload;   // ✔️ درستش اینه
})

      .addCase(fetchGeoWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Location access denied or failed.";
      });
  },
});

export default geoWeatherSlice.reducer;
