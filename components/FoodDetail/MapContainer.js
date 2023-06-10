import { useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const MapContainer = ({ latitude, longitude }) => {
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

 
  return isLoaded ? (
    <GoogleMap mapContainerStyle={mapContainerStyle} onLoad={onLoad}>
      <MarkerF position={center} />
    </GoogleMap>
  ) : (
    <h1 className="h-full text-center mx-auto">Loading ...</h1>
  );
};

export default MapContainer;
