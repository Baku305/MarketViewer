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
  <div
    className="wrapper flex justify-between h-14 w-full bg-slate-900"
    onClick={handleClick}
  >
    <div className=" logoWrapper flex w-full ">
      <img src={appLogo} alt="h-max" className="p-1" />
      <div className="listWrapper flex flex-row w-fit bg-slate-900 text-white">
          <Link to="/">
            <div className=" hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center">Markets</div>{" "}
          </Link>
          <Link to="/assets">
            <div className=" hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center">Base Assets</div>{" "}
          </Link>
        </div>
    </div>
  </div>
);
}

