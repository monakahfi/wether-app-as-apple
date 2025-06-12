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
//  useEffect(() => {
//   console.log([ search,currentWeather, geoWeather])
//     if (search && currentWeather) {
//       setWeatherCards((prev) => {
//         const exists = prev.find((card) => card.city === search);
//         if (!exists) {
//           return [...prev, { city: search, data: currentWeather }];
//         }
//         return [...prev]; 
        
      
//       });
   
//       setCityCookie(search);
      
//     } else if (!search && geoWeather) {
      
//       setWeatherCards((prev) => {
       
//         const exists = prev.find((card) => card.city === "Geo");
//         if (!exists) {
//           return [...prev, { city: "Geo", data: geoWeather }];
//         }
//        return [...prev]; 
//     });
    
//     }
   
//   }, [ search,currentWeather, geoWeather]);
 useEffect(() => {
    console.log([search, currentWeather, geoWeather]);
    if (search && currentWeather) {
      setWeatherCards((prev) => [...prev, { city: search, data: currentWeather }]);
      setCityCookie(search);
    } else if (!search && geoWeather) {
      setWeatherCards((prev) => [...prev, { city: "Geo", data: geoWeather }]);
    }
  }, [search, currentWeather, geoWeather]);
  const clickHandler = () => {
    const trimCity = city.trim(); 
    setSearch(trimCity);

    if (trimCity) {
      setCityCookie(trimCity);
      dispatch(fetchCurrentWeather(trimCity));
    } else {
      dispatch(fetchGeoWeather());
    }
    setCity("");
  };

  return (
    <div className="w-[375px] h-[812px] bg-black absolute flex flex-col items-center p-4">
      <div className="w-full flex flex-col gap-4">
        <CgMenuRound className="w-8 h-8 text-white" />
        <p className="font-bold text-white text-xl">Weather</p>
        <div className="flex m-2 ">
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

        <button onClick={clickHandler} className="text-white self-end">
          <FaSearchMinus />
        </button>
         </div>
      
        {/* <div className="mt-0 w-full flex flex-col gap-4">
          {weatherCards.map((card, index) =>
            card.data ? (
              <Current
                key={index}
                data={card.data}
                isLoading={card.city === search ? currentLoading : null} // یا یه مقدار دیگه اگه جداگانه مدیریت می‌کنی
                error={currentError}
              />
            ) : <GeoWeather
              key={index}
                data={card.data}
                isLoading={card.city === search ?  geoLoading : null} // یا یه مقدار دیگه اگه جداگانه مدیریت می‌کنی
                error={currentError}
            />
          )}
        </div>

        {search === "" ? (
          <GeoWeather data={geoWeather} isLoading={geoLoading} error={geoError} />
        ) : (
          <Current data={currentWeather} isLoading={currentLoading} error={currentError} />
        )} */}
         <div className="mt-0 w-full flex flex-col gap-4">
          {weatherCards.map((card, index) =>
            card.data ? (
              <Current
                key={index}
                data={card.data}
                isLoading={card.city === search ? currentLoading : geoLoading}
                error={currentError || geoError}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchWeather;
