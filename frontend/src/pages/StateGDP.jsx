import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import "../App.css";

Chart.register(...registerables);

const StateGDP = () => {
    const { stateName } = useParams();
    const [map, setMap] = useState(null);
    const [stateData, setStateData] = useState(null);
    const [gdpData, setGdpData] = useState(null); // State for parsed GDP data
    const [sectorData, setSectorData] = useState(null); // State for sector data
    const [selectedYear, setSelectedYear] = useState(''); // State for selected year
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // Ref to store chart instance
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boundary = await import(`../data/boundary_files/${stateName}.json`);
                const gdpData = await import(`../data/gdp/${stateName}_gdp.json`);

                // Parse the GDP data (replace with your actual parsing logic)
                const parsedGdpData = parseGdpData(gdpData.default);
                const parsedSectorData = gdpData.default.state_gdp_contributions;

                setStateData(boundary.default);
                setGdpData(parsedGdpData);
                setSectorData(parsedSectorData);

                // Set default selected year as the first available year
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

    // Function to parse the GDP data (replace with your logic based on data structure)
    function parseGdpData(data) {
        const districtIncome = {};
        for (const record of data.records) {
            districtIncome[record[2]] = record[3];
        }
        return districtIncome;
    }

    useEffect(() => {
        if (stateData && !map) {
            const map = L.map('stateMap', {
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                dragging: false,
                boxZoom: false,
                keyboard: false,
                tap: false,
                touchZoom: false,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const getColor = (income) => {
                if (!income) return '#cccccc'; // Return a default color if income is undefined

                let value = parseFloat(income.replace(/,/g, ""));

                if (value > 120000) {
                    return '#ffff00'; // High income
                } else if (value > 30000) {
                    return '#ffff00'; // Medium income
                } else {
                    return '#ff0000'; // Low income
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
                    // Display district name and income on hover
                    layer.on('mouseover', () => {
                        const districtName = feature.properties.DISTRICT_N;
                        const incomeValue = gdpData[districtName];
                        layer.bindPopup(`District: ${districtName} - Income: ${incomeValue}`).openPopup();
                    });

                    // Remove popup on mouseout
                    layer.on('mouseout', () => {
                        layer.closePopup();
                    });
                },
            });

            geoJSONLayer.addTo(map);

            map.fitBounds(geoJSONLayer.getBounds());

            setMap(map);
        }
    }, [stateData, map, gdpData]);

    // Function to render sector data
    const renderSectorData = (data, year) => {
        const primarySectors = ["Agriculture", "Forestry", "Fishing", "Ag & Allied"];
        const secondarySectors = ["Mining", "Manufacturing", "Construction", "Electricity,gas and Water supply", "Industry"];
        const tertiarySectors = ["Transport", "Trade,hotels and restaurants", "Banking", "Real estate", "Public Administration", "Other Services"];

        const yearData = data[year];

        return (
            <div key={year} className="year-section">
                <h3>{year}</h3>
                <div>
                    <h4 className="font-bold">Primary Sector</h4>
                    <ul>
                        {primarySectors.map(sector => (
                            <li key={sector}>{sector}: {yearData[sector]}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold">Secondary Sector</h4>
                    <ul>
                        {secondarySectors.map(sector => (
                            <li key={sector}>{sector}: {yearData[sector]}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold">Tertiary Sector</h4>
                    <ul>
                        {tertiarySectors.map(sector => (
                            <li key={sector}>{sector}: {yearData[sector]}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        if (selectedYear === 'overall' && chartRef.current && sectorData) {
            const ctx = chartRef.current.getContext('2d');
            const overallData = sectorData.overall.map(data => ({
                year: data.year,
                gdp: data.gdp_in_billion_usd,
                perCapita: data.per_capita_usd,
                growthRate: data.growth_rate
            }));

            const labels = overallData.map(data => data.year);
            const gdpData = overallData.map(data => data.gdp);
            const perCapitaData = overallData.map(data => data.perCapita);
            const growthRateData = overallData.map(data => data.growthRate);

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'GDP in Billion USD',
                            data: gdpData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Per Capita USD',
                            data: perCapitaData,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Growth Rate',
                            data: growthRateData,
                            type: 'line',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 3,
                            fill: false,
                            yAxisID: 'growthRateAxis'
                        }
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
                            title: {
                                display: true,
                                text: 'GDP and Per Capita (in billion USD)'
                            }
                        },
                        'growthRateAxis': {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Growth Rate (%)'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    },
                },
            });
        }
    }, [selectedYear, sectorData]);

    return (
        <div className='container1'>
            <div id="stateMap" className='map'></div>
            <div className='stateBox'>
                <div className='header-section'>
                    <h1>{stateName} GDP</h1>
                    <p><button className='backButton' onClick={() => navigate('/IndiaGDP')}>Back</button></p>
                </div>
                <br />
                <hr />
                {sectorData && (
                    <>
                        <div className="controls">
                            <select value={selectedYear} onChange={handleYearChange} className="year-dropdown">
                                {Object.keys(sectorData).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            {selectedYear !== 'overall' && (
                                <button className="chartButton">PieChart</button>
                            )}
                        </div>
                        {selectedYear !== 'overall' ? (
                            renderSectorData(sectorData, selectedYear)
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
