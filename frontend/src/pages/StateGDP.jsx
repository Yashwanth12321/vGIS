import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../App.css";

const StateGDP = () => {
    const { stateName } = useParams();
    const [map, setMap] = useState(null);
    const [stateData, setStateData] = useState(null);
    const [gdpData, setGdpData] = useState(null); // State for parsed GDP data
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boundary = await import(`../data/boundary_files/${stateName}.json`);
                const gdpData = await import(`../data/gdp/${stateName}_gdp.json`); // Assuming separate GDP data file

                // Parse the GDP data (replace with your actual parsing logic)
                const parsedGdpData = parseGdpData(gdpData.default);

                setStateData(boundary.default);
                setGdpData(parsedGdpData);
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
                // Define a color scale based on income values (replace with your logic)
                if (income > 50000) {
                    return '#00ff00'; // High income
                } else if (income > 30000) {
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

    return (
        <div className='container1'>
            <div id="stateMap" className='map' style={{ height: '100vh', width: '90vh' }}></div>
            <div className='stateBox'>
                <h1>{stateName} GDP</h1>
                <p><button className='backButton' onClick={() => navigate('/IndiaGDP')}>Back</button></p>
            </div>
        </div>
    );
};

export default StateGDP;
