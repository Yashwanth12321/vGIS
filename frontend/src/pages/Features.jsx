import React from "react";
import { NavLink } from "react-router-dom";
import "./Features.css";
import covid from "../assets/images/covid.jpg";
import death from "../assets/images/chloropeth.jpg";
import gdp from "../assets/images/gdp.jpg";
import datavisuals from "../assets/images/visual.jpg";

const Features = () => {
  return (
    <div className="features-container">
      <div className="card">
        <a href="/covid" className="card-link">
          <img src={covid} alt="Covid" className="card-image" />
          <div className="card-content flex flex-col justify-center items-center">
            <h2>Covid Cases Analysis</h2>
            <p>Information and updates on Covid</p>
          </div>
        </a>
      </div>

      <div className="card">
        <a href="/deathchloropeth" className="card-link">
          <img src={death} alt="Chloropeth" className="card-image" />
          <div className="card-content flex flex-col justify-center items-center">
            <h2>Covid Deaths Analysis</h2>
            <p>Information and updates on Chloropeth</p>
          </div>
        </a>
      </div>
      
      <div className="card">
        <a href="/datavisuals" className="card-link">
          <img src={datavisuals} alt="Data Visuals" className="card-image" />
          <div className="card-content flex flex-col justify-center items-center">
            <h2>Telangana State GDP Analysis</h2>
            <p>Information and updates on Data Visuals</p>
          </div>
        </a>
      </div>

      <div className="card">
        <a href="/IndiaGDP" className="card-link">
          <img src={gdp} alt="GDP" className="card-image" />
          <div className="card-content flex flex-col justify-center items-center">
            <h2>India GDP Analysis</h2>
            <p>State And Districts Wise Analysis</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Features;
