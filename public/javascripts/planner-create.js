let taskFormGroup = [
  ["name", "#task-name"],
  ["description", "#task-description"],
  ["materials", "#task-materials"],
  ["duration", "#task-duration"],
  ["operator", "#task-operator"]
];

let taskList = document.querySelector(".task-container");
let jobLocationId = "5ddf968a12287222a0efdbcf";
let hackTask = null;

renderTaskList(window.jobId);

function clearForm(formTupla) {
  formTupla.forEach(field => {
    document.querySelector(field[1]).value = "";
  });
}

function autoFillForm(formTupla, payload) {
  formTupla.forEach(field => {
    document.querySelector(field[1]).value = payload[field[0]];
  });
}

function renderTaskList(id) {
  axios({
    method: "get",
    url: `/api/job/${id}`,
    data: "",
    config: { headers: { "Content-Type": "multipart/form-data" } }
  }).then(job => {
    taskList.innerHTML = "";

    job.data[0].tasks.forEach(task => {
      let taskDOMEL = document.createElement("li");
      let updateDOMEL = document.createElement("button");
      let deleteDOMEL = document.createElement("button");
      taskDOMEL.className = "task-btns";
      updateDOMEL.innerText = task.name;
      deleteDOMEL.innerText = "Delete Task";
      updateDOMEL.className = "update-task";
      deleteDOMEL.className = "delete-task";
      updateDOMEL.addEventListener("click", e => {
        e && e.preventDefault();
        hackTask = task._id;
        axios({
          method: "get",
          url: "/planner/task",
          params: {
            id: task._id
          },
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(payload => {
          autoFillForm(taskFormGroup, payload.data);
          document.querySelector(`#task-operator`).value =
            payload.data.operator._id;
          renderTaskList(window.jobId);
        });

        document.querySelector(".task-create").classList.toggle("hide");

        let asideButton = document.querySelector(
          '.task-create input[type="submit"]'
        );

        asideButton.value = `Update Task`;
        asideButton.removeEventListener("click", setCreateTaskBehav);
        asideButton.addEventListener("click", setUpdateTaskBehav);
        });

        deleteDOMEL.addEventListener("click", e => {
        e && e.preventDefault();
        axios({
          method: "delete",
          url: `/planner/delete/task/`,
          data: {
            taskId: task._id,
            jobId: window.jobId
          },
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(() => {
          renderTaskList(window.jobId);
        });
      });
      taskDOMEL.appendChild(updateDOMEL);
      taskDOMEL.appendChild(deleteDOMEL);
      taskList.appendChild(taskDOMEL);
    });
  });
}


document.getElementById("new-task").addEventListener("click", e => {
  e && e.preventDefault();
  clearForm(taskFormGroup);
  document.querySelector(".task-create").classList.toggle("hide");
  let asideButton = document.querySelector('.task-create input[type="submit"]');
  asideButton.value = `Create Task`;
  asideButton.removeEventListener("click", setUpdateTaskBehav);
  asideButton.addEventListener("click",  setCreateTaskBehav);
});

function getButtonBehaviour(behaviour){
  switch (behaviour) {
    case "CREATE_TASK":
      return (e) => {
        e && e.preventDefault();
        document.querySelector(".task-create").classList.toggle("hide");
    
        let payload = { location: jobLocationId, jobId: window.jobId };
    
        taskFormGroup.forEach(field => {
          payload[field[0]] = document.querySelector(field[1]).value;
        });
        axios({
          method: "post",
          url: "/planner/create/task",
          data: payload,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(() => {
          renderTaskList(window.jobId);
        });
      }
    break;
    case "UPDATE_TASK":
      return (e) => {
        e && e.preventDefault();
        document.querySelector(".task-create").classList.toggle("hide");
        let payload = {
          location: jobLocationId,
          jobId: window.jobId,
          taskId: hackTask
        };
        taskFormGroup.forEach(field => {
          payload[field[0]] = document.querySelector(field[1]).value;
        });

        axios({
          method: "put",
          url: "/planner/update/task",
          data: payload,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(() => {
          renderTaskList(window.jobId);
        });
      }
    break;
  }
}

let setCreateTaskBehav = getButtonBehaviour("CREATE_TASK");
let setUpdateTaskBehav = getButtonBehaviour("UPDATE_TASK");
