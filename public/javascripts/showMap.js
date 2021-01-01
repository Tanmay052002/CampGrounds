mapboxgl.accessToken = mapBoxtkn;
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', 
  center: camp.geometry.coordinates, 
  zoom: 9
  });
  map.addControl(new mapboxgl.NavigationControl()); 
  new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:30})
    .setHTML(
      `<h3>${camp.title}</h3><p>${camp.location}</p>`
    )
  )
  .addTo(map);