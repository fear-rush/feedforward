import { useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

import { UserLocation } from "../../context/LocationContext";

const MapContainer = ({ latitude, longitude }) => {
  const { memoizedUserLocation: userLocation } = UserLocation();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "1rem",
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const onLoad = useCallback((map) => {
    map.setZoom(14);
    map.setCenter(center);
    map.setOptions({
      mapTypeID: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      streetViewControl: false,
      zoomControl: true,
    });
  }, []);

  // add loader and error handle
  // check user location is allowed or not
  return isLoaded ? (
    <GoogleMap mapContainerStyle={mapContainerStyle} onLoad={onLoad}>
      <MarkerF position={center} />
      <MarkerF
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
        }}
        position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
      />
      <h1>Loading...</h1>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapContainer;
