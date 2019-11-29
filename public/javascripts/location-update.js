console.log("location update");

let locationId = document.getElementById("locationId").value;
let taskId = document.getElementById("taskId").value;

document.getElementById("updateButton").onclick = function(event) {
  event && event.preventDefault();
  axios({
    method: "post",
    url: '/tasks/location',
    data: {
      id: locationId,
      lat: coordLat,
      lng: coordLong,
    },
    config: { headers: { "Content-Type": "multipart/form-data" } }
  })
    .then(() => {
      window.location.pathname = `tasks/detail/${taskId}`;
    })
    .catch(err => {
      console.log(err);
    });
};
