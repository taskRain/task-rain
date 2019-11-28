console.log("confirm view");

let id = document.getElementById("hidden-input").value;

console.log(id);

document.getElementById("confirmButton").onclick = function(event) {
  event && event.preventDefault();
  console.log("buttonOn");
  axios({
    method: 'put',
    url: "ok",
    data: {
      _id: `${id}`,
    },
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  }).then(() => {
    window.location = "/tasks";
  })
  .catch(error => {
    window.location = "/tasks";
  });
}
