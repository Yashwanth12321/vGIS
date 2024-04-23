// src/IndiaMap.js
import React, { useEffect } from "react";
import L from "leaflet";
import data from "./TS_District_Boundary_33.json"; // Import the JSON data
import covidData from "./gdp.json"; // Import the COVID-19 data
import "leaflet/dist/leaflet.css";
import "../App.css";
const covid = () => {
  useEffect(() => {
    const mapContainer = L.map("map", { minZoom: 8 }).setView(
      [17.0944, 79.775],
      5
    );
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
          if (covidData) {
            // Handle missing data
            const gdp =
              covidData?.records
                ?.find(
                  (state) => state[2] === feature.properties.DISTRICT_N
                )?.[3]
                ?.replace(/,/g, "") || 0;

            console.log("Deaths:", gdp);
            const style = covidData
              ? { color: getColor(gdp), weight: 2, fillOpacity: 0.5 }
              : { color: "#cccccc", weight: 2, fillOpacity: 0.5 };
            return style;
          }
        },
        onEachFeature: function (feature, layer) {
          const popupContent = `<b>${feature.properties.DISTRICT_N}</b>`;

          const popup = L.popup({
            closeButton: false,
            offset: L.point(0, -20),
          }).setContent(popupContent);

          layer.on({
            mouseover: function (e) {
              stateName.textContent = feature.properties.DISTRICT_N;
              stateName.style.display = "block";
              layer.setStyle({ weight: 3 });
              popup.setLatLng(e.latlng);
              popup.openOn(mapContainer);
            },
            mouseout: function (e) {
              stateName.textContent = "";
              stateName.style.display = "none";
              layer.setStyle({ weight: 2, fillOpacity: 0.5 });
              popup.removeFrom(mapContainer);
            },
            click: async function (e) {
              const stateName = feature.properties.DISTRICT_N;
              covidDataContainer.textContent = "Loading...";
              console.log("State Name:", stateName);

              let matchingDistrictData = null;
              for (const record of covidData.records) {
                if (record[2] === feature.properties.DISTRICT_N) {
                  matchingDistrictData = record;
                  break;
                }
              }

              let popupContent = `<b>${stateName}</b><br>`;

              if (matchingDistrictData) {
                // Display income data for the matching district
                for (const key in matchingDistrictData) {
                  // Exclude "District Name"
                  popupContent += `${key}: ${matchingDistrictData[key]}<br>`;
                }
              } else {
                popupContent += "No income data available for this district.";
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

function getColor(deaths) {
  console.log("hii", deaths); // Log the death count
  if (deaths == 0) {
    return "white";
  }
  if (!covidData) {
    console.warn("COVID-19 data not yet available for color mapping.");
    return "#FF0000"; // Return default color if data hasn't been fetched
  }

  const maxgdp = Math.max(
    ...covidData.records.map((state) => parseInt(state[3].replace(/,/g, "")))
  );
  // Find maximum death count
  const mingdp = Math.min(
    ...covidData.records.map((state) => parseInt(state[3].replace(/,/g, "")))
  );
  console.log(maxgdp + "  " + mingdp); // Find minimum death count

  const colorRamp = [
    "#90EE90",
    "#32CD32",
    "#228B22",
    "#006400",
    "#808000",
    "#FFA500",
    "#FF8C00",
    "#FF4500",
    "#FF0000",
    "#B22222",
    "#8B0000",
  ];
  // Normalize death count for color mapping
  const normalized = (deaths - mingdp) / (maxgdp - mingdp);

  // Map normalized value to a color in the color ramp
  const colorIndex = Math.floor(normalized * (colorRamp.length - 1));
  return colorRamp[colorIndex];
}

export default covid;
