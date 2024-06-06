import React from "react";
import { NavLink } from "react-router-dom";

const Features = () => {
  return (
    <div className="flex justify-around my-20">
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md text-center w-64">
        <NavLink to="/classic" className="block py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-red-600 hover:text-black">
          Classic Map
        </NavLink>
        <br />
        <h2 className="text-black">Click on the above button to explore the classical map</h2>
      </div>
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md text-center w-64">
        <NavLink to="/threeD" className="block py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-red-600 hover:text-black">
          3D Maps
        </NavLink>
        <br />
        <h2 className="text-black">Click on above button to explore the 3D Map Visual</h2>
      </div>
    </div>
  );
};

export default Features;
