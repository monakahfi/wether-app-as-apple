import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchForeCastWeather } from "../feature/ForeCastSlice";
import { getCityCookies } from "../cookie/Cookie";
import Forcast from "./Forcast";

function Details() {
  const { tz_id } = useParams();
  const decodedTzId = decodeURIComponent(tz_id);
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

  return (
    <div className="w-[375px] h-[812px] flex flex-col items-center bg-black opacity-35 py-4 gap-4  ">
      
       {weatherData?.location && weatherData?.current && (
      <div  className="w-[375px] h-[195px] text-white rounded-2xl p-4 shadow-3xl  shadow-white flex flex-col items-center gap-2">
        
          
    <p className="w-[208px] h-[44px] text-7xl text-white font-bold items-center">{weatherData?.location?.name}</p>
    <p className="w-[129px] h-[122px]  items-center font-bold ">{weatherData.current?.temp_c}°C</p>
    <p className="w-[133px] h-[29px] items-center ">{weatherData.current?.condition?.text}</p> 
       
  </div>
  )}

{forecastData?.forecast?.forecastday?.length > 0 && (
<div className='w-[375px]  h-[475px] flex flex-rew  items-center justify-center rounded-2xl box-border  text-white'>
  <Forcast
    data={forecastData}
    isLoading={forecastLoading}
    error={forecastError}
  />
</div>
)}
    </div>


  );
}

export default Details;
