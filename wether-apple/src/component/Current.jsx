import { useSelector } from "react-redux";

function Current() {
  const {
    location = {},
    current = {},
    isLoading,
    error,
  } = useSelector((state) => state.currentWeather || {});

  return (
    <div>
      {isLoading && <p className="text-gray-400 mt-4">در حال بارگذاری...</p>}
      {error && <p className="text-red-500 mt-4">خطا: {error}</p>}

      {location.name && (
        <div className="flex justify-between w-full bg-blue-600 p-4 mt-6 rounded-xl text-white">
          <div className="flex flex-col">
            <p className="font-bold">{location.country}</p>
            <p className="font-medium">{location.name}</p>
            <p className="font-medium">{current.condition?.text}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-3xl font-bold">{current?.temp_c}°C</p>
            <p className="font-medium">UV: {current?.uv}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Current;
