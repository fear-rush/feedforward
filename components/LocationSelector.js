import React, { useState, Fragment } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function LocationSelector({
  position,
  setPosition,
  isMapModalOpen,
  setIsMapModalOpen,
  setValue,
}) {
  const [error, setError] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = (event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handlePickLocation = async () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK") {
        setValue('pickupAddress', results[0].formatted_address);
        console.log(`address ini ${results[0].formatted_address}`);
        setIsMapModalOpen(false);
      } else {
        setAddress(null);
      }
    });
  };

  const handleFindCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };


  // add loader
  if (!isLoaded) {
    return <div>Loading</div>;
  }

  return (
    <>
      <button
        className="px-4 py-2 rounded-md bg-blue-500 text-white"
        onClick={() => setIsMapModalOpen(true)}
        type="button"
      >
        <FontAwesomeIcon icon={faLocationDot} />
      </button>
      <Transition show={isMapModalOpen} as={Fragment}>
        <Dialog
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsMapModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block min-w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="relative">
                  {error && <div className="text-red-500">{error}</div>}
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={position}
                    zoom={position ? 15 : 1}
                    onClick={handleMapClick}
                  >
                    <MarkerF position={position} />
                  </GoogleMap>
                  <div className="absolute bottom-6 right-16 flex flex-col jutify-center items-center gap-2">
                    {position && (
                      <button
                        className="p-2 w-[120px] rounded-md bg-blue-500 text-white text-xs font-semibold"
                        onClick={handlePickLocation}
                      >
                        Pick Location
                      </button>
                    )}
                    <button
                      className="p-2 w-[120px] rounded-md bg-blue-500 text-white text-xs font-semibold"
                      onClick={handleFindCurrentLocation}
                    >
                      Find My Location
                    </button>
                    <button
                      className="p-2 w-[120px] rounded-md bg-red-500 text-white text-xs font-semibold"
                      onClick={() => setIsMapModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default LocationSelector;
