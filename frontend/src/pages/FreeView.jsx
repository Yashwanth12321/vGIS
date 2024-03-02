import { useEffect } from "react";

const FreeView = () => {
  useEffect(() => {
    const map = new mappls.Map("map", { center: [28.61, 77.23], zoom: 12 });

    const onMapClick = (event) => {
      const { lat, lng } = event.latLng;

      // Reverse geocode to get address information
      mappls.reverseGeocode({ lat, lng }, onReverseGeocodeResponse);
    };

    const onReverseGeocodeResponse = (response) => {
      const { results } = response;

      if (results.length > 0) {
        const address = results[0].formatted_address;

        // Log the address to the console (you can display it as needed)
        console.log("Clicked Location:", {
          address,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        });
      }
    };

    // Add click event listener to the map
    map.addListener("click", onMapClick);

    // Cleanup function
  }, []); // Empty dependency array to run the effect only once

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default FreeView;
