import {
  React,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const LocationContext = createContext(null);

export const LocationContextProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: undefined,
    longitude: undefined,
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
      // alert("Unable to retrieve your location");
      setUserLocation({
        latitude: undefined,
        longitude: undefined,
        isAllowed: false,
      });
    };
    // add timeout when user have slow internet access
    if (!navigator.geolocation) {
      // add error handler on geolocation not supported by browser
      // alert("Geolocation is not supported by your browser");
      setUserLocation({
        latitude: undefined,
        longitude: undefined,
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

  const getUserLocation = () => new Promise((resolve,reject)=> {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position);
        resolve(position);
      },
      error => {
        // console.log(error.message);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  });


  // to memoize userLocation value
  // turns out when memoized, it won't set to current user location value
  // when user is disable location access and then enable it later
  // const memoizedUserLocation = useMemo(
  //   () => ({
  //     memoizedUserLocation: userLocation,
  //   }),
  //   [userLocation.latitude, userLocation.longitude]
  // );

  return (
    <LocationContext.Provider value={{ userLocation, getUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const UserLocation = () => {
  return useContext(LocationContext);
};
