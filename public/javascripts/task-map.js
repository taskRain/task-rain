// function startMap() {
//   const taskLocation = {
//     // lat: 41.3977381,
//     // lng: 2.190471916
//     lat: window.mapCoordinates.lat,
//     lng: window.mapCoordinates.lng
//   };
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 17,
//     center: taskLocation
//   });
// }

function startMap() {

  // Store Ironhack's coordinates
  const taskLocation = { lat: window.mapCoordinates.lat,  lng: window.mapCoordinates.lng };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById('map'), 
    {
      zoom: 17,
      center: taskLocation
    }
  );

  // Add a marker for Ironhack Barcelona
  const taskLocationMarker = new google.maps.Marker({
    position: {
      lat: taskLocation.lat,
      lng: taskLocation.lng
    },
    map: map,
    title: "Barcelona Campus"
  });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function () {
      const user_location = {
        lat: window.mapCoordinates.lat,
        lng: window.mapCoordinates.lng
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      const taskLocationMarker = new google.maps.Marker({
        position: {
          lat: window.mapCoordinates.lat,
          lng: window.mapCoordinates.lng
        },
        map: map,
        title: "You are here."
      });

    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }
}

axios({
  method: "get",
  url: "location"
  // params: "URL parameters to be sent with the request"
})
  .then(response => {
    startMap();
  })
  .catch(err => {
    console.log(err);
  });
