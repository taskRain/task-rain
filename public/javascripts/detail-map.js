

// function startMap(mapID, taskLocation, drag) {
//   //Initialize the map
//   const map = new google.maps.Map(document.getElementById(mapID), {
//     zoom: 17,
//     center: taskLocation
//   });

//   // Add a marker for Ironhack Barcelona
//   const taskLocationMarker = new google.maps.Marker({
//     position: {
//       lat: taskLocation.lat,
//       lng: taskLocation.lng
//     },
//     map: map,
//     draggable: drag,
//     title: "Barcelona Campus"
//   });


//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       function() {
//         const user_location = {
//           lat: window.mapCoordinates.lat,
//           lng: window.mapCoordinates.lng
//         };

//         // Center map with user location
//         map.setCenter(user_location);

//         // Add a marker for your user location
//         const taskLocationMarker = new google.maps.Marker({
//           position: {
//             lat: window.mapCoordinates.lat,
//             lng: window.mapCoordinates.lng
//           },
//           map: map,
//           title: "You are here."
//         });
//       },
//       function() {
//         console.log("Error in the geolocation service.");
//       }
//     );
//   } else {
//     console.log("Browser does not support geolocation.");
//   }
// }


// function showPlace(theMap, lat, lng, name, type) {
//   var iconBase = '../../images/';
//   let latDomEl = document.getElementById("lat");
//   let lngDomEl = document.getElementById("lng");

//   let marker = new google.maps.Marker({
//     position: { lat: lat, lng: lng },
//     map: theMap,
//     title: name,
//     animation: google.maps.Animation.DROP,
//     draggable: true,
//     icon: iconBase + "icon_coffee.png"
//   }
//   );

//   marker.addListener("dragend", function () {
//     latDomEl.setAttribute("value", `${marker.getPosition().lat()}`);
//     lngDomEl.setAttribute("value", `${marker.getPosition().lng()}`);
//   })

// }





function startMap(mapID, taskLocation, drag) {
  //Initialize the map
  const map = new google.maps.Map(document.getElementById(mapID), {
    zoom: 17,
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