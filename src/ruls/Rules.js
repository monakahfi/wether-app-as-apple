import { getCityCookies, setCityCookie } from "../cookie/Cookie";
import { fetchCurrentWeather } from "../feature/CurrentWeatherSlice";
import { fetchGeoWeather } from "../feature/LocationSlice";



/* ================= GEO ================= */

const GetGeoSearch = ({ geoWeather, setWeatherCards }) => {
  const data = geoWeather?.data;
  const coord = data?.coord;

  if (!data || !coord?.lat || !coord?.lon) return;

  setCityCookie({
    name: "Geo",
    id: data.id,
    lat: coord.lat,
    lon: coord.lon
  });

  setWeatherCards((prev) => {
    const exists = prev.find((card) => card.id === data.id);

    return exists
      ? prev.map((card) =>
          card.id === data.id ? { ...card, data } : card
        )
      : [...prev, { city: "geo", data, id: data.id }];
  });
};



/* ================= CURRENT ================= */
const GetCurrentSearch = ({ currentWeather, setWeatherCards }) => {
  if (!currentWeather?.data) return;

  Object.values(currentWeather.data).forEach((weatherData) => {
    const { id, name, coord } = weatherData;

    setCityCookie({
      name,
      id,
      lat: coord.lat,
      lon: coord.lon
    });

    setWeatherCards((prev) => {
      const exists = prev.find(
        (card) => card.city.toLowerCase() === name.toLowerCase()
      );

      return exists
        ? prev.map((card) =>
            card.city.toLowerCase() === name.toLowerCase()
              ? { ...card, data: weatherData }
              : card
          )
        : [...prev, { city: name, data: weatherData, id }];
    });
  });
};


/* ================= LOAD FROM COOKIE ================= */

const ShowCard = ({ dispatch, setWeatherCards }) => {
  const savedCities = getCityCookies();

  savedCities.forEach(({ name, id }) => {
    if (name === "Geo") {
      dispatch(fetchGeoWeather()).then((res) => {
        if (!res.payload) return;

        setWeatherCards((prev) =>
          prev.find((c) => c.id === res.payload.id)
            ? prev
            : [...prev, { city: "geo", data: res.payload, id: res.payload.id }]
        );
      });
    } else {
      dispatch(fetchCurrentWeather(name)).then((res) => {
        if (!res.payload) return;

        setWeatherCards((prev) =>
          prev.find((c) => c.id === id)
            ? prev
            : [...prev, { city: name, data: res.payload, id }]
        );
      });
    }
  });
};


/* ================= LG SIZE ================= */

const ShowLgSize = ({ dispatch, setWeatherCards }) => {
  if (window.innerWidth <= 1024) return;

  const [firstCity] = getCityCookies();
  if (!firstCity || firstCity.name === "Geo") return;

  dispatch(fetchCurrentWeather(firstCity.name)).then((res) => {
    if (!res.payload) return;

    setWeatherCards((prev) =>
      prev.find((c) => c.id === res.payload.id)
        ? prev
        : [...prev, { city: res.payload.name, data: res.payload, id: res.payload.id }]
    );
  });
};

export { GetGeoSearch, GetCurrentSearch, ShowCard, ShowLgSize };
