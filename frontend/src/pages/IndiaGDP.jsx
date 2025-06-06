import { Chart, registerables } from 'chart.js';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import data from "../data/boundary_files/in.json";

Chart.register(...registerables);

const IndiaGDP = () => {
    const [map, setMap] = useState(null);
    const chartRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!map) {
            const map = L.map('map', {
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                dragging: false,
                boxZoom: false,
                keyboard: false,
                tap: false,
                touchZoom: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const defaultStyle = {
                color: '#002379',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.3
            };

            const hoverStyle = {
                color: '#ff7800',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
            };

            const geoJSONLayer = L.geoJSON(data, {
                style: () => defaultStyle,
                onEachFeature: (feature, layer) => {
                    // Display state name on hover
                    layer.on('mouseover', () => {
                        layer.setStyle(hoverStyle);
                        layer.bindPopup(feature.properties.name).openPopup();
                    });

                    // Remove popup on mouseout
                    layer.on('mouseout', () => {
                        layer.setStyle(defaultStyle);
                        layer.closePopup();
                    });

                    // Zoom in on state on click and navigate to new page
                    layer.on('click', () => {
                        map.fitBounds(layer.getBounds());
                        navigate(`/state/${feature.properties.name}`);
                    });
                }
            });
            geoJSONLayer.addTo(map);

            map.fitBounds(geoJSONLayer.getBounds());

            setMap(map);
        }
    }, [map, navigate]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chartData = {
                labels: ["2019-20", "2020-21", "2021-22"],
                datasets: [
                    {
                        label: 'GDP (in billion USD)',
                        data: [2835.60, 2671.59, 3150.30],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Per Capita USD',
                        data: [2050.16, 1913.21, 2238.12],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Growth Rate',
                        data: [3.87, -5.83, 9.05],
                        type: 'line',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 2,
                        fill: false,
                        yAxisID: 'growthRateAxis'
                    }
                ]
            };
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        datalabels: {
                            display: false
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
                    }
                }
            });
        }
    }, []);

    return (
        <div className='container1'>
            <div id="map" className="map" style={{height: '100vh', width: '90vh'}}></div>
            <div className='indiaBox'>
                <h1>India GDP</h1>
                <p>(Click on a state to view its GDP)</p>
                <br />
                <hr />
                <br />
                <div className='flex justify-center items-center'>
                    <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Bar Chart Analysis of India GDP in 2019-22
                    </h1>
                </div>
                <br />
                <canvas ref={chartRef} width="400" height="200"></canvas>
                <br />
                <div className='flex flex-col'>
                    <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>The Top 3 states are (in $Billion)</h1>
                    <p>417.2 - Maharastra</p>
                    <p>278 - Tamil Nadu</p>
                    <p>265.4 - Gujarat</p>
                    <br />
                    <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>The Least 3 states are (in $Billion)</h1>
                    <p>4.3 - Nagaland</p>
                    <p>3.7 - Mizoram</p>
                    <p>1.5 - Andaman</p>
                </div>
            </div>
        </div>
    );
}

export default IndiaGDP;