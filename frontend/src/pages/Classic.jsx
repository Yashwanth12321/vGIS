import { useEffect } from "react";

const FreeView = () => {
  useEffect(() => {
    // eslint-disable-next-line no-undef, no-unused-vars
    const map = new mappls.Map("map", {
      center: [28.61, 77.23],
      zoom: 12,
      location: true,

      zoomControl: true,
    });
    map.addListener("load", function () {
      var optional_config = {
        location: [28.61, 77.23],
        region: "IND",
        height: 300,
      };
      new mappls.search(
        document.getElementById("auto"),
        optional_config,
        callback
      );
      function callback(data) {
        console.log(data);
        if (data) {
          var dt = data[0];
          if (!dt) return false;
          var eloc = dt.eLoc;
          var place = dt.placeName + ", " + dt.placeAddress;
          /*Use elocMarker Plugin to add marker*/
          var marker; // Declare the marker variable
          if (marker) marker.remove();
          mappls.pinMarker(
            {
              map: map,
              pin: eloc,
              popupHtml: place,
              popupOptions: {
                openPopup: true,
              },
            },
            function (data) {
              marker = data;
              marker.fitbounds();
            }
          );
        }
      }
    });

    // map.addListener("load", function () {
    //   var pts = [
    //     {
    //       lat: 28.55108,
    //       lng: 77.26913,
    //     },
    //     {
    //       lat: 28.55106,
    //       lng: 77.26906,
    //     },
    //     {
    //       lat: 28.55105,
    //       lng: 77.26897,
    //     },
    //     {
    //       lat: 28.55101,
    //       lng: 77.26872,
    //     },
    //     {
    //       lat: 28.55099,
    //       lng: 77.26849,
    //     },
    //     {
    //       lat: 28.55097,
    //       lng: 77.26831,
    //     },
    //     {
    //       lat: 28.55093,
    //       lng: 77.26794,
    //     },
    //     {
    //       lat: 28.55089,
    //       lng: 77.2676,
    //     },
    //     {
    //       lat: 28.55123,
    //       lng: 77.26756,
    //     },
    //     {
    //       lat: 28.55145,
    //       lng: 77.26758,
    //     },
    //     {
    //       lat: 28.55168,
    //       lng: 77.26758,
    //     },
    //     {
    //       lat: 28.55175,
    //       lng: 77.26759,
    //     },
    //     {
    //       lat: 28.55177,
    //       lng: 77.26755,
    //     },
    //     {
    //       lat: 28.55179,
    //       lng: 77.26753,
    //     },
    //   ];
    //   polyline = new mappls.Polyline({
    //     map: map,
    //     paths: pts,
    //     strokeColor: "#333",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 5,
    //     fitbounds: true,
    //   });
    // });
    // var window = new mappls.InfoWindow({
    //   map: map,
    //   content: "<div style='color: black; '>MapmyIndia</div>",

    //   position: { lat: 28.61, lng: 77.23 },
    //   fitbounds: true,
    // });
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <input
        type="text"
        id="auto"
        name="auto"
        className="search-outer form-control as-input"
        placeholder="Search places or eLoc's..."
        required=""
        spellCheck="false"
      />
    </>
  );
};

export default FreeView;
