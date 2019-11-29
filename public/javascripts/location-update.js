console.log("location update");

let locationId = document.getElementById("locationId").value;

document.getElementById("updateButton").onclick = function(event) {
  event && event.preventDefault();
  axios({
    method: "put",
    url: '/tasks/location',
    data: {
      id: locationId,
      lat: coordLat,
      lng: coordLong
      
    },
    config: { headers: { "Content-Type": "multipart/form-data" } }
  })
    .then(() => {
      console.log(`El valor de locationId es ${locationId}`)
      window.location = 'tasks/';
      console.log('updated');
    })
    .catch(err => {
      console.log(err);
    });
};
