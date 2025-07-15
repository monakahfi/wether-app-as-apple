 
function Forcast({data,isLoading,error}) {
    const forecastDays = data?.forecast?.forecastday || [];
    if(isLoading)return <p>loading....</p>
    if(error)return<p>{error.message}</p>
    console.log({data})
  return (
    <>
    <div className='w-[335px] h-[212px] flex shadow-2xl flex-col shadow-white border-2  text-white border-white justify-between '>
     <div className="w-[335px] h-[70px] ">
       {!data.alerts ?<p className="w-[30px] h-[20px] text-xs font-medium text-white ">
        {data?.alerts?.alert}</p>:<p className="w-[30px] h-[20px] text-xs font-semibold text-white ">no exist alert</p>}
        </div> 
       <div className='w-[335px] h-[140px] flex  border-2 gap-2 text-white justify-between items-end'>
        {forecastDays[0]?.hour.slice(0,5).map((hour,index)=>(
           <div key={index} className=' w-[34px] h-[72px] flex  flex-col justify-center items-center' >
            <p className='w-[30px] h-[20px] text-xs text-white '>{hour.time.split(" ")[1]}</p>
            <img src= {hour?.condition?.icon} className='w-[30px] h-[26px]  items-center   '/>
            <p className=' w-[34px]  h-[26px] text-xs'>{hour?.temp_c}</p>
           </div>
        ))}
       </div>
    </div>
   
   </>
  )
}

export default Forcast