/* eslint-disable */

// Whatever we put into a data attribute like data-locations,
// it wii be stored into the dataset property.
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFuZHNvbWVsYWkiLCJhIjoiY2xndm1xeDkwMDU4dDNpcHMyMXJpN2NuMSJ9.AWrVxY4fCExR20Q7uhyy4w';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/handsomelai/clgvwg5ft003901qz7qv4hlum',
  scrollZoom: false,
  // canter: [-118.113491, 34.111745],
  // zoom: 5,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current locations
  bounds.extend(loc.coordinates);
});

// The function who executes the moving and the zooming
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
