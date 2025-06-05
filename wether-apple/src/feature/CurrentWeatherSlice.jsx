import{ createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'



const fetchCurrentWeather =createAsyncThunk(
  "currentWeather/fetchCurrentWeather",
  async(cityName,thunkAPI)=>{
   try{
    const key="207d4477b43c4ed78ff103733250306";
     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}current.json?key=${key}&q=${cityName}&aqi=yes`);
     return response.data;
  }catch(error){
   return thunkAPI.rejectWithValue(error.response?.data?.error || error.message)
  }
  },
);

const initialState = {
  current: {},
  location: {},
  isLoading: false,
  error: null
}

const WeatherCurrentSlice = createSlice({
  name: 'weather',
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
        state.current = action.payload.current;
        state.location = action.payload.location;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
export default WeatherCurrentSlice.reducer;
export { fetchCurrentWeather };
