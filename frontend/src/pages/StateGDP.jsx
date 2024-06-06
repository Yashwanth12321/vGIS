import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import "../App.css";
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
        setSectorData(parsedSectorData);

        const years = Object.keys(parsedSectorData);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error loading state boundary data:", error);
      }
    };

    fetchData();
  }, [stateName]);

  function parseGdpData(data) {
    const districtIncome = {};
    for (const record of data.records) {
      districtIncome[record[2]] = record[3];
    }
    return districtIncome;
  }

  useEffect(() => {
    if (stateData && !map) {
      const map = L.map("stateMap", {
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
        map
      );

      const getColor = (income) => {
        if (!income) return "#cccccc";

        let value = parseFloat(income.replace(/,/g, ""));

        if (value > 120000) {
          return "#ffff00";
        } else if (value > 30000) {
          return "#ffff00";
        } else {
          return "#ff0000";
        }
      };

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

      geoJSONLayer.addTo(map);

      map.fitBounds(geoJSONLayer.getBounds());

      setMap(map);
    }
  }, [stateData, map, gdpData]);

  const renderSectorData = (data, year) => {
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

    const yearData = data[year];

    return (
      <div key={year} className="year-section">
        <h3>{year}</h3>
        <div>
          <h4 className="font-bold">Primary Sector</h4>
          <ul>
            {primarySectors.map((sector) => (
              <li key={sector}>
                {sector}: {yearData[sector]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Secondary Sector</h4>
          <ul>
            {secondarySectors.map((sector) => (
              <li key={sector}>
                {sector}: {yearData[sector]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Tertiary Sector</h4>
          <ul>
            {tertiarySectors.map((sector) => (
              <li key={sector}>
                {sector}: {yearData[sector]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

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
          <h1
            style={{ fontSize: "24px", fontWeight: "bold" }}
            className="text-2xl font-bold"
          >
            {stateName} GDP
          </h1>
          <p>
            <button
              className="backButton"
              onClick={() => navigate("/IndiaGDP")}
            >
              Back
            </button>
          </p>
        </div>
        <br />
        <hr />
        {sectorData && (
          <>
            <div className="controls">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="year-dropdown"
              >
                {Object.keys(sectorData).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {selectedYear !== "overall" ? (
              <>
                <div
                  className="chart-container mb-4"
                  style={{
                    position: "relative",
                    height: "40vh",
                    width: "40vw",
                  }}
                >
                  <canvas ref={pieChartRef}></canvas>
                </div>
                <div id="sector_name" className="text-lg font-bold"></div>

                <div id="sectorDetails" className="mb-4"></div>
                {/* {sectorData &&
                  selectedYear &&
                  renderSectorData(sectorData, selectedYear)} */}
              </>
            ) : (
              <canvas ref={chartRef} width="400" height="200"></canvas>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StateGDP;
