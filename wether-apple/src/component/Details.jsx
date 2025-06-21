import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCityCookies } from "../cookie/Cookie";
import { useEffect, useState } from "react";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchForeCastWeather } from "../feature/ForeCastSlice";

function Details() {
  const { tz_id } = useParams();
  const decodedTzId = decodeURIComponent(tz_id); // برای دیباگ و استفاده
  const dispatch = useDispatch();
  const [place, setPlace] = useState(null);

  const currentWeather = useSelector((state) => state.currentWeather);
  const geoWeather = useSelector((state) => state.geoWeather);
  const forecastData = useSelector((state) => state.forecastWeather);

  const currentLoading = currentWeather.isLoading;
  const geoLoading = geoWeather?.isLoading;
  const currentError = currentWeather.error;
  const geoError = geoWeather?.error;
  const { isLoading, error } = forecastData;

  const cookie = getCityCookies();
  console.log("cookie structure:", cookie); // برای دیباگ

  // نگاشت tz_id به نام شهر با استفاده از داده‌های موجود
  let cityName = null;
  if (currentWeather.location && currentWeather.location.tz_id === decodedTzId) {
    cityName = currentWeather.location.name;
  } else if (geoWeather?.location && geoWeather.location.tz_id === decodedTzId) {
    cityName = geoWeather.location.name;
  } else {
    const matchedCity = cookie.find((c) => c.tz_id === decodedTzId || c === "Geo");
    cityName = matchedCity || (decodedTzId === "Geo" ? "Geo" : null);
  }

  useEffect(() => {
    if (!cityName) return;
    setPlace(cityName);

    if (cityName === "Geo") {
      dispatch(fetchGeoWeather());
      dispatch(fetchForeCastWeather(cityName));
    } else {
      dispatch(fetchCurrentWeather(cityName));
      dispatch(fetchForeCastWeather(cityName));
    }
  }, [decodedTzId]);

  const weatherData = cityName === "Geo" ? geoWeather : currentWeather;

  if (isLoading || currentLoading || geoLoading)
    return <p className="text-gray-400 mt-4">در حال بارگذاری...</p>;
  if (error || currentError || geoError)
    return <p className="text-red-500 mt-4">خطا: {error || currentError || geoError}</p>;
  if (!weatherData?.location)
    return <p>داده‌های آب‌وهوا در دسترس نیست</p>;

  console.log("currentWeather:", currentWeather);
  console.log("geoWeather:", geoWeather);
  console.log("cityName:", cityName);
  console.log("weatherData:", weatherData);

  return (
    <div className="container w-[375px] h-[812px] flex flex-col justify-between absolute items-center">
      <div className="w-[375px] h-[195px] flex justify-center items-center shadow-2xl">
        <p className="text-white items-center shadow-2xl font-light">
          {weatherData?.location?.name === "Geo" ? "my location" : cityName}
        </p>
      </div>
      {/* نمایش داده‌های آب‌وهوا برای دیباگ */}
      <div className="text-white">
        <p>Temp: {weatherData.current.temp_c}°C</p>
        <p>Condition: {weatherData.current.condition?.text}</p>
      </div>
    </div>
  );
}

export default Details;


