import {ThreeDot} from "react-loading-indicators";

function Current({ data, isLoading, error,onClick }) {
  // مدیریت داده‌ها با مقدار پیش‌فرض
  const {main , name , rain , sys ,wind , weather} = data || {};
 

  // اگه در حال بارگذاری یا خطا باشه، فقط اون رو نشون بده
  if (isLoading) return <ThreeDot variant="bob" color="#3192cc" size="small" text="" textColor="#1811e8" />;
  if (error) return <p className="text-red-500 mt-4">خطا: {error}</p>;

  // چک کردن وجود نام شهر برای رندر کارت
  if (!name) return null;

  return (
    <div className="flex justify-between w-full bg-amber-600 p-4 mt-6 rounded-xl text-white" onClick={onClick}>
      <div className="flex flex-col">
        
        <p className="font-medium">{name} | {sys?.country}</p>
          <p className="font-medium">{rain?.[0]}rain</p>
           <p className="font-medium">{wind?.speed}wind speed</p>
            <p className="font-medium">{main?.humidity}humidity</p>
        <p className="font-medium">min{main?.temp_min}/{main?.temp_max}up</p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-3xl font-bold">
          {main?.temp|| "N/A"}
          
        </p>
        <p className="font-medium">UV: {weather?.[0].description}</p>
      </div>
    </div>
  );
}

export default Current;