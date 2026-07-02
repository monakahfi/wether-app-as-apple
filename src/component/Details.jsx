import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchForeCastWeather } from "../feature/ForeCastSlice";
import { getCityCookies } from "../cookie/Cookie";
import Forcast from "./Forcast";

import { IoCalendarOutline } from "react-icons/io5";

import {ThreeDot} from "react-loading-indicators";

function Details({ id: desktopId }) {
  const navigate = useNavigate();
const { id: routeId } = useParams();

const id = desktopId ?? routeId;
console.log(id)
 

  const dispatch = useDispatch();
  const [place, setPlace] = useState("");
 
  const forecastData = useSelector((state) => state.forecast)
  const currentWeather = useSelector((state) => state.currentWeather);
  const geoWeather = useSelector((state) => state.geoWeather);


useEffect(() => {
  if (!id) return;

  const cookie = getCityCookies();

  if (id === "Geo") {
    dispatch(fetchGeoWeather());
    return;
  }

  const matchedCity = cookie.find(c => String(c.id) === id);

  if (!matchedCity) return;

  setPlace(matchedCity.name);

  dispatch(fetchCurrentWeather(matchedCity.name));

  dispatch(
    fetchForeCastWeather({
      lat: matchedCity.lat,
      lon: matchedCity.lon,
    })
  );
}, [id, dispatch]);

  const isGeoValid = id === "Geo";


console.log("currentWeather =", currentWeather);
console.log("currentWeather.data =", currentWeather.data);

const weatherData = isGeoValid
  ? geoWeather.data
  : currentWeather.data?.[id];

console.log("id =", id, typeof id);
console.log("keys =", Object.keys(currentWeather.data));
console.log("lookup =", currentWeather.data[id]); 

  if (currentWeather?.isLoading || geoWeather?.isLoading  || forecastData?.isLoading ) return <ThreeDot variant="bob" color="#3192cc" size="small" text="" textColor="#1811e8" />;
  // if (currentWeather.error || geoWeather.error  || forecastData.error ) return <p className="text-red-500 mt-4">خطا: </p>;
  console.log("weatherData =", weatherData);
  return (
    <div className="w-[375px] h-full flex flex-col items-center bg-black py-4 gap-4 max-md:w-auto max-md:h-full z-10">
      <button className="text-white" onClick={() => navigate("/")}>بازگشت</button>

      {weatherData?.main && (

        <div className="w-[375px] h-[195px]  text-white rounded-2xl p-4 shadow-3xl shadow-white flex flex-col items-center gap-2">
       <p>{weatherData.name}</p>
       <p>{weatherData.main.temp}°C</p>
        <p>{weatherData.weather?.[0]?.description}</p>

        </div>
      )}

      { forecastData?.data?.list?.length  ? (
        <div className="w-[375px] h-auto flex items-center justify-center rounded-2xl gap-2 text-white">
          <Forcast
            data={forecastData.data}
            isLoading={forecastData.isLoading}
            error={forecastData.error}
          />
        </div>
      ) : null }

      <div className="flex flex-col w-[335px] h-[275px] border-2 border-white p-4 gap-4">
        <p className="font-bold text-white border-b border-white flex items-center gap-2">
          <IoCalendarOutline /> 3-DAY FORECAST
        </p>

        {forecastData.data?.list?.slice(0, 3).map((item, index) => {
         const date = new Date(item.dt_txt);
const label =
  index === 0
    ? "Today"
    : date.toLocaleDateString("en-US", { weekday: "long" });

const minTemp = item.main.temp_min;
const maxTemp = item.main.temp_max;
const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          const totalRange = 60;
          const leftPercent = (minTemp / totalRange) * 100;
          const widthPercent = ((maxTemp - minTemp) / totalRange) * 100;

          console.log(forecastData.data);
console.log(forecastData.data?.list);

          return (
            <div key={item.dt} className="h-[55px] w-[303px] text-white flex gap-2 border-b border-gray-600 pb-4">
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
