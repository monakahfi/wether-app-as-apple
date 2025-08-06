import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchForeCastWeather } from "../feature/ForeCastSlice";
import { getCityCookies } from "../cookie/Cookie";
import Forcast from "./Forcast";

import { IoCalendarOutline } from "react-icons/io5";

function Details() {
  const navigate = useNavigate();
  const { tz_id } = useParams();
  const decodedTzId = decodeURIComponent(tz_id);

  const dispatch = useDispatch();
  const [place, setPlace] = useState(null);

  const currentWeather = useSelector((state) => state.currentWeather.data);
  const geoWeather = useSelector((state) => state.location);
  const forecastData = useSelector((state) => state.forecast);

  const currentLoading = useSelector((state) => state.currentWeather.isLoading);
  const geoLoading = useSelector((state) => state.location.isLoading);
  const forecastLoading = useSelector((state) => state.forecast.isLoading);

  const currentError = useSelector((state) => state.currentWeather.error);
  const geoError = useSelector((state) => state.location.error);
  const forecastError = useSelector((state) => state.forecast.error);

  useEffect(() => {
    const cookie = getCityCookies();
    let name = null;

    const matchedCity = cookie.find(
      (c) => c.name && c.tz_id === decodedTzId
    );

    if (decodedTzId === "Geo") {
      name = "Geo";
    } else if (matchedCity) {
      name = matchedCity.name;
    } else {
      name = decodedTzId.split("/")[1]?.replace("_", " ");
    }

    if (!name) return;

    setPlace(name);
    const key = name.toLowerCase();

    const existingCity = name !== "Geo" && !!currentWeather?.[key];

    if (name === "Geo") {
      dispatch(fetchGeoWeather());
      dispatch(fetchForeCastWeather("Geo"));
    } else {
      if (!existingCity) {
        dispatch(fetchCurrentWeather(name));
        dispatch(fetchForeCastWeather(name));
      }
    }
  }, [decodedTzId]);

  const isGeoValid = decodedTzId === "Geo" && geoWeather.location?.tz_id === "Geo";

  const weatherData = isGeoValid
    ? geoWeather
    : currentWeather?.[place?.toLowerCase()];

  if (
    (!weatherData?.current || !forecastData?.forecast || !geoWeather.location) &&
    !currentLoading &&
    !geoLoading &&
    !forecastLoading
  ) {
    return <p>داده‌های آب‌وهوا در دسترس نیست</p>;
  }

  return (
    <div className="w-[375px] h-[812px] flex flex-col items-center bg-black py-4 gap-4 lg:w-full">
      <button className="text-white" onClick={() => navigate("/")}>بازگشت</button>

      {weatherData?.location && weatherData?.current && (
        <div className="w-[375px] h-[195px] text-white rounded-2xl p-4 shadow-3xl shadow-white flex flex-col items-center gap-2">
          <p className="text-3xl font-bold">{place}</p>
          <p className="font-bold">{weatherData.current?.temp_c}°C</p>
          <p>{weatherData.current?.condition?.text}</p>
        </div>
      )}

      {forecastData?.forecast?.forecastday?.length > 0 && (
        <div className="w-[375px] h-auto flex items-center justify-center rounded-2xl gap-2 text-white">
          <Forcast
            data={forecastData}
            isLoading={forecastLoading}
            error={forecastError}
          />
        </div>
      )}

      <div className="flex flex-col w-[335px] h-[275px] border-2 border-white p-4 gap-4">
        <p className="font-bold text-white border-b border-white flex items-center gap-2">
          <IoCalendarOutline /> 3-DAY FORECAST
        </p>

        {forecastData.forecast?.forecastday?.slice(0, 3).map((dayData, index) => {
          const date = new Date(dayData.date);
          const label = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" });
          const minTemp = dayData.day.mintemp_c;
          const maxTemp = dayData.day.maxtemp_c;
          const icon = dayData.day.condition.icon;
          const totalRange = 60;
          const leftPercent = (minTemp / totalRange) * 100;
          const widthPercent = ((maxTemp - minTemp) / totalRange) * 100;

          return (
            <div key={dayData.date} className="h-[55px] w-[303px] text-white flex gap-2 border-b border-gray-600 pb-4">
              <p className="w-[58px] h-[26px] text-xs font-bold">{label}</p>
              <div className="flex items-center gap-4">
                <img src={icon} alt="weather icon" className="w-[28px] h-[26px]" />
              </div>
              <div className="flex items-center w-full gap-2">
                <p className="text-xs w-[33px] text-right">{minTemp}°C</p>
                <div className="relative w-full h-2 bg-white/30 rounded overflow-hidden">
                  <div
                    className="absolute h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs w-[33px]">{maxTemp}°C</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Details;
