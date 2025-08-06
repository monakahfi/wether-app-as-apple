
import Details from "./component/Details";
import SearchWeather from "./component/SearchWeather"
import './input.css'

import {  Router, Routes, Route } from "react-router-dom";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={ <SearchWeather/>}/>
        <Route path="/details/:tz_id" element={<Details/>}/>
      </Routes>
  
    
    </>
  )
}

export default App
