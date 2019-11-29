window.onload = e => {
  axios({
    method: "get",
    url: `/api/jobs/${window.userId}`,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  }).then(payload => {
    payload.data.forEach(job => {
      let jobDOMEl = document.createElement("div");
      jobDOMEl.className = "job";
      let jobTitle = document.createElement("a");
      jobTitle.innerHTML = `<a href="update/job/${job._id}"><span>${job.description}</span></a>`;
      
      jobDOMEl.appendChild(jobTitle);

      let taskList = document.createElement("ul");
      taskList.className = "job-grad";
      job.tasks.forEach(task => {
        console.log(task.operator);
        let taskDOMEl = document.createElement("li");
        taskDOMEl.innerHTML = `<a href="update/job/${job._id}">
        <div class="task-box">
          <h4>${task.name}</h4>
          <p>${task.operator.username}</p>
        </div>
      </a>`;
        taskList.appendChild(taskDOMEl);
      });
      
      jobDOMEl.appendChild(taskList);

      document.getElementById("jobs-wrapper").appendChild(jobDOMEl);
    });
  });
};
