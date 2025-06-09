import { useDispatch, useSelector } from "react-redux";
import { fetchGeoWeather } from "../feature/LocationSlice";

export default function GeoWeather() {
  const dispatch = useDispatch();

  // دقت کن اینجا از state.location می‌خونیم چون توی استور تو این کلید هست
  const {
    location: loc = {},
    current = {},
    isLoading,
    error,
  } = useSelector((state) => state.location || {});

  const handleGetWeather = () => {
    dispatch(fetchGeoWeather());
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white space-y-4 text-center">
      <h2 className="text-xl font-bold">📍 آب‌وهوای مکان فعلی</h2>

      <button
        onClick={handleGetWeather}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
      >
        دریافت اطلاعات آب‌وهوا
      </button>

      {isLoading && <p className="text-gray-600">در حال بارگذاری...</p>}

      {error && (
        <p className="text-red-500">خطا در دریافت اطلاعات: {error}</p>
      )}

      {loc?.name && (
        <div className="mt-4 space-y-1 text-gray-800">
          <p>🌍 شهر: {loc.name}</p>
          <p>🌡️ دما: {current.temp_c} درجه سانتی‌گراد</p>
          <p>⛅ وضعیت: {current.condition?.text}</p>
          <img
            src={current.condition?.icon}
            alt={current.condition?.text}
            className="mx-auto"
          />
        </div>
      )}
    </div>
  );
}
