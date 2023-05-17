import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

export const LocationContextProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    let unmounted = false;
    // callback on success navigator.geolocation.getCurrentPosition
    const getLocationSuccess = (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };
    // callback on error navigator.geolocation.getCurrentPosition
    const getLocationError = () => {
      alert("Unable to retrieve your location");
    };
    // add timeout when user have slow internet access
    if (!navigator.geolocation) {
      // add error handler on geolocation not supported by browser
      alert("Geolocation is not supported by your browser");
    } else {
      if (unmounted) return;
      // add loader to wait get current position
      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    }
    return () => {
      unmounted = true;
    };
  });

  return (
    <LocationContext.Provider value={{ userLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const UserLocation = () => {
  return useContext(LocationContext);
};
