import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import "../App.css";
// import "./style.css"
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

Chart.register(...registerables);

const StateGDP = () => {
  const { stateName } = useParams();
  const [map, setMap] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [gdpData, setGdpData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const pieChartRef = useRef(null);
  const pieChartInstanceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boundary = await import(
          `../data/boundary_files/${stateName}.json`
        );
        const gdpData = await import(`../data/gdp/${stateName}_gdp.json`);

        const parsedGdpData = parseGdpData(gdpData.default);
        const parsedSectorData = gdpData.default.state_gdp_contributions;

        setStateData(boundary.default);
        setGdpData(parsedGdpData);
        console.log(parsedGdpData);
        setSectorData(parsedSectorData);

        const years = Object.keys(parsedSectorData);
        if (years.length > 0 && !selectedYear) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error loading state boundary data:", error);
      }
    };
    function parseGdpData(data) {
      console.log(data.records);
      console.log(selectedYear);
      const districtIncome = {};
      var x = 8;
      if (selectedYear === "overall") {
        x = 6;
      }
      if (selectedYear == "2019-2020") {
        x = 3;
      }
      if (selectedYear == "2021-2022") {
        x = 4;
      }
      if (selectedYear == "2020-2021") {
        x = 5;
      }
      for (const record of data.records) {
        districtIncome[record[2]] = record[x];
      }
      return districtIncome;
    }

    fetchData();
  }, [stateName, selectedYear]);

  useEffect(() => {
    if (stateData && !map) {
      const mapInstance = L.map("stateMap", {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapInstance
      );

      setMap(mapInstance);
    }
  }, [stateData, map]);
  useEffect(() => {
    if (map && stateData && gdpData) {
      console.log(gdpData);
      var legend = L.control({ position: "bottomleft" });

      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Gdp (per annum)</h4>";

        const maxGdp = Math.max(
          ...Object.values(gdpData).map((value) =>
            parseInt(String(value).replace(/,/g, ""))
          )
        );
        const minGdp = Math.min(
          ...Object.values(gdpData).map((value) =>
            parseInt(String(value).replace(/,/g, ""))
          )
        );

        const colorRamp = ["#4CAF50", "#FFEB3B", "#FF5722", "#b21326"];
        const rangeSize = (maxGdp - minGdp) / colorRamp.length;

        for (let i = 0; i < colorRamp.length; i++) {
          let rangeStart = minGdp + i * rangeSize;
          let rangeEnd = minGdp + (i + 1) * rangeSize;
          let unitStart = "L";
          let unitEnd = "L";
          let color = colorRamp[i];

          if (rangeStart <= 99999) {
            rangeStart = (rangeStart / 10000).toFixed(2);
            unitStart = "T";
          } else {
            rangeStart = (rangeStart / 100000).toFixed(2); // Convert to lakhs and set precision to 2 decimal places
          }

          rangeEnd = (rangeEnd / 100000).toFixed(2);

          div.innerHTML += `<i style="background: ${color}"></i><span>${rangeStart}${unitStart} - ${rangeEnd}${unitEnd}</span><br>`;
        }

        return div;
      };

      const existingLegend = document.querySelector(".legend");
      if (existingLegend) {
        existingLegend.remove();
      }

      legend.addTo(map);
    }
  }, [gdpData, map, stateData]);

  useEffect(() => {
    if (map && stateData && gdpData) {
      console.log(gdpData);

      const getColor = (income) => {
        if (!income) return "#cccccc";

        const maxGdp = Math.max(
          ...Object.values(gdpData).map((value) =>
            parseInt(value.replace(/,/g, ""))
          )
        );
        const minGdp = Math.min(
          ...Object.values(gdpData).map((value) =>
            parseInt(value.replace(/,/g, ""))
          )
        );
        income = parseInt(income.replace(/,/g, ""));
        const colorRamp = ["#4CAF50", "#FFEB3B", "#FF5722", "#b21326"];
        const normalized = (income - minGdp) / (maxGdp - minGdp);

        // Map normalized value to a color in the color ramp
        const colorIndex = Math.floor(normalized * (colorRamp.length - 1));
        return colorRamp[colorIndex];
      };

      console.log(gdpData);
      console.log("hihii");

      const geoJSONLayer = L.geoJSON(stateData, {
        style: (feature) => {
          const districtName = feature.properties.DISTRICT_N;
          const districtIncomeValue = gdpData[districtName];

          return {
            color: getColor(districtIncomeValue),
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7,
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on("mouseover", () => {
            const districtName = feature.properties.DISTRICT_N;
            const incomeValue = gdpData[districtName];

            layer
              .bindPopup(`District: ${districtName} - Income: ${incomeValue}`)
              .openPopup();
          });

          layer.on("mouseout", () => {
            layer.closePopup();
          });
        },
      });

      // Clear the existing layers
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      geoJSONLayer.addTo(map);

      map.fitBounds(geoJSONLayer.getBounds());
    }
  }, [map, stateData, gdpData, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    if (event.target.value !== "overall") {
      renderPieChart(event.target.value);
    }
  };

  const renderPieChart = (year) => {
    const primarySectors = [
      "Agriculture",
      "Forestry",
      "Fishing",
      "Ag & Allied",
    ];
    const secondarySectors = [
      "Mining",
      "Manufacturing",
      "Construction",
      "Electricity,gas and Water supply",
      "Industry",
    ];
    const tertiarySectors = [
      "Transport",
      "Trade,hotels and restaurants",
      "Banking",
      "Real estate",
      "Public Administration",
      "Other Services",
    ];
    const yearData = sectorData[year];
    const primarySectorTotal = primarySectors.reduce(
      (total, sector) => total + parseFloat(yearData[sector] || 0),
      0
    );
    const secondarySectorTotal = secondarySectors.reduce(
      (total, sector) => total + parseFloat(yearData[sector] || 0),
      0
    );
    const tertiarySectorTotal = tertiarySectors.reduce(
      (total, sector) => total + parseFloat(yearData[sector] || 0),
      0
    );
    const totalGdp =
      primarySectorTotal + secondarySectorTotal + tertiarySectorTotal;

    const primarySectorPercentage = (primarySectorTotal / totalGdp) * 100;
    const secondarySectorPercentage = (secondarySectorTotal / totalGdp) * 100;
    const tertiarySectorPercentage = (tertiarySectorTotal / totalGdp) * 100;

    const primarySectorData = primarySectors.map((sector) => ({
      sector,
      value: parseFloat(yearData[sector] || 0),
      percentage:
        (parseFloat(yearData[sector] || 0) / primarySectorTotal) * 100,
    }));

    const secondarySectorData = secondarySectors.map((sector) => ({
      sector,
      value: parseFloat(yearData[sector] || 0),
      percentage:
        (parseFloat(yearData[sector] || 0) / secondarySectorTotal) * 100,
    }));

    const tertiarySectorData = tertiarySectors.map((sector) => ({
      sector,
      value: parseFloat(yearData[sector] || 0),
      percentage:
        (parseFloat(yearData[sector] || 0) / tertiarySectorTotal) * 100,
    }));

    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
    }

    const ctx = pieChartRef.current.getContext("2d");

    pieChartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Primary Sector", "Secondary Sector", "Tertiary Sector"],
        datasets: [
          {
            data: [
              primarySectorPercentage,
              secondarySectorPercentage,
              tertiarySectorPercentage,
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
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              return `${value.toFixed(2)}%)`;
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed !== null) {
                  label += context.parsed.toFixed(2) + "%";
                }
                return label;
              },
            },
          },
        },

        animation: {
          duration: 1000,
          easing: "easeOutBounce",
        },
        onHover: function (e, elements) {
          if (elements.length) {
            e.native.target.style.cursor = "pointer";
          } else {
            e.native.target.style.cursor = "default";
          }
        },
        onClick: (e, elements) => {
          if (elements.length) {
            const index = elements[0].index;
            const sector = elements[0].element.$context.raw;
            let details = "";
            let sector_name = "";

            if (index === 0) {
              sector_name = "Primary Sector";
              details = primarySectorData.map(
                (data) =>
                  `${data.sector}: ${data.value} (${data.percentage.toFixed(
                    2
                  )}%)`
              );
            } else if (index === 1) {
              sector_name = "Secondary Sector";
              details = secondarySectorData.map(
                (data) =>
                  `${data.sector}: ${data.value} (${data.percentage.toFixed(
                    2
                  )}%)`
              );
            } else if (index === 2) {
              sector_name = "Tertiary Sector";
              details = tertiarySectorData.map(
                (data) =>
                  `${data.sector}: ${data.value} (${data.percentage.toFixed(
                    2
                  )}%)`
              );
            }

            document.getElementById("sectorDetails").innerHTML =
              details.join("<br>");
            document.getElementById("sector_name").innerHTML = sector_name;
          }
        },

        hoverOffset: 40,
      },
    });
  };
  useEffect(() => {
    const sectorDetails = document.getElementById("sectorDetails");
    if (sectorDetails) {
      sectorDetails.innerHTML = "";
    }
    const sectorName = document.getElementById("sector_name");
    if (sectorName) {
      sectorName.innerHTML = "";
    }

    if (selectedYear !== "overall" && sectorData) {
      renderPieChart(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear === "overall" && chartRef.current && sectorData) {
      const ctx = chartRef.current.getContext("2d");
      const overallData = sectorData.overall.map((data) => ({
        year: data.year,
        gdp: data.gdp_in_billion_usd,
        perCapita: data.per_capita_usd,
        growthRate: data.growth_rate,
      }));

      const labels = overallData.map((data) => data.year);
      const gdpData = overallData.map((data) => data.gdp);
      const perCapitaData = overallData.map((data) => data.perCapita);
      const growthRateData = overallData.map((data) => data.growthRate);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "GDP in Billion USD",
              data: gdpData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Per Capita USD",
              data: perCapitaData,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
            {
              label: "Growth Rate",
              data: growthRateData,
              type: "line",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 3,
              fill: false,
              yAxisID: "growthRateAxis",
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              formatter: (value) => value.toFixed(2),
            },
          },
          onClick: function (event, elements) {
            if (elements.length > 0) {
              const clickedElementIndex = elements[0].index;
              console.log("Clicked on:", clickedElementIndex);
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "GDP and Per Capita (in billion USD)",
              },
            },
            growthRateAxis: {
              position: "right",
              title: {
                display: true,
                text: "Growth Rate (%)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
    }
  }, [selectedYear, sectorData]);

  return (
    <div className="container1">
      <div id="stateMap" className="map"></div>
      <div className="stateBox">
        <div className="header-section">
          <h1 style={{ fontSize: "35px", fontWeight: "bold" }}>
            {stateName} GDP Analysis
          </h1>
          <p>
            <button
              className="backButton"
              onClick={() => navigate("/IndiaGDP")}>
              Back
            </button>
          </p>
        </div>
        <hr />
        <br />
        {sectorData && (
          <>
            <div className="controls">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="year-dropdown">
                {Object.keys(sectorData).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {selectedYear !== "overall" ? (
              <> 
                <p className="flex justify-center" style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Sector-wise Contribution of GDP
                </p>
                <p className="flex justify-center" style={{ fontSize: "15px", fontWeight: "bold" }}>
                  (In the year {selectedYear})
                </p>
                <br />
                <div className="flex justify-center items-center chart-container w-1/2 h-1/2 md:w-1/2 md:h-1/2">
                  <canvas ref={pieChartRef} className="w-1/2 h-1/2"></canvas>
                </div>

                <div id="sector_name" className="text-lg font-bold"></div>
                <div id="sectorDetails" className="mb-4"></div>
                {/* {sectorData &&
                  selectedYear &&
                  renderSectorData(sectorData, selectedYear)} */}
              </>
            ) : (
              <>
                <br />
                <p className="flex justify-center font-bold">
                  Analysis of GDP and Growth rate in the years 2019-2022
                </p>
                <br />

                <canvas ref={chartRef} width="400" height="200"></canvas>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StateGDP;
