import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchForeCastWeather } from "../feature/ForeCastSlice";
import { getCityCookies } from "../cookie/Cookie";
import Forcast from "./Forcast";

import { IoCalendarOutline } from "react-icons/io5";

function Details() {
  const { tz_id } = useParams();
  const decodedTzId = decodeURIComponent(tz_id.split("/")[1]);
  const dispatch = useDispatch();
  const [place, setPlace] = useState(null);

const currentWeather = useSelector((state) => state.currentWeather);
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

    // بررسی geo یا matchedCookie
    const matchedCity = cookie.find(
      (c) => typeof c === "object" && c.tz_id === decodedTzId
    );

 if (decodedTzId === "Geo") {
  name = "Geo";
} else if (matchedCity) {
  name = matchedCity.name;
} else {
  name = decodedTzId.split("/").pop().replace("_", " ");
}

    if (!name) return;

    setPlace(name);

    if (name === "Geo") {
      dispatch(fetchGeoWeather());
      dispatch(fetchForeCastWeather("Geo"));
    } else {
      dispatch(fetchCurrentWeather(name));
      dispatch(fetchForeCastWeather(name));
    }
    console.log("👉 Requested forecast for:", name);

  }, [decodedTzId]);

  // 🔍 بررسی اینکه geo valid هست یا نه
  const isGeoValid =
    decodedTzId === "Geo" && geoWeather.location?.tz_id === "Geo";

  const weatherData = isGeoValid ? geoWeather : currentWeather;

if (
  (!weatherData?.current || !forecastData?.forecast || !geoWeather.location) &&
  !currentLoading &&
  !geoLoading &&
  !forecastLoading
) {
  return <p>داده‌های آب‌وهوا در دسترس نیست</p>;
}

  console.log({weatherData})
  console.log({currentWeather})
  console.log({forecastData})
  console.log({decodedTzId})

  return (
    <div className="w-[375px] h-[812px] flex flex-col   items-center bg-black py-4 gap-4  ">
      
       {weatherData?.location && weatherData?.current && (
      <div  className="w-[375px] h-[195px] text-white rounded-2xl p-4 shadow-3xl justify-center  shadow-white flex flex-col items-center gap-2">
        
          
    <p className="  text-3xl text-white font-bold items-center">{weatherData?.location?.name}</p>
    <p className="   items-center font-bold ">{weatherData.current?.temp_c}°C</p>
    <p className=" items-center ">{weatherData.current?.condition?.text}</p> 
       
  </div>
  )}
 {/* {!forecastData.alerts ?<p className="w-[30px] h-[20px] text-xs text-white ">
        {forecastData.alerts?.alert}</p>:<p className="w-[30px] h-[20px] text-xs text-white ">no exist alert</p>} */}
{forecastData?.forecast?.forecastday?.length > 0 && (
<div className='w-[375px]  h-auto flex  items-center justify-center rounded-2xl box-border gap-2 text-white'>
  
  <Forcast
   
    data={forecastData}
    isLoading={forecastLoading}
    error={forecastError}
  />
</div>
)}
 {/* <div className="flex w-[335px] h-[275px]  scroll-my-5 border-2 border-white">
<p className=" font-bold text-white flex  border-b-white"><IoCalendarOutline /> 10-DAY  FORECAST</p>
{forecastData.map((data)=>(
  <p>{data?.forcast?.forecastday?.length < 3 &&  }</p>
))}
 </div>
   */}
   <div className="flex flex-col w-[335px] border-2 border-white p-4 gap-4">
  <p className="font-bold text-white border-b border-white flex items-center gap-2">
    <IoCalendarOutline /> 3-DAY FORECAST
  </p>

  {forecastData.forecast?.forecastday?.slice(0, 3).map((dayData, index) => {
    const date = new Date(dayData.date);
    const label = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" });

    const minTemp = dayData.day.mintemp_c;
    const maxTemp = dayData.day.maxtemp_c;
    const icon = dayData.day.condition.icon;

    // برای ساخت تایم‌لاین
    const tempRange = maxTemp - minTemp;
    const progressPercent = Math.round((minTemp / maxTemp) * 100);

    return (
      <div
        key={dayData.date}
        className="text-white flex flex-col gap-2 border-b border-gray-600 pb-4"
      >
        <p className="text-lg font-semibold">{label}</p>

        <div className="flex items-center gap-4">
          <img src={icon} alt="weather icon" className="w-10 h-10" />
          <p className="text-sm">
            Min: {minTemp}°C | Max: {maxTemp}°C
          </p>
        </div>

        {/* تایم‌لاین دما */}
        <div className="w-full h-2 bg-white/30 rounded relative mt-2">
          <div
            className="h-2 bg-yellow-400 rounded"
            style={{ width: `${(minTemp / maxTemp) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  })}
</div>

    

    </div>


  );
}

export default Details;
