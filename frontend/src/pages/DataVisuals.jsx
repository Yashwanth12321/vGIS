// src/IndiaMap.js
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import "../App.css";
import data from "./TS_District_Boundary_33.json"; // Import the JSON data
import covidData from "./gdp.json"; // Import the COVID-19 data

const DataVisuals = () => {
  const [clickedDistrict, setClickedDistrict] = useState(null);
  const [remainingData, setRemainingData] = useState(null);

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
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Range Wise Colors</h4>";

      const maxgdp = Math.max(
        ...covidData.records.map((state) =>
          parseInt(state[3].replace(/,/g, ""))
        )
      );
      const mingdp = Math.min(
        ...covidData.records.map((state) =>
          parseInt(state[3].replace(/,/g, ""))
        )
      );
      const rangeSize = (maxgdp - mingdp) / 10;

      for (let i = 0; i < 10; i++) {
        let rangeStart = mingdp + i * rangeSize;
        let rangeEnd = mingdp + (i + 1) * rangeSize;
        let unitStart = "L";
        let unitEnd = "L";
        let color = getColor(rangeStart);

        if (rangeStart <= 99999) {
          rangeStart = rangeStart / 10000;
          unitStart = "T";
        } else {
          rangeStart = (rangeStart / 100000).toFixed(2); // Convert to lakhs and set precision to 2 decimal places
        }

        rangeEnd = (rangeEnd / 100000).toFixed(2);

        div.innerHTML += `<i style="background: ${color}"></i><span>${rangeStart}${unitStart} - ${rangeEnd}${unitEnd}</span><br>`;
      }

      return div;
    };

    legend.addTo(mapContainer);

    async function loadGeoJSON() {
      console.log("Data:", data); // Log the imported data
      L.geoJson(data, {
        style: function (feature) {
          if (covidData) {
            // Handle missing data
            const gdp =
              covidData?.records
                ?.find((state) => state[2] === feature.properties.DISTRICT_N)
                ?.[3]
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
              // stateName.textContent = feature.properties.DISTRICT_N;
              // stateName.style.display = "block";
              layer.setStyle({ weight: 3 });
              popup.setLatLng(e.latlng);
              popup.openOn(mapContainer);
            },
            mouseout: function (e) {
              stateName.textContent = " ";
              // stateName.style.display = "none";
              layer.setStyle({ weight: 2, fillOpacity: 0.5 });
              popup.removeFrom(mapContainer);
            },
            click: async function (e) {
              const stateName = feature.properties.DISTRICT_N;
              // covidDataContainer.textContent = "Loading...";
              // console.log("State Name:", stateName);
              
              setClickedDistrict(stateName);

              let matchingDistrictData = null;
              for (const record of covidData.records) {
                if (record[2] === feature.properties.DISTRICT_N) {
                  matchingDistrictData = record;
                  break;
                }
              }

              setRemainingData(matchingDistrictData);

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
    <div className="container">
      {/* <div className="map-container">
      </div> */}
      <div id="map"></div>
      <div id="state-name"></div>
      <div id="covid-data"></div>
      <div className="sidebar" style={{ backgroundColor: "gray" }}>
        <h1>District Data</h1>
        <hr />
        {clickedDistrict
          ? `${clickedDistrict} District`
          : "Click on a district to view data"
        }
        {remainingData ? (
            <>
              <p>Name: {remainingData[2]}</p>
              <p>State Number: {remainingData[0]}</p>
              <p>GDP: {remainingData[3]}</p>
              <p>4: {remainingData[4] || 'Not Available'}</p>
              <p>5: {remainingData[5] || 'Not Available'}</p>
              <p>6: {remainingData[6] || 'Not Available'}</p>
              <p>7: {remainingData[7] || 'Not Available'}</p>
            </>
          ) : ( 
                <p>Data not available</p>
              )
        }
      </div>
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
    ...covidData.records.map((state) =>
      parseInt(state[3].replace(/,/g, ""))
    )
  );
  // Find maximum death count
  const mingdp = Math.min(
    ...covidData.records.map((state) =>
      parseInt(state[3].replace(/,/g, ""))
    )
  );
  console.log(maxgdp + "  " + mingdp); // Find minimum death count

  const colorRamp = [
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#F44336",
    "#E57373",
    "#EF5350",
  ];

  // Normalize death count for color mapping
  const normalized = (deaths - mingdp) / (maxgdp - mingdp);

  // Map normalized value to a color in the color ramp
  const colorIndex = Math.floor(normalized * (colorRamp.length - 1));
  return colorRamp[colorIndex];
}



export default DataVisuals;
