 import {ThreeDot} from "react-loading-indicators";
function GeoWeather({ data, isLoading, error,onClick }) {
  // مدیریت داده‌ها با مقدار پیش‌فرض
  const { location: loc = {}, current = {} } = data || {};

  // اگه در حال بارگذاری یا خطا باشه، فقط اون رو نشون بده
  if (isLoading) return <ThreeDot variant="bob" color="#3192cc" size="small" text="" textColor="#1811e8" />;
  if (error) return <p className="text-red-500 mt-4">خطا: {error}</p>;

  // چک کردن وجود نام شهر برای رندر کارت
  if (!loc.name) return null;

  return (
    <div className="flex justify-between w-full bg-amber-600 p-4 mt-6 rounded-xl text-white" onClick={onClick}>
      <div className="flex flex-col">
        <p className="font-bold">My Location</p>
        <p className="font-medium">{loc.name}</p>
        <p className="font-medium">{current.condition?.text || "N/A"}</p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-3xl font-bold">
          {current?.temp_c !== undefined ? `${current.temp_c}°C` : "N/A"}
        </p>
        <p className="font-medium">UV: {current?.uv || "N/A"}</p>
      </div>
    </div>
  );
}

export default GeoWeather;