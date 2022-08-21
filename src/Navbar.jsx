import "./navbar.css";
import appLogo from "./assets/SVG/appLogo.svg";
import burgerMenu from "./assets/SVG/burgerMenu.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {

 const [isShown, setIsShown] = useState(false)

 const handleClick = event => {
  setIsShown(current => !current);
 }



  return (
    <div className="wrapper flex justify-between h-14 p-1 w-full bg-slate-900" onClick={handleClick} >
      <div className=" logoWrapper flex w-full ">
        <img src={appLogo} alt="h-max" />
      </div>
      <div className="menuWrapper flex w-10 w-full">
        <img src={burgerMenu} alt="burgerMenu" className="animate-pulse h-full" />
        {
         isShown && (
         <div className="listWrapper flex flex-col absolute w-fit right-0 rounded-l-md z-10 bg-slate-900 text-white overflow-hidden">
         <Link to = "/"><div className=" hover:bg-slate-500 w-full h-full p-3 pr-20">Markets</div> </Link>
         <Link to = "/assets"><div className=" hover:bg-slate-500 w-full h-full p-3 pr-20">Assets</div> </Link>
       </div>)
        }
      </div>
    </div>
  );
}

