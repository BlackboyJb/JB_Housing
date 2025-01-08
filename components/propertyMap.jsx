"use client";
import { useEffect, useState } from "react";

// Define the PropertyMap component
const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewPort, setViewPort] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geoCodeError, setGeoCodeError] = useState(false);

  // Setting the API key for HERE API
  const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;

  // Fetch the coordinates for the given address
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const address = `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`;

        // Construct the geocoding API URL with the HERE API
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          address
        )}&apiKey=${HERE_API_KEY}`;

        // Fetch the data from the HERE Geocoding API
        const res = await fetch(url);
        const data = await res.json();

        // Check if the response contains results
        if (data.items.length === 0) {
          setGeoCodeError(true);
          return;
        }

        // Extract latitude and longitude from the first result
        const { lat, lng } = data.items[0].position;
        setLat(lat), setLng(lng);
        setViewPort({
          ...viewPort,
          latitude: lat,
          longitude: lng,
        });

        // Optionally, update the map view state with the coordinates
        // setViewPort((prevState) => ({
        //   ...prevState,
        //   latitude: lat,
        //   longitude: lng,
        // }));
      } catch (error) {
        console.error(error);
        setGeoCodeError(true);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchCoordinates function
    fetchCoordinates();
  }, [property]); // Dependency array ensures it runs when the property changes

  if (loading) return <h3>Loading ...</h3>;
  if (geoCodeError)
    return <h3 className="text-xl">Location could not be found</h3>;
  return (
    <div>
      <h1>Property Map</h1>
    </div>
  );
};

export default PropertyMap;
