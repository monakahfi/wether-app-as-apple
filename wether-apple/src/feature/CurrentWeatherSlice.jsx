import{ createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'



const fetchCurrentWeather =createAsyncThunk(
  "currentWeather/fetchCurrentWeather",
  async(cityName,thunkAPI)=>{
   try{
    const key="207d4477b43c4ed78ff103733250306";
     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}current.json?key=${key}&q=${cityName}&aqi=yes`);
     console.log("Weather Data:", response);
     return response.data;
  }catch(error){
   return thunkAPI.rejectWithValue(error.response?.data?.error || error.message)
  }
  },
);

const initialState = {
  // current: {},
  // location: {},
  data:{},
  isLoading: false,
  error: null
}

const WeatherCurrentSlice = createSlice({
  name: 'currentWeather',
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
        const city = action.meta.arg.toLowerCase();
        state.data[city] = action.payload; // هر شهر رو داینامیک ذخیره می‌کنیم
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default WeatherCurrentSlice.reducer;
export { fetchCurrentWeather };
