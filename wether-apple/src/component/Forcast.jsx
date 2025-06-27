import React from 'react'

function Forcast({data,isLoading,error}) {
    const forecastDays = data?.forecast?.forecastday || [];
    if(isLoading)return <p>loading....</p>
    if(error)return<p>{error.message}</p>
    console.log({data})
  return (
    <>
    <div className='w-[335px] h-[212px] flex shadow-2xl shadow-white border-2 border-white justify-center items-center'>
        {forecastDays[0]?.hour.slice(0,5).map((hour,index)=>(
           <div key={index} className=' w-[34px] h-[72px]flex flex-row justify-center items-center' >
            <p className='w-[30px] h-[20px] text-xs text-white '>{hour.time.split(" ")[1]}</p>
            <img src= {hour?.condition?.icon} className='w-[30px] h-[26px]  items-center   '/>
            <p>{hour.temp_c}</p>
           </div>
        ))}
       
    </div>
   <div>

   </div>
   </>
  )
}

export default Forcast