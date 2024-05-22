import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../App.css";

const StateGDP = () => {
    const { stateName } = useParams();
    const [map, setMap] = useState(null);
    const [stateData, setStateData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await import(`../data/boundary_files/${stateName}.json`);
                setStateData(data.default);
            }
            catch (error) {
                console.error("Error loading state boundary data:", error);
            }
        };

        fetchData();
    }, [stateName]);

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
                touchZoom: false
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const geoJSONLayer = L.geoJSON(stateData, {
                style: () => ({
                    color: '#002379',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.3
                })
            });
            geoJSONLayer.addTo(map);

            map.fitBounds(geoJSONLayer.getBounds());

            setMap(map);
        }
    }, [stateData, map]);

    return (
        <div className='container1'>
            <div id="stateMap" className='map' style={{ height: '100vh', width: '90vh' }}></div>
            <div className='dataBox'>
                <div className='vals'>
                    <h1>{stateName} GDP </h1>
                    <p><button className='backButton' onClick={() => navigate('/IndiaGDP')}>Back</button></p>
                </div>
                <p>Click on District to see its GDP contribution</p>
            </div>
        </div>
    );
};

export default StateGDP;
