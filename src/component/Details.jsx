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

function Details() {
  const navigate = useNavigate();
  const {id} = useParams();
   const idn = decodeURIComponent(id)
 

  const dispatch = useDispatch();
  const [place, setPlace] = useState("");
 
  const forecastData = useSelector((state) => state.forecast)
  const currentWeather = useSelector((state) => state.currentWeather);
  const geoWeather = useSelector((state) => state.geoWeather);


 
  useEffect(() => {
    const cookie = getCityCookies();
    let name = null;

    const matchedCity = cookie.find((c) => c.id === idn );
    if (!name) return;

    if (idn === "Geo") {
      name = "Geo";
    } else if (matchedCity) {
      name = matchedCity.name;
    } else {
      name = idn
    }

    

    setPlace(name);
    const existingCity = name == "Geo" && !currentWeather.data?.name;
    const lat = matchedCity?.lat
    const lon = matchedCity?.lon

    if (name === "Geo") {
        
      Promise.all([

        dispatch(fetchGeoWeather()),
        dispatch(fetchForeCastWeather({ lat, lon })) 
      ]);
    } else {
      if (!existingCity) {
        dispatch(fetchCurrentWeather(currentWeather.name));
        
        dispatch(fetchForeCastWeather( { lat,lon } ));
      }
    }
    
  }, [idn , dispatch]);

  const isGeoValid = idn === "Geo";


 const weatherData = isGeoValid ? geoWeather.data : currentWeather.data?.[idn];

  console.log(forecastData)
  if (currentWeather.data.isLoading || geoWeather.data.isLoading  || forecastData.data.isLoading ) return <ThreeDot variant="bob" color="#3192cc" size="small" text="" textColor="#1811e8" />;
  if (currentWeather.data.error || geoWeather.data.error  || forecastData.data.error ) return <p className="text-red-500 mt-4">خطا: </p>;
  return (
    <div className="w-[375px] h-[812px] flex flex-col items-center bg-black py-4 gap-4 max-md:w-auto max-md:h-full">
      <button className="text-white" onClick={() => navigate("/")}>بازگشت</button>

      {weatherData?.main && (

        <div className="w-[375px] h-[195px]  text-white rounded-2xl p-4 shadow-3xl shadow-white flex flex-col items-center gap-2">
       <p>{weatherData.name}</p>
       <p>{weatherData.main.temp}°C</p>
        <p>{weatherData.weather?.[0]?.description}</p>

        </div>
      )}

      { forecastData?.forecast?.list?.length  ? (
        <div className="w-[375px] h-auto flex items-center justify-center rounded-2xl gap-2 text-white">
          <Forcast
            data={forecastData.data.data}
            isLoading={forecastData.data.isLoading}
            error={forecastData.data.error}
          />
        </div>
      ) : null }

      <div className="flex flex-col w-[335px] h-[275px] border-2 border-white p-4 gap-4">
        <p className="font-bold text-white border-b border-white flex items-center gap-2">
          <IoCalendarOutline /> 3-DAY FORECAST
        </p>

        {forecastData.forecast?.list?.slice(0, 3).map((dayData, index) => {
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
