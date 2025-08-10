import { getCityCookies } from "../cookie/Cookie";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";

// هندل Geo
const GetGeoSearch = ({ geoWeather, setWeatherCards }) => {
  if (!geoWeather?.location) return;
  const tzId = geoWeather.location?.tz_id;

  setWeatherCards((prev) => {
    const exists = prev.some((card) => card.tz_id === tzId);
    return exists
      ? prev.map((card) =>
          card.tz_id === tzId
            ? { ...card, data: geoWeather }
            : card
        )
      : [...prev, { city: "geo", data: geoWeather, tz_id: tzId }];
  });
};

// هندل Current
const GetCurrentSearch = ({ currentWeather, setWeatherCards }) => {
  if (!currentWeather?.data) return;

  Object.entries(currentWeather.data).forEach(([cityName, weatherData]) => {
    const tzId = weatherData.location?.tz_id;
    setWeatherCards((prev) => {
      const exists = prev.find((card) => card.city.toLowerCase() === cityName.toLowerCase());
      return exists
        ? prev.map((card) =>
            card.city.toLowerCase() === cityName.toLowerCase()
              ? { ...card, data: weatherData }
              : card
          )
        : [...prev, { city: cityName, data: weatherData, tz_id: tzId }];
    });
  });
};

// لود اولیه کارت‌ها
const ShowCard = ({ dispatch, setWeatherCards }) => {
  const savedCities = getCityCookies();
  const isLargeScreen = window.innerWidth >= 1024;

  // اگر LG فقط شهر اول رو بگیره
  const citiesToLoad = isLargeScreen ? savedCities.slice(0, 1) : savedCities;

  citiesToLoad.forEach(({ name, tz_id }) => {
    const lowerTz = tz_id?.toLowerCase();

    if (lowerTz === "geo") {
      dispatch(fetchGeoWeather()).then((res) => {
        const data = res.payload;
        if (!data) return;
        setWeatherCards((prev) => {
          const exists = prev.some((card) => card.tz_id === "geo");
          return exists ? prev : [...prev, { city: "geo", data, tz_id: "geo" }];
        });
      });
    } else if (name) {
      dispatch(fetchCurrentWeather(name)).then((res) => {
        const data = res.payload;
        if (!data) return;
        setWeatherCards((prev) => {
          const exists = prev.find((card) => card.tz_id === data.location?.tz_id);
          return exists ? prev : [...prev, { city: name, data, tz_id: data.location?.tz_id }];
        });
      });
    }
  });
};

export { GetGeoSearch, GetCurrentSearch, ShowCard };
