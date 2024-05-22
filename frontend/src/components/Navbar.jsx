/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header bg-black text-white">
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md">
        <p className="blue-gradient_text">YN</p>
      </NavLink>
      <nav className="flex text-lg gap-7 font-medium text-white ">
        <NavLink
          to="/freeView"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-white"
          }>
          free view
        </NavLink>
        <NavLink
          to="/features"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-white"
          }>
          Features
        </NavLink>
        {/* <NavLink to="/projects"  className={(props)=>props.isActive? "text-blue-500":"text-black"} >Projects</NavLink> */}
      </nav>
    </header>
  );
};

export default Navbar;
