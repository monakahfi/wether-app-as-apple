import { CgMenuRound } from "react-icons/cg";
import Current from "./Current";
import GeoWeather from "./GeoWeather";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { FaSearchMinus } from "react-icons/fa";
import { getCityCookies, setCityCookie } from "../cookie/Cookie";
import { redirect, useLocation, useNavigate } from "react-router-dom";


function SearchWeather() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
 const [weatherCards, setWeatherCards] = useState([]);
 const currentWeather = useSelector((state) => state.currentWeather);
const geoWeather = useSelector((state) => state.location);
const currentLoading = useSelector((state) => state.currentWeather.isLoading);
const geoLoading = useSelector((state) => state.location.isLoading);
const currentError = useSelector((state) => state.currentWeather.error);
const geoError = useSelector((state) => state.location.error);
const location = useLocation();

  console.log({currentWeather,geoWeather , currentLoading , geoLoading , currentError , geoError});



useEffect(() => {
  if (search && currentWeather?.data) {
    const weatherData = currentWeather.data[search.toLowerCase()];
    if (!weatherData) return;

    setWeatherCards((prev) => {
      const exists = prev.find((card) => card.city === search);
      if (exists) {
        return prev.map((card) =>
          card.city === search
            ? { ...card, data: weatherData, tz_id: weatherData.location?.tz_id }
            : card
        );
      } else {
        return [
          ...prev,
          { city: search, data: weatherData, tz_id: weatherData.location?.tz_id },
        ];
      }
    });
  } else if (!search && geoWeather && geoWeather.location) {
    setWeatherCards((prev) => {
      const exists = prev.find((card) => card.city === "Geo");
      if (exists) {
        return prev.map((card) =>
          card.city === "Geo"
            ? { ...card, data: geoWeather, tz_id: geoWeather.location.tz_id }
            : card
        );
      } else {
        return [...prev, { city: "Geo", data: geoWeather, tz_id: geoWeather.location?.tz_id }];
      }
    });
  }
}, [search, currentWeather, geoWeather]);

  useEffect(() => {
  const savedCities = getCityCookies(); // از کوکی بخون
  if(navigate === "/"){
    savedCities.find(({name , tz_id})=>{
      if(name && tz_id && tz_id === "geo") {
        dispatch(fetchGeoWeather()).then((res)=>{
          const data = res.payload;
          if(!data)return;
        })
      }else{
        dispatch(fetchCurrentWeather([0])).then((res)=>{
          const data = res.payload;
          if(!data)return;
        })
      }
    })//برای نمایش داده برای سایز lg
    
  }
  savedCities.forEach(({ name, tz_id }) => {
   if (name && tz_id && tz_id === "Geo"){
      dispatch(fetchGeoWeather()).then((res) => {
        const data = res.payload;
        if (!data) return;

        setWeatherCards((prev) => {
          const exists = prev.find((card) => card.city === "Geo");
          if (exists) return prev;
          return [...prev, { city: "Geo", data, tz_id: "Geo" }];
        });
      });
    } else {
      dispatch(fetchCurrentWeather(name)).then((res) => {
        const data = res.payload;
        if (!data) return;

        setWeatherCards((prev) => {
          const exists = prev.find((card) => card.city.toLowerCase() === name.toLowerCase());
          if (exists) return prev;
          return [...prev, { city: name, data, tz_id: data.location?.tz_id }];
        });
      });
    }
  });
}, [location.pathname , navigate]); 


const clickHandler = (e) => {
  const trimCity = city.trim();

  // جلوگیری از درخواست تکراری برای شهر موجود
  const exists = weatherCards.find((card) => card.city?.toLowerCase() === trimCity?.toLowerCase());
  if (trimCity && exists) {
    console.log("این شهر قبلاً اضافه شده");
    setCity(""); // ریست کردن input
    return;
  }

  if (!trimCity) {
    dispatch(fetchGeoWeather());
    const geoExists = weatherCards.find((card) => card.city === "Geo");
    if (geoExists) return;
    setWeatherCards((prev) => [
      ...prev,
      { city: "Geo", data: geoWeather, tz_id: geoWeather?.location?.tz_id },
    ]);
  } else {
   

    dispatch(fetchCurrentWeather(trimCity)).then((res) => {
      const data = res.payload;
      if (!data) return;

        setCityCookie({
    name: trimCity,
    tz_id: data.location.tz_id
  });
      setWeatherCards((prev) => [
        ...prev,
        { city: trimCity, data, tz_id: data.location.tz_id },
      ]);
    });
  }

  setCity("");
};


  return (
    <div className="w-[375px] h-[812px]   bg-black absolute flex flex-col items-center p-4 ">
      <div className="w-full flex  mb-1 pb-1 gap-4 justify-between ">
        <CgMenuRound className="w-[29px] h-[29px] text-white items-start" />
        <p className="font-bold text-white text-xl items-end">Weather</p>
        </div>
        <div className="w-[320px]  h-[39px] flex  m-2 gap-4 ">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city or airport"
          className="placeholder:text-white w-full h-[39px] p-4 bg-gray-700 rounded-2xl text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") clickHandler(e);
          }}
        />

        <button onClick={clickHandler} className="text-white w-[23px] h-[39px] self-end">
          <FaSearchMinus />
        </button>
         </div>
      
        
         <div className="mt-0 w-full flex flex-col gap-4 overflow-y-auto ">
          // ... (بخش‌های قبلی کد بدون تغییر)

{weatherCards.map((card) =>
            card.data  && card.tz_id ? (
              card.city === "Geo" ? (
                <GeoWeather
                  key={card.tz_id}
                  data={card.data}
                  isLoading={geoLoading}
                  error={geoError}
                  onClick={() => navigate(`/details/${encodeURIComponent(card.tz_id)}`)}
                />
              ) : (
                <Current 
                  key={`${card.city}-${card.data.location?.name}-${card.tz_id}`}

                  data={card.data}
                  isLoading={currentLoading}
                  error={currentError}
                  onClick={() => navigate(`/details/${encodeURIComponent(card.tz_id)}`)}
                />
              )
            ) : null
          )}

        </div>
      </div>
   
  );
}

export default SearchWeather;