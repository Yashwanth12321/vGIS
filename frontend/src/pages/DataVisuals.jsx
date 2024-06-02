// src/IndiaMap.js
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import "../App.css";
import data from "../data/boundary_files/Telangana.json"; // Import the JSON data
import covidData from "../data/gdp/Telangana_gdp.json"; // Import the COVID-19 data
import Chart from "chart.js/auto";

const DataVisuals = () => {
  const [clickedDistrict, setClickedDistrict] = useState(null);
  const [remainingData, setRemainingData] = useState(null);
  const values1 = covidData.records.map((rec) =>
    parseFloat(rec[3].replace(/,/g, ""))
  );
  const values2 = covidData.records.map((rec) =>
    parseFloat(rec[4].replace(/,/g, ""))
  );
  const values3 = covidData.records.map((rec) =>
    parseFloat(rec[5].replace(/,/g, ""))
  );

  values1.sort((a, b) => b - a);
  values2.sort((a, b) => b - a);

  values3.sort((a, b) => b - a);

  const rankedDistricts1 = values1.map((value, index) => {
    const record = covidData.records.find(
      (rec) => parseFloat(rec[3].replace(/,/g, "")) === value
    );
    return { index: index + 1, name: record[2] };
  });
  const rankedDistricts2 = values2.map((value, index) => {
    const record = covidData.records.find(
      (rec) => parseFloat(rec[4].replace(/,/g, "")) === value
    );
    return { index: index + 1, name: record[2] };
  });
  const rankedDistricts3 = values3.map((value, index) => {
    const record = covidData.records.find(
      (rec) => parseFloat(rec[5].replace(/,/g, "")) === value
    );
    return { index: index + 1, name: record[2] };
  });
  function findDistrictRank1(districtName) {
    const district = rankedDistricts1.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (district) {
      return `The rank of ${district.name} is ${district.index}`;
    } else {
      return `${districtName} not found in the data.`;
    }
  }
  function findDistrictRank2(districtName) {
    const district = rankedDistricts2.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (district) {
      return `The rank of ${district.name} is ${district.index}`;
    } else {
      return `${districtName} not found in the data.`;
    }
  }
  function findDistrictRank3(districtName) {
    const district = rankedDistricts3.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (district) {
      return `The rank of ${district.name} is ${district.index}`;
    } else {
      return `${districtName} not found in the data.`;
    }
  }

  useEffect(() => {
    const mapContainer = L.map("map").setView(
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
      div.innerHTML += "<h4>Gdp(per annum)</h4>";

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

  useEffect(() => {
    if (remainingData) {
      // Create or update bar chart when remainingData changes
      const ctx = document.getElementById("barChart");
      if (ctx) {
        // If the canvas element exists, update the existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
          existingChart.destroy(); // Destroy the existing chart instance
        }
        console.log(
          "bro" + parseInt(remainingData[5]?.replace(/,/g, "") || "0")
        );

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["2018-19", "2019-20", "2020-21"],
            datasets: [
              {
                label: "District Data",
                data: [
                  parseInt(remainingData[3]?.replace(/,/g, "") || "0"),
                  parseInt(remainingData[4]?.replace(/,/g, "") || "0"),
                  parseInt(remainingData[5]?.replace(/,/g, "") || "0"),
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            onClick: function (event, elements) {
              if (elements.length > 0) {
                const clickedElementIndex = elements[0].index;
                console.log("Clicked on:", clickedElementIndex);
              }
            },

            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    } else {
      // Clear the chart if remainingData is not available
      const ctx = document.getElementById("barChart");
      if (ctx) {
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
          existingChart.destroy(); // Destroy the existing chart instance
        }
      }
    }
  }, [remainingData]);

  return (
    <div className="container">
      <div className="map-container"></div>
      <div id="map"></div>
      <div id="state-name"></div>
      <div id="covid-data"></div>
      <div className="sidebar" style={{ backgroundColor: "black" }}>
        <h1>District Data Analysis</h1>
        <hr />
        {clickedDistrict
          ? `${clickedDistrict} District`
          : "Click on a district to view data"}
        {remainingData ? (
          <>
            <p>Name: {remainingData[2]}</p>
            {/* <p>State Number: {remainingData[0]}</p>
            <p>GDP(2018-2019): {remainingData[3]}</p>
            <p>GDP(2019-20120): {remainingData[4] || "Not Available"}</p>
            <p>GDP(2020-2021) :{remainingData[5] || "Not Available"}</p>
            <p>6: {remainingData[6] || "Not Available"}</p>
            <p>7: {remainingData[7] || "Not Available"}</p> */}
          </>
        ) : (
          <p>Data not available</p>
        )}

        <canvas id="barChart" width="500" height="400"></canvas>
        <div className="results">
          {remainingData ? (
            <>
              <h2>Results</h2>
              <p>
                {remainingData[2]} has a GDP of{" "}
                {remainingData[3] || "Not Available"} in 2018-2019.
              </p>
              <p>
                {remainingData[2]} has a GDP of{" "}
                {remainingData[4] || "Not Available"} in 2019-2020.
              </p>
              <p>
                {remainingData[2]} has a GDP of{" "}
                {remainingData[5] || "Not Available"} in 2020-2021.
              </p>
            </>
          ) : null}
          <br />
          <div className="ranking">
            <h2>Rankings</h2>
            <p>
              {remainingData
                ? findDistrictRank1(remainingData[2])
                : "Not Available"}{" "}
              in 2018-2019.
            </p>
            <p>
              {remainingData
                ? findDistrictRank2(remainingData[2])
                : "Not Available"}{" "}
              in 2019-2020.
            </p>
            <p>
              {remainingData
                ? findDistrictRank3(remainingData[2])
                : "Not Available"}{" "}
              in 2020-2021.
            </p>
            {/* <p>State: {remainingData ? remainingData[2] : "Not Available"}</p> */}
            {/* <p>
              GDP: {remainingData ? remainingData[3] : "Not Available"} in
              2018-2019.
            </p> */}
          </div>
        </div>
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
    ...covidData.records.map((state) => parseInt(state[3].replace(/,/g, "")))
  );
  // Find maximum death count
  const mingdp = Math.min(
    ...covidData.records.map((state) => parseInt(state[3].replace(/,/g, "")))
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
