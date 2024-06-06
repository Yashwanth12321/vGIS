// src/IndiaMap.js
import React, { useEffect } from "react";
import L from "leaflet";
import data from "../data/boundary_files/in.json"; // Import the JSON data
import covidData from "../data/covid_data/state_wise.json"; // Import the COVID-19 data
import "leaflet/dist/leaflet.css";
import "../App.css";

const covid = () => {
  useEffect(() => {
    const mapContainer = L.map("map", { minZoom: 4 }).setView([24.6, 85.75], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapContainer);
    const stateName = document.getElementById("state-name");
    const covidDataContainer = document.getElementById("covid-data");

    async function loadGeoJSON() {
      console.log("Data:", data); // Log the imported data
      const stateLayer = L.geoJson(data, {
        style: function (feature) {
          return {
            color: "#0000ff",
            weight: 2,
            fillOpacity: 0.2,
          };
        },
        onEachFeature: function (feature, layer) {
          const popupContent = `<b>${feature.properties.name}</b>`;

          const popup = L.popup({
            closeButton: false,
            offset: L.point(0, -20),
          }).setContent(popupContent);

          layer.on({
            mouseover: function (e) {
              stateName.textContent = feature.properties.name;
              stateName.style.display = "block";
              layer.setStyle({ color: "black" });
              popup.setLatLng(e.latlng);
              popup.openOn(mapContainer);
            },
            mouseout: function (e) {
              stateName.textContent = "";
              stateName.style.display = "none";
              layer.setStyle({ color: "#0000ff" });
              popup.removeFrom(mapContainer);
            },
            click: async function (e) {
              const stateName = feature.properties.name;
              covidDataContainer.textContent = "Loading...";

              let covidInfo = null;
              for (const state of covidData) {
                if (state.State === stateName) {
                  covidInfo = state;
                  break;
                }
              }

              let popupContent = `<b>${stateName}</b><br>`;

              if (covidInfo) {
                for (const key in covidInfo) {
                  if (key !== "State") {
                    popupContent += `${key}: ${covidInfo[key]}<br>`;
                  }
                }
              } else {
                popupContent += "No COVID-19 data available for this state.";
              }

              const popup = L.popup({
                closeButton: false,
                offset: L.point(0, -20),
              }).setContent(popupContent);

              popup.setLatLng(e.latlng);
              popup.openOn(mapContainer);
            },
          });
        },
      }).addTo(mapContainer);
    }

    loadGeoJSON();

    return () => {
      mapContainer.remove();
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div>
      <h1 className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        Chloropeth map
      </h1>
      <div id="map"></div>
      <div id="state-name"></div>
      <div id="covid-data"></div>
    </div>
  );
};

export default covid;
