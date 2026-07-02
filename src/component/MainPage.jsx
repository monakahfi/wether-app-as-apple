import { useState } from "react";
import SearchWeather from "./SearchWeather";
import Details from "./Details";

function MainPage() {
  
  const [selectedId, setSelectedId] = useState(null);
console.log("selectedId =", selectedId);
  return (
   <div className="flex flex-col lg:flex-row">
    <div className="lg:w-[390px]">
        <SearchWeather setSelectedId={setSelectedId}/>
    </div>

   <div className="hidden lg:flex flex-1 bg-black">
    {selectedId && <Details id={selectedId} />}
</div>
</div>
  );
}

export default MainPage;