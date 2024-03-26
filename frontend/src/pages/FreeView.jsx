import React from "react";

import { NavLink } from "react-router-dom";
const Features = () => {
  return (
    <div>
      <NavLink to="/classic">classic Map</NavLink>
      <br />
      <NavLink to="/threeD">3d Maps</NavLink>
    </div>
  );
};

export default Features;
