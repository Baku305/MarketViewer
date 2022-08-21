import App from "./App"
import {BrowserRouter} from 'react-router-dom'
import { Navbar } from "./Navbar"

export function Root(){
return(
 <div className=" relative overflow-x-hidden ">
 <BrowserRouter>
 <Navbar/>
 <App/>
 </BrowserRouter>
 </div>
)
}