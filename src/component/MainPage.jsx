import React from 'react'
import SearchWeather from './SearchWeather'
import Details from './Details'

function MainPage() {
    
  return (
     <div className="flex flex-col lg:flex-row  bg-black">
      <div className="flex-1 ">
        <SearchWeather />
      </div>
      <div className="hidden lg:block flex-1 max-w-fit">
        <Details />
      </div>
    </div>
  )
}

export default MainPage