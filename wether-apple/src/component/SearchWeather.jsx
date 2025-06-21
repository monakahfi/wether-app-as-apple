import { CgMenuRound } from "react-icons/cg";
import Current from "./Current";
import GeoWeather from "./GeoWeather";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { FaSearchMinus } from "react-icons/fa";
import { getCityCookies, setCityCookie } from "../cookie/Cookie";
import { useNavigate } from "react-router-dom";


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

  console.log({currentWeather,geoWeather , currentLoading , geoLoading , currentError , geoError});
useEffect(() => {
    setWeatherCards(
      getCityCookies().map((city) => ({
        city,
        data: null,
        tz_id: city === "Geo" ? "Geo" : null, // مقدار پیش‌فرض برای tz_id
      }))
    );
  }, []);

// به‌روزرسانی weatherCards با داده‌های آب‌وهوا
  useEffect(() => {
    if (search && currentWeather) {
      setWeatherCards((prev) => {
        const exists = prev.find((card) => card.city === search);
        if (exists) {
          return prev.map((card) =>
            card.city === search
              ? { ...card, data: currentWeather, tz_id: currentWeather.location.tz_id }
              : card
          );
        } else {
          setCityCookie(search);
          return [
            ...prev,
            { city: search, data: currentWeather, tz_id: currentWeather.location.tz_id },
          ];
        }
      });
    } else if (!search && geoWeather) {
      setWeatherCards((prev) => {
        const exists = prev.find((card) => card.city === "Geo");
        if (exists) {
          return prev.map((card) =>
            card.city === "Geo"
              ? { ...card, data: geoWeather, tz_id: geoWeather.location.tz_id }
              : card
          );
        } else {
          return [...prev, { city: "Geo", data: geoWeather, tz_id: geoWeather.location.tz_id }];
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
          // ... (بخش‌های قبلی کد بدون تغییر)

{weatherCards.map((card) =>
            card.data ? (
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
                  key={card.tz_id}
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
    </div>
  );
}

export default SearchWeather;
