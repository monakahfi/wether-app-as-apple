import { configureStore } from "@reduxjs/toolkit";
import forecastReducer from "../feature/ForeCastSlice";
import currentWeatherReducer from "../feature/CurrentWeatherSlice";
import locationReducer from "../feature/LocationSlice";
import historyReducer from "../feature/FavoritesSlice";
const store = configureStore({

  reducer: {
    forecast: forecastReducer,
    currentWeather: currentWeatherReducer,
    location: locationReducer,
    history: historyReducer,
    
  },
});

export default store;