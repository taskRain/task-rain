let coordLat = undefined;
let coordLong = undefined;


function startMap(mapID, taskLocation, drag) {
  //Initialize the map
  const map = new google.maps.Map(document.getElementById(mapID), {
    zoom: 10,
    center: taskLocation
  });

  let latDomEl = document.getElementById("lat");
  let lngDomEl = document.getElementById("lng");

  const taskLocationMarker = new google.maps.Marker({
    position: {
      lat: taskLocation.lat,
      lng: taskLocation.lng
    },
    map: map,
    draggable: drag,
    title: "task-marker"
  });

  taskLocationMarker.addListener("dragend", function () {
    latDomEl.setAttribute("value", `${taskLocationMarker.getPosition().lat()}`);
    lngDomEl.setAttribute("value", `${taskLocationMarker.getPosition().lng()}`);
    coordLat = `${taskLocationMarker.getPosition().lat()}`;
    coordLong = `${taskLocationMarker.getPosition().lng()}`;
  })


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function() {
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
      },
      function() {
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    console.log("Browser does not support geolocation.");
  }
}