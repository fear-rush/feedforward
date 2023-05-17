import React from "react";
import Image from "next/image";
import MapContainer from "./MapContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const FoodDetailView = ({
  images,
  giver,
  dateAdded,
  takenBeforeDate,
  foodName,
  foodDescription,
  pickupAddress,
  addressDescription,
  latitude,
  longitude,
}) => {
  //extract to lib folder
  const unixDateToStringFormat = (unixdate) => {
    const unixDateToLongString = new Date(unixdate * 1000);
    return unixDateToLongString.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // extract to lib folder
  function getTimeAgo(unixTimestamp) {
    // nmulitiplied by 1000 because javascript by default use milliseconds instead of seconds in unix time
    unixTimestamp = unixTimestamp * 1000;
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;
    const millisecondsPerWeek = 7 * millisecondsPerDay;
    const millisecondsPerMonth = 30 * millisecondsPerDay;
  
    const currentTime = Date.now();
    const timestampDifference = currentTime - unixTimestamp;
  
    if (timestampDifference < millisecondsPerMinute) {
      return 'Just now';
    } else if (timestampDifference < millisecondsPerHour) {
      const minutes = Math.floor(timestampDifference / millisecondsPerMinute);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (timestampDifference < millisecondsPerDay) {
      const hours = Math.floor(timestampDifference / millisecondsPerHour);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (timestampDifference < millisecondsPerWeek) {
      const days = Math.floor(timestampDifference / millisecondsPerDay);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (timestampDifference < millisecondsPerMonth) {
      const weeks = Math.floor(timestampDifference / millisecondsPerWeek);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else {
      const months = Math.floor(timestampDifference / millisecondsPerMonth);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
  }

  const shimmerBlurDataURL = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#f1f2f3;display:block;z-index:1;position:relative" width="300" height="300" preserveAspectRatio="xMidYMid" viewBox="0 0 300 300">
  <g transform="translate(150,150) scale(1,1) translate(-150,-150)"><linearGradient id="ldbk-qs03tb1hqma" x1="-0.1" y1="0" x2="1.1" y2="1">
    <animate attributeName="y2" repeatCount="indefinite" dur="4s" keyTimes="0;0.5;1" values="-1;1;-1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" calcMode="spline"></animate>
    <stop stop-color="#d4d4d4" offset="0"></stop>
    <stop stop-color="#cacaca" offset="1"></stop>
  </linearGradient>
  <rect x="0" y="0" width="300" height="300" fill="url(#ldbk-qs03tb1hqma)"></rect></g>
  </svg>`;

  console.log(longitude);

  return (
    <div className="grid grid-cols-1 justify-items-center rounded-lg shadow-cardshadow max-w-5xl bg-white">
      <div className="relative w-[350px] h-[350px] overflow-hidden">
        <Image
          src={images}
          alt="Donated Food Image"
          className="rounded-lg"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${window.btoa(
            shimmerBlurDataURL
          )}`}
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <div className="px-6 pb-10 min-w-full">
        <h1 className="font-bold text-3xl mt-6 mb-4">{foodName}</h1>
        <p className="font-extralight">{foodDescription}</p>
        <div className="flex flex-col justify-evenly items-center my-4 border-2 border-gray-200 rounded-lg">
          <div className="flex flex-1 flex-col justify-center items-center p-2">
            <p className="font-medium">{giver}</p>
            <p className="font-extralight">{`Shared ${getTimeAgo(dateAdded.seconds)}`}</p>
          </div>
          <div className="border-[1px] border-gray-200 min-w-full"></div>
          <div className="flex flex-1 flex-col justify-center items-center p-2">
            <p className="font-medium">Best Before</p>
            <p className="font-extralight">
              {unixDateToStringFormat(takenBeforeDate.seconds)}
            </p>
          </div>
        </div>
        <p className="font-medium mb-3">Pickup Location</p>
        <MapContainer latitude={latitude} longitude={longitude} />
        <p className="font-extralight my-3">{pickupAddress}</p>
        <div className="flex gap-3 justify-center items-center p-2 bg-blue-100 rounded-lg text-gray-900 cursor-pointer">
          <a href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noopener">Open in Google Maps</a>
          <FontAwesomeIcon icon={faMapLocationDot} size="xl"/>
        </div>
        {addressDescription ? (
          <>
            <p className="font-medium mt-3 mb-1">Address Details</p>
            <p className="font-extralight">{addressDescription}</p>
          </>
        ) : null}
      </div>
      <div>
        <button></button>

      </div>
    </div>
  );
};

export default FoodDetailView;
