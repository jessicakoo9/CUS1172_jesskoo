
const tasks = [];


document.addEventListener("DOMContentLoaded", () => {

  const taskForm =
    document.getElementById("task-form") ||
    document.getElementById("taskForm");

  const taskTitleInput =
    document.getElementById("task-title") ||
    document.getElementById("taskTitle");

  const taskPrioritySelect =
    document.getElementById("task-priority") ||
    document.getElementById("taskPriority");

  const taskList =
    document.getElementById("task-list") ||
    document.getElementById("taskList");

  const taskCountBadge =
    document.getElementById("task-count") ||
    document.getElementById("taskCount");

  const emptyMessage =
    document.getElementById("empty-message") ||
    document.getElementById("emptyMessage");

  if (!taskForm) {
    console.error(
      "Task form not found. Make sure your form has id='task-form' or id='taskForm'."
    );
    return;
  }

  taskForm.addEventListener("submit", (event) => {
 
    event.preventDefault();

    const title = taskTitleInput ? taskTitleInput.value.trim() : "";
    const priority = taskPrioritySelect ? taskPrioritySelect.value : "";
    const statusInput = document.querySelector(
      "input[name='task-status']:checked, input[name='taskStatus']:checked"
    );
    const status = statusInput ? statusInput.value : "pending";

    let valid = true;

    if (!title) {
      if (taskTitleInput) taskTitleInput.classList.add("is-invalid");
      valid = false;
    } else if (taskTitleInput) {
      taskTitleInput.classList.remove("is-invalid");
    }

    if (!priority) {
      if (taskPrioritySelect) taskPrioritySelect.classList.add("is-invalid");
      valid = false;
    } else if (taskPrioritySelect) {
      taskPrioritySelect.classList.remove("is-invalid");
    }

    if (!valid) return;


    const newTask = {
      id: Date.now().toString(), 
      title,
      priority, 
      status, 
    };


    tasks.push(newTask);
    console.log("Current tasks array:", tasks);


    if (taskList) {
      appendTaskToDOM(newTask, taskList, emptyMessage);
    }

    updateTaskCount(taskCountBadge);


    taskForm.reset();


    const pendingRadio =
      document.getElementById("status-pending") ||
      document.getElementById("statusPending");
    if (pendingRadio) pendingRadio.checked = true;
  });

  if (taskList) {
    taskList.addEventListener("click", (event) => {
      const button = event.target;
      if (button.tagName !== "BUTTON") return;

      const action = button.dataset.action;
      if (!action) return;

      const li = button.closest("li");
      if (!li) return;
      const taskId = li.dataset.id;

      if (action === "remove") {
        removeTask(taskId, li, emptyMessage, taskCountBadge);
      } else if (action === "complete") {
        markTaskComplete(taskId, li);
      }
    });
  }
});

function appendTaskToDOM(task, taskList, emptyMessage) {
  
  if (emptyMessage) {
    emptyMessage.style.display = "none";
  }

  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex flex-column flex-sm-row align-items-sm-center justify-content-between";
  li.dataset.id = task.id;

  
  const infoDiv = document.createElement("div");
  infoDiv.className = "d-flex flex-column";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const metaDiv = document.createElement("div");
  metaDiv.className = "mt-1";

  const priorityBadge = document.createElement("span");
  priorityBadge.classList.add("badge", "me-2");
  if (task.priority === "low") {
    priorityBadge.classList.add("badge-priority-low");
    priorityBadge.textContent = "Low";
  } else if (task.priority === "medium") {
    priorityBadge.classList.add("badge-priority-medium");
    priorityBadge.textContent = "Medium";
  } else if (task.priority === "high") {
    priorityBadge.classList.add("badge-priority-high");
    priorityBadge.textContent = "High";
  } else {
    priorityBadge.textContent = task.priority;
  }

  const statusBadge = document.createElement("span");
  statusBadge.classList.add("badge", "bg-info", "text-dark");
  statusBadge.textContent =
    task.status === "completed" ? "Completed" : "Pending";

  metaDiv.appendChild(priorityBadge);
  metaDiv.appendChild(statusBadge);

  infoDiv.appendChild(titleSpan);
  infoDiv.appendChild(metaDiv);


  const actionsDiv = document.createElement("div");
  actionsDiv.className =
    "task-actions d-flex flex-sm-row flex-column gap-2 mt-2 mt-sm-0";

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.className = "btn btn-success btn-sm";
  completeBtn.textContent = "Mark Complete";
  completeBtn.dataset.action = "complete";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-outline-danger btn-sm";
  removeBtn.textContent = "Remove";
  removeBtn.dataset.action = "remove";

  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(removeBtn);

  if (task.status === "completed") {
    titleSpan.classList.add("task-completed");
    completeBtn.disabled = true;
  }

  li.appendChild(infoDiv);
  li.appendChild(actionsDiv);

  taskList.appendChild(li);
}

function removeTask(taskId, liElement, emptyMessage, taskCountBadge) {

  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
  }


  liElement.remove();

  updateTaskCount(taskCountBadge);


  if (tasks.length === 0 && emptyMessage) {
    emptyMessage.style.display = "block";
  }
}

function markTaskComplete(taskId, liElement) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (task.status === "completed") {
    return; 
  }

  task.status = "completed";

  
  const titleSpan = liElement.querySelector(".task-title");
  const statusBadge = liElement.querySelector(".badge.bg-info");
  const completeBtn = liElement.querySelector(
    'button[data-action="complete"]'
  );

  if (titleSpan) {
    titleSpan.classList.add("task-completed");
  }

  if (statusBadge) {
    statusBadge.textContent = "Completed";
  }

  if (completeBtn) {
    completeBtn.disabled = true;
  }
}

function updateTaskCount(taskCountBadge) {
  if (!taskCountBadge) return;

  const count = tasks.length;

  if (count === 0) {
    taskCountBadge.textContent = "0 tasks";
  } else if (count === 1) {
    taskCountBadge.textContent = "1 task";
  } else {
    taskCountBadge.textContent = `${count} tasks`;
  }
}
