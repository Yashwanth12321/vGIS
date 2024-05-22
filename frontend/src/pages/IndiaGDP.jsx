import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from "../data/boundary_files/in.json";
import "leaflet/dist/leaflet.css";
import "../App.css";

const IndiaGDP = () => {
    const [map, setMap] = useState(null);
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

    return (
        <div className='container1'>
            <div id="map" className="map" style={{height: '100vh', width: '90vh'}}></div>
            <div className='dataBox'>
                <h1>India GDP</h1>
                <p>Click on a state to view its GDP</p>
            </div>
        </div>
    );
}

export default IndiaGDP;
