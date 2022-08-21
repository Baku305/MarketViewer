
import { Market } from "./market";
import { Assets } from "./Asset";
import { Route, Routes } from "react-router-dom";


function App() {

  return (
    <Routes>
      <Route path="/" element = {<Market/>}/>
      <Route path="/:base_asset" element = {<Market/>}/>
      <Route path="assets" element = {<Assets/>}/>
    </Routes>
  );
}

export default App;
