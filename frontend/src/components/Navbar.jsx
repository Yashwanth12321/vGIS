import { NavLink } from "react-router-dom";

const Navbar = () => {
  const getNavLinkClass = ({ isActive }) => 
    isActive ? "w-20 h-10 rounded-lg flex items-center justify-center font-bold shadow-md text-blue-500" 
             : "w-20 h-10 rounded-lg flex items-center justify-center font-bold shadow-md text-white";

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginLeft: "0px", background: "black", marginRight: "auto" }}>
      <NavLink to="/" className={getNavLinkClass} style={{ marginRight: "25px", background: "black" }} activeClassName="active">
        HOME
      </NavLink>
      {/* <NavLink to="/freeView" className={getNavLinkClass} style={{ marginRight: "25px", background: "black" }} activeClassName="active">
        FreeView
      </NavLink> */}
      <NavLink to="/features" className={getNavLinkClass} style={{ background: "black" }} activeClassName="active">
        Features
      </NavLink>
    </div>
  );
};

export default Navbar;
