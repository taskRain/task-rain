let taskFormGroup = [
  ["name", "#task-name"],
  ["description", "#task-description"],
  ["materials", "#task-materials"],
  ["duration", "#task-duration"],
];
let jobFormGroup = [
  ["description", "#job-description"],
  ["start_date", "#job-start-date"],
  ["end_date", "#job-end-date"],
  ["lat","#lat"],
  ["lng","#lng"]
];

let taskList = document.querySelector(".task-container");
let jobLocationId = window.job.location;
let hackTask = null;

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

function getButtonBehaviour(behaviour) {
  switch (behaviour) {
    case "CREATE_TASK":
      return e => {
        e && e.preventDefault();
        document.querySelector(".task-create").classList.toggle("hide");

        let payload = { location: jobLocationId, jobId: window.jobId, operator: document.querySelector("#task-operator").value };

        taskFormGroup.forEach(field => {
          payload[field[0]] = document.querySelector(field[1]).value;
        });
        console.log(payload);
        axios({
          method: "post",
          url: "/planner/create/task",
          data: payload,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(() => {
          renderTaskList(window.jobId);
        });
      };
      break;
    case "UPDATE_TASK":
      return e => {
        e && e.preventDefault();
        document.querySelector(".task-create").classList.toggle("hide");
        let payload = {
          location: jobLocationId,
          jobId: window.jobId,
          taskId: hackTask,
          operator: document.querySelector("#task-operator").value
        };

        taskFormGroup.forEach(field => {
          payload[field[0]] = document.querySelector(field[1]).value;
        });
        console.log(payload);
        axios({
          method: "put",
          url: "/planner/update/task",
          data: payload,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(() => {
          renderTaskList(window.jobId);
        });
      };
      break;
    case "UPDATE_JOB":
      return e => {
        e && e.preventDefault();
        let payload = {
          location: jobLocationId,
          jobId: window.jobId
        };
        jobFormGroup.forEach(field => {
          payload[field[0]] = document.querySelector(field[1]).value;
        });
        axios({
          method: "put",
          url: "/planner/update/job",
          data: payload,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        }).then(result => {
          window.location.pathname = `planner/`;
        });
      };
      break;
    case "CANCEL_TASK":
      return e => {
        e && e.preventDefault();
        document.querySelector(".task-create").classList.toggle("hide");
        clearForm(taskFormGroup);
      };
      break;
      case "CANCEL_JOB":
      return e => {
        e && e.preventDefault();
        window.location.pathname = `planner/`;
      };
      break;
  }
}

let setCreateTaskBehav = getButtonBehaviour("CREATE_TASK");
let setUpdateTaskBehav = getButtonBehaviour("UPDATE_TASK");
let setUpdateJobBehav = getButtonBehaviour("UPDATE_JOB");
let setTaskCancelBehav = getButtonBehaviour("CANCEL_TASK")
let setJobCancelBehav = getButtonBehaviour("CANCEL_JOB");

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

document.querySelector("#new-task").addEventListener("click", e => {
  e && e.preventDefault();
  clearForm(taskFormGroup);
  document.querySelector(".task-create").classList.toggle("hide");
  let asideButton = document.querySelector('.task-create input[type="submit"]');
  asideButton.value = `Create Task`;
  asideButton.removeEventListener("click", setUpdateTaskBehav);
  asideButton.addEventListener("click", setCreateTaskBehav);
});

document
  .querySelector(`.job-create input[type="submit"]`)
  .addEventListener("click", setUpdateJobBehav);

document.querySelector(".task-cancel").addEventListener("click", setTaskCancelBehav);

document.querySelector(".job-cancel").addEventListener("click", setJobCancelBehav);

renderTaskList(window.jobId);
