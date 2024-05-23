import { NavLink } from "react-router-dom";

const Navbar = () => {
  const getNavLinkClass = ({ isActive }) => 
    isActive ? "w-20 h-10 rounded-lg bg-white flex items-center justify-center font-bold shadow-md text-blue" 
             : "w-20 h-10 rounded-lg bg-white flex items-center justify-center font-bold shadow-md text-black";

  return (
    <header className="header bg-black text-white flex items-center space-x-4 p-4">
      <NavLink to="/" className={getNavLinkClass}>
        HOME
      </NavLink>
      <NavLink to="/freeView" className={getNavLinkClass}>
        FreeView
      </NavLink>
      <NavLink to="/features" className={getNavLinkClass}>
        Features
      </NavLink>
    </header>
  );
};

export default Navbar;
