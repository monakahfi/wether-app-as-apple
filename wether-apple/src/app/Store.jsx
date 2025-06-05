import { configureStore } from "@reduxjs/toolkit";
import forecastReducer from "../feature/forecastWeatherSlice";
import currentWeatherReducer from "../feature/CurrentWeatherSlice"

const store = configureStore({

  reducer: {
    forecast: forecastReducer,
    currentWeather: currentWeatherReducer,
    // location: locationReducer,
    // search: searchReducer,
    // favorites: favoritesReducer,
  },
});

export default store;