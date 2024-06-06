import React from "react";
import { NavLink } from "react-router-dom";
const Features = () => {
  return (
    <div>
      <NavLink to="/covid">Go to Covid</NavLink>
      <br />
      <NavLink to="/deathchloropeth">Go to Chloropeth death map</NavLink>
      <br />
      <NavLink to="/datavisuals">Go to Data Visuals</NavLink>
      <br />
      <NavLink to="/IndiaGDP"> Go to India GDP </NavLink>
      <br />
    </div>
  );
};

export default Features;
