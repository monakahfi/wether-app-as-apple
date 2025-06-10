import { CgMenuRound } from "react-icons/cg";
import Current from "./Current";
import GeoWeather from "./GeoWeather";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { FaSearchMinus } from "react-icons/fa";

function SearchWeather() {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  const clickHandler = () => {
    setSearch(city.trim());

    if (city.trim() === "") {
      dispatch(fetchGeoWeather());
    } else {
      dispatch(fetchCurrentWeather(city));
    }
  };

  return (
    <div className="w-[375px] h-[812px] bg-black absolute flex flex-col items-center p-4">
      <div className="w-full flex flex-col gap-4">
        <CgMenuRound className="w-8 h-8 text-white" />
        <p className="font-bold text-white text-xl">Weather</p>

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

        {/* Conditional Rendering */}
        {search === "" ? <GeoWeather /> : <Current />}
      </div>
    </div>
  );
}

export default SearchWeather;
