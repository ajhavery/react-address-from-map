import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import mapStyles from './map-styles';
import Bottombar from './Bottombar';
import Searchbar from './Searchbar';

/**************** MAP VARIABLES *************/

// declare outside to prevent too many re renders
const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 28.6139,
  lng: 77.209,
};
// Find map styles on: https://snazzymaps.com/style/8097/wy
const options = {
  styles: mapStyles,
  disableDefaultUI: true, // to remove default map UI controls
  zoomControl: true, // to add zoom control
};

/**************** MAP CODE STARTS *************/

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Address components
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [location, setLocation] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // marker state
  const [marker, setMarker] = useState();
  // on App load, set marker to center of map
  useEffect(() => {
    setMarker(center);
  }, []);

  // onMapClick will only change if dependencies change
  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  // setting map ref on load
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // pan to the location entered by user
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';
  return (
    <div className='w-full h-screen'>
      <div className='w-[60rem] h-[30rem] mx-auto mt-10 border relative'>
        <Searchbar
          panTo={panTo}
          setMarker={setMarker}
          contact={contact}
          setContact={setContact}
        />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          <Marker
            position={{
              lat: parseFloat(marker.lat),
              lng: parseFloat(marker.lng),
            }}
            icon={{
              url: '/location.png',
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0), // marker appears at the center of the image
              anchor: new window.google.maps.Point(15, 15), // marker appears at the center of the image
            }}
            draggable={true}
            onDragEnd={(e) => {
              setMarker({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
            }}
          />
        </GoogleMap>
        <Bottombar
          marker={marker}
          setMarker={setMarker}
          contact={contact}
          setContact={setContact}
          location={location}
          setLocation={setLocation}
        />
      </div>
    </div>
  );
};

export default App;
