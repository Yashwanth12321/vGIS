import React from "react";
import Covid from "./Covid";
import { NavLink } from "react-router-dom";
const Features = () => {
  return (
    <div>
      <NavLink to="/covid">Go to Covid</NavLink>
    </div>
  );
};

export default Features;
