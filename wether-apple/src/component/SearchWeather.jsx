import { CgMenuRound } from "react-icons/cg";
import Current from "./Current";
import GeoWeather from "./GeoWeather";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { FaSearchMinus } from "react-icons/fa";
import { getCityCookies, setCityCookie } from "../cookie/Cookie";


function SearchWeather() {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
   const [weatherCards, setWeatherCards] = useState([]);
     const {currentWeather,geoWeather , currentLoading , geoLoading , currentError , geoError} = useSelector((state)=>({
   currentWeather : state.currentWeather ,
    geoWeather: state.location ,
    currentLoading :state.currentWeather.isLoading,
    geoLoading : state.location.isLoading,
    currentError :state.currentWeather.error,
    geoError: state.location.error,
  }));
  console.log({currentWeather,geoWeather , currentLoading , geoLoading , currentError , geoError});

     useEffect(() => {
    setWeatherCards(getCityCookies().map((city)=>({city, data:null})));
  }, []);

useEffect(() => {
  if (search && currentWeather) {
    setWeatherCards((prev) => {
      const exists = prev.find((card) => card.city === search);

      if (exists) {
        // فقط داده‌ی شهر موجود رو آپدیت کن
        return prev.map((card) =>
          card.city === search ? { ...card, data: currentWeather } : card
        );
      } else {
        // اگه وجود نداشت، اضافه‌اش کن
        setCityCookie(search);
        return [...prev, { city: search, data: currentWeather }];
      }
    });
  } else if (!search && geoWeather) {
    setWeatherCards((prev) => {
      const exists = prev.find((card) => card.city === "Geo");
      if (exists) {
        return prev.map((card) =>
          card.city === "Geo" ? { ...card, data: geoWeather } : card
        );
      } else {
        return [...prev, { city: "Geo", data: geoWeather }];
      }
    });
  }
}, [search, currentWeather, geoWeather]);

  const clickHandler = () => {
    const trimCity = city.trim(); 
    setSearch(trimCity);

    if (trimCity) {
      dispatch(fetchCurrentWeather(trimCity));
      setCityCookie(trimCity);
    } else {
      dispatch(fetchGeoWeather());
    }
    setCity("");
  };

  return (
    <div className="w-[375px] h-[812px] bg-black absolute flex flex-col items-center p-4 ">
      <div className="w-full flex flex-col gap-4">
        <CgMenuRound className="w-[29px] h-[29px] text-white items-start" />
        <p className="font-bold text-white text-xl items-end">Weather</p>
        <div className="flex m-2 gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city or airport"
          className="placeholder:text-white w-full h-[39px] p-4 bg-gray-700 rounded-2xl text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") clickHandler();
          }}
        />

        <button onClick={clickHandler} className="text-white w-[39px] h-[39px] self-end">
          <FaSearchMinus />
        </button>
         </div>
      
        
         <div className="mt-0 w-full flex flex-col gap-4 overflow-y-auto">
          {weatherCards.map((card, index) =>
  card.data ? (
    card.city === "Geo" ? (
      <GeoWeather
        key={index}
        data={card.data}
        isLoading={geoLoading}
        error={geoError}
      />
    ) : (
      <Current
        key={index}
        data={card.data}
        isLoading={currentLoading}
        error={currentError}
      />
    )
  ) : null
)}

        </div>
      </div>
    </div>
  );
}

export default SearchWeather;
