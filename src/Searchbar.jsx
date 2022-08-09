import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { MdMyLocation } from 'react-icons/md';

const Searchbar = ({ panTo, setMarker }) => {
  const {
    ready, // ready: ready to use the Places Autocomplete service
    value, // value: the value of the input typed by user
    setValue, // setValue: set the value of the input
    suggestions: { status, data }, // suggestions: the suggestions returned by the Places Autocomplete service
    clearSuggestions, // clearSuggestions: clear the suggestions returned by the Places Autocomplete service
  } = usePlacesAutocomplete({
    requestOptions: {
      // prefer locations near below lat/long while searching
      location: { lat: () => 28.7041, lng: () => 77.1025 },
      radius: 200 * 1000, // 200km around preferred location
    },
  });

  const searchRef = useOnclickOutside(() => {
    // When user clicks outside of the component, call it to clear and reset the suggestions data
    clearSuggestions();
  });

  return (
    <div className='absolute top-0 left-0 w-full z-20 p-4'>
      <div className='flex items-center justify-between'>
        {/* locate me button on left */}
        <button
          className='bg-white border rounded flex items-center gap-2 px-4 py-2 text-gray-600 shadow-md'
          // navigator.geoLocation takes user's location from the browser
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setMarker({
                  lat: latitude,
                  lng: longitude,
                });
                panTo({ lat: latitude, lng: longitude });
              },
              (error) => console.log(error)
            );
          }}
        >
          <MdMyLocation className='text-rose-600 text-lg' />
          <div>Locate my store</div>
        </button>
        {/* search bar on right */}
        <div
          className='relative min-w-[24rem] shadow-md border'
          ref={searchRef}
        >
          {/* input box to take search input */}
          {/* value, setValue and ready states are from usePlacesAutocomplete hook */}
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={!ready}
            placeholder='Search my store'
            className='bg-white px-4 py-2 focus:outline-none focus:border-gray-500 w-full'
          />
          {/* if suggestions status = 'OK' then show suggestions else show nothing */}
          {status === 'OK' && data.length > 0 && (
            <ul className='absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2'>
              {data.map((suggestion, index) => {
                // each suggestion is an object with 'description' and 'placeId' properties
                // description: the text of the suggestion
                const {
                  description,
                  structured_formatting: { main_text, secondary_text },
                } = suggestion;

                return (
                  <li
                    key={index}
                    onClick={async () => {
                      setValue(description, false);
                      // converts address to lat long using geocoding API
                      const results = await getGeocode({
                        address: description,
                      });
                      // console.log('address', results[0]);
                      const { lat, lng } = getLatLng(results[0]);
                      setMarker({ lat, lng });
                      panTo({ lat, lng }); // focussed on lat long
                      clearSuggestions(); // clear suggestions to remove dropdown
                    }}
                    className=' cursor-pointer px-4 py-2 hover:bg-gray-100'
                  >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
