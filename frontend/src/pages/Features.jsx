import React from "react";
import { NavLink } from "react-router-dom";
const Features = () => {
  return (
    <div>
      <NavLink to="/covid">Go to Covid</NavLink>
      <br />
      <NavLink to="/deathchloropeth">Go to Chloropeth death map</NavLink>
    </div>
  );
};

export default Features;
