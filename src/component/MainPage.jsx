import React from 'react'
import SearchWeather from './SearchWeather'
import Details from './Details'

function MainPage() {
    
  return (
    <div className="flex">
  <div className="w-full lg:w-1/2">
    <SearchWeather />
  </div>
  <div className="hidden lg:block w-1/2">
    <Details />
  </div>
</div>
  )
}

export default MainPage