import { ThreeDot } from "react-loading-indicators";

function Forcast({ data, isLoading, error }) {
  const forecastList = data?.forecast?.list || [];

  if (isLoading)
    return (
      <ThreeDot
        variant="bob"
        color="#3192cc"
        size="small"
      />
    );

  if (error) return <p>{error}</p>;

  return (
    <div className="w-[335px] h-[212px] flex shadow-2xl flex-col shadow-white border-2 text-white border-white justify-between">
      
      {/* Header */}
      <div className="w-full h-[40px] flex items-center px-2 text-xs">
        5 Hour Forecast
      </div>

      {/* Hours */}
      <div className="w-full h-[140px] flex gap-2 justify-between items-end px-2">
        {forecastList.length ?( forecastList.slice(0, 5).map((item, index) => {
          const time = item.dt_txt.split(" ")[1].slice(0, 5);
          const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          const temp = Math.round(item.main.temp);

          return (
            <div
              key={forecastList.id}
              className="w-[34px] h-[72px] flex flex-col justify-center items-center"
            >
              <p className="text-xs">{time}</p>
              <img src={icon} className="w-[30px] h-[30px]" />
              <p className="text-xs">{temp}°</p>
            </div>
          );
         })): null
       }
      </div>
    </div>
  );
}

export default Forcast;
