import {
  React,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

const LocationContext = createContext(null);

export const LocationContextProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    isAllowed: false,
  });

  useEffect(() => {
    let unmounted = false;
    // callback on success navigator.geolocation.getCurrentPosition
    const getLocationSuccess = (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isAllowed: true,
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
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isAllowed: false,
      });
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
  }, []);

  // to memoize userLocation value
  const memoizedUserLocation = useMemo(
    () => ({
      memoizedUserLocation: userLocation,
    }),
    [userLocation.latitude, userLocation.longitude]
  );


  return (
    <LocationContext.Provider value={{ memoizedUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const UserLocation = () => {
  return useContext(LocationContext);
};
