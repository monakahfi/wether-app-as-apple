
import Details from "./component/Details";
import MainPage from "./component/MainPage";
import SearchWeather from "./component/SearchWeather"
import './input.css'

import {  Router, Routes, Route } from "react-router-dom";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={ <MainPage/>}/>
        <Route path="/search" element={ <SearchWeather/>}/>
        <Route path="/details/:tz_id" element={<Details/>}/>
      </Routes>
  
    
    </>
  )
}

export default App
