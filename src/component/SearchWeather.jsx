import { CgMenuRound } from "react-icons/cg";
import Current from "./Current";
import GeoWeather from "./GeoWeather";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { FaSearchMinus } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { GetCurrentSearch, GetGeoSearch, ShowCard, ShowLgSize } from "../ruls/Rules";


function SearchWeather({ setSelectedId }) {
  

  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

    const currentWeather = useSelector((state) => state.currentWeather);
  const geoWeather = useSelector((state) => state.geoWeather);
  const currentLoading = useSelector((state) => state.currentWeather.isLoading);
  const geoLoading = useSelector((state) => state.geoWeather.isLoading);
  const currentError = useSelector((state) => state.currentWeather.error);
  const geoError = useSelector((state) => state.geoWeather.error);
 
  // لود اولیه فقط یکبار
  useEffect(() => {
    ShowCard({ dispatch, setWeatherCards });
   
  }, [dispatch]);

  // وقتی geoWeather تغییر کرد
useEffect(() => {
  if (geoWeather?.data) {
    GetGeoSearch({ geoWeather, setWeatherCards });
  }
  if (currentWeather?.data) {
    GetCurrentSearch({ currentWeather, setWeatherCards });
  }
}, [geoWeather, currentWeather]);

const clickHandler = () => {
  const trimCity = city.trim();
  if (!trimCity) {
    dispatch(fetchGeoWeather());
    return;
  }

  const exists = weatherCards.find(
    (card) => card.city === trimCity
  );
  if (exists) {
    alert("این شهر قبلاً اضافه شده");
    setCity(" ");
    return;
  }

  dispatch(fetchCurrentWeather(trimCity)); // دیگه اینجا setWeatherCards نکن
  setCity("");
};




  return (
   <div className="w-[390px] h-[812px] max-lg:h-auto max-xl:w-fit bg-black flex flex-col items-center p-4 z-50">
      <div className="w-full flex mb-1 pb-1 gap-4 justify-between">
        <CgMenuRound className="w-[29px] h-[29px] text-white" />
        <p className="font-bold text-white text-xl">Weather</p>
      </div>

      <div className="w-[320px] h-[39px] flex m-2 gap-4">
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
        <button onClick={clickHandler} className="text-white w-[23px] h-[39px]">
          <FaSearchMinus />
        </button>
      </div>

      <div className="mt-0 w-full flex flex-col gap-4 overflow-y-auto">
        {weatherCards.map((card) =>
  card.data && card.id ? (
    card.city.toLowerCase() === "geo" ? (
      <GeoWeather
        key={card?.id}
        data={card?.data}
        isLoading={geoLoading}
        error={geoError}
      onClick={() => {
        console.log("clicked", card.id);
  if (window.innerWidth >= 1024) {
    setSelectedId(`${card.id}`);
  } else {
    navigate(`/details/${card.id}`);
  }
}}
      />
    ) : (
      <Current
        key={card.id}
        data={card.data}
        isLoading={currentLoading}
        error={currentError}
      onClick={() => {
        console.log("clicked", card.id);
  if (window.innerWidth >= 1024) {
    setSelectedId(`${card.id}`);
  } else {
    navigate(`/details/${card.id}`);
  }
}}
      />
    )
  ) : null
)}

      </div>
    </div>
  );
}

export default SearchWeather;
