console.log("confirm view");

let id = document.getElementById("hidden-input").value;

console.log(id);

document.getElementById("confirmButton").onclick = function(event) {
  event.preventDefault;
  console.log("buttonOn");
  axios.put("/ok", id);
}
