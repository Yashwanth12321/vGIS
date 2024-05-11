import React, { useEffect } from "react";
import L from "leaflet";
import data from "../data/boundary_files/in.json"; // Import the JSON data for state boundaries
import "leaflet/dist/leaflet.css";
import "../App.css";
import covidData from "../data/covid_data/state_wise.json"; // Import the JSON data for COVID-19 statistics

const IndiaMap = () => {
  useEffect(() => {
    const mapContainer = L.map("map", { minZoom: 4 }).setView([24.6, 85.75], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapContainer);

    const stateName = document.getElementById("state-name");
    const covidDataContainer = document.getElementById("covid-data");

    async function loadGeoJSON() {
      console.log("Data:", data);

      const stateLayer = L.geoJson(data, {
        style: function (feature) {
          // Calculate color based on death count (if data is available)
          if (covidData) {
            const deaths =
              covidData.find((state) => state.State === feature.properties.name)
                ?.Deaths || 0; // Handle missing data
            // console.log("Deaths:", deaths);
            return { color: getColor(deaths), weight: 2, fillOpacity: 0.5 };
          } else {
            // Return default style if COVID-19 data is not yet loaded
            return { color: "#cccccc", weight: 2, fillOpacity: 0.5 };
          }
        },
        onEachFeature: function (feature, layer) {
          let popupContent = `<b>${feature.properties.name}</b><br>`;

          // Handle missing COVID-19 data in popup
          const deaths =
            covidData?.find((state) => state.State === feature.properties.name)
              ?.Deaths || 0;
          popupContent += `Deaths: ${deaths}`;

          const popup = L.popup({
            closeButton: false,
            offset: L.point(0, -20),
          }).setContent(popupContent);

          layer.on({
            mouseover: function (e) {
              stateName.textContent = feature.properties.name;
              stateName.style.display = "block";
              layer.setStyle({ weight: 3 }); // Highlight on hover
              popup.setLatLng(e.latlng);
              popup.openOn(mapContainer);
            },
            mouseout: function (e) {
              stateName.textContent = "";
              stateName.style.display = "none";
              layer.setStyle({ weight: 2 }); // Revert to normal weight
              popup.removeFrom(mapContainer);
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

// Define a function to map death counts to color shades
// Define a function to map death counts to color shades
function getColor(deaths) {
  if (!covidData) {
    console.warn("COVID-19 data not yet available for color mapping.");
    return "#FF0000"; // Return default color if data hasn't been fetched
  }

  const maxDeaths = Math.max(...covidData.map((state) => state.Deaths));
  // Find maximum death count
  const minDeaths = Math.min(...covidData.map((state) => state.Deaths));
  console.log(minDeaths + "  " + maxDeaths); // Find minimum death count
  const colorRange = "#e5e5ff";
  // const colorRamp = [
  //   "#e5e5ff",
  //   "#ccccff",
  //   "#b2b2ff",
  //   "#9999ff",
  //   "#7f7fff",
  //   "#6666ff",
  //   "#4c4cff",
  //   "#3232ff",
  //   "#0000ff",
  //   "#0000cc",
  //   "#000099",
  //   "#00007f",
  //   "#00004c",
  // ]; // Shades of blue
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
  const normalized = (deaths - minDeaths) / (maxDeaths - minDeaths);

  // Map normalized value to a color in the color ramp
  const colorIndex = Math.floor(normalized * (colorRamp.length - 1));
  return colorRamp[colorIndex];
}

export default IndiaMap;
