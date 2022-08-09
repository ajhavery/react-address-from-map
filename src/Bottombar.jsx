import { useEffect } from 'react';
import Geocode from 'react-geocode';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('en');

const nameItem = {
  id: '1',
  title: 'Contact person / store name',
  type: 'text',
  name: 'name',
};

const contactItems = [
  { id: '2', title: 'Phone', type: 'text', name: 'phone' },
  { id: '3', title: 'Email', type: 'text', name: 'email' },
];

const items = [
  { id: '4', title: 'No. / Lane', type: 'text', name: 'street1' },
  { id: '5', title: 'Street / Market', type: 'text', name: 'street2' },
  { id: '6', title: 'City', type: 'text', name: 'city' },
  { id: '7', title: 'State', type: 'text', name: 'state' },
  { id: '8', title: 'Zip', type: 'text', name: 'zip' },
  { id: '9', title: 'Country', type: 'text', name: 'country' },
];

const locationItems = [
  { id: '10', title: 'Latitude', type: 'text', name: 'lat' },
  { id: '11', title: 'Longitude', type: 'text', name: 'lng' },
];

const Bottombar = ({
  marker,
  setMarker,
  contact,
  setContact,
  location,
  setLocation,
}) => {
  // set address from marker lat lng
  useEffect(() => {
    const setAddress = () => {
      const { lat, lng } = marker;
      Geocode.fromLatLng(lat, lng).then(
        (response) => {
          // console.log('address', response.results[0]);
          const address_full = response.results[0].address_components;
          const length = address_full.length;
          const street2length = length - 4;
          // street 2 concatenates the rest of the address components
          const street2 = address_full
            .slice(2, street2length)
            .map((item) => item.long_name)
            .join(', ');

          setLocation({
            street1: `${address_full[0].long_name}, ${address_full[1].long_name}`,
            street2: street2,
            city: address_full[length - 4].long_name,
            state: address_full[length - 3].long_name,
            zip: address_full[length - 1].long_name,
            country: address_full[length - 2].long_name,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    };
    setAddress();
  }, [marker, setLocation]);

  // console.log('marker', marker);

  return (
    <div className='border p-4 shadow w-full space-y-4'>
      <div className='flex flex-col space-y-4'>
        <div className='grid grid-cols-4 items-center gap-2'>
          <label className='text-sm font-semibold' htmlFor={nameItem.name}>
            {nameItem.title}
          </label>

          <input
            className='w-full border text-sm px-2 py-1 col-span-3'
            type={nameItem.type}
            id={nameItem.name}
            value={contact[nameItem.name]}
            onChange={(e) =>
              setContact({ ...contact, [nameItem.name]: e.target.value })
            }
          />
        </div>
        <div className='grid grid-cols-2 items-center gap-4'>
          {contactItems.map((item) => (
            <div className='grid grid-cols-2 gap-2' key={item.id}>
              <label className='text-sm font-semibold' htmlFor={item.name}>
                {item.title}
              </label>
              <input
                className='w-full border text-sm px-2 py-1'
                type={item.type}
                id={item.name}
                value={contact[item.name]}
                onChange={(e) =>
                  setContact({ ...contact, [item.name]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 items-center gap-4'>
          {items.map((item) => (
            <div className='grid grid-cols-2 gap-2' key={item.id}>
              <label className='text-sm font-semibold' htmlFor={item.name}>
                {item.title}
              </label>
              <input
                className='w-full border text-sm px-2 py-1'
                type={item.type}
                id={item.name}
                value={location[item.name] || ''}
                onChange={(e) =>
                  setLocation({ ...location, [item.name]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <div className='grid grid-cols-2 items-center gap-4'>
          {locationItems.map((item) => (
            <div className='grid grid-cols-2 items-center gap-2' key={item.id}>
              <label className='text-sm font-semibold' htmlFor={item.name}>
                {item.title}
              </label>
              <input
                className='w-full border text-sm px-2 py-1'
                type={item.type}
                id={item.name}
                value={marker[item.name] || ''}
                onChange={(e) =>
                  setMarker({ ...marker, [item.name]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
