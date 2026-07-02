import React from 'react'
import SearchWeather from './SearchWeather'
import Details from './Details'

function MainPage() {
    
  return (
    <div >
  <div className="w-full lg:w-1/2 ">
    <SearchWeather />
  </div>
  <div className="hidden lg:block w-1/2 items-start">
    <Details />
  </div>
</div>
  )
}

export default MainPage