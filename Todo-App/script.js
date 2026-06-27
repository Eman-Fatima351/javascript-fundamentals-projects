// ============================================================
//  To-Do App — script.js
//  Concepts demonstrated:
//    ✅ Arrays (tasks array, push, filter, findIndex, splice)
//    ✅ Objects (each task is an object with id, text, completed)
//    ✅ DOM manipulation (createElement, appendChild, innerHTML)
//    ✅ Event listeners (click, keydown)
//    ✅ Scope (variables scoped to functions)
//    ✅ Closures (event handlers capture task id)
// ============================================================


// ─── 1. DATA MODEL ──────────────────────────────────────────
// Tasks are stored as an ARRAY of OBJECTS.
// Each task object has: { id, text, completed }
let tasks = [];

// We use a simple counter for unique IDs
let nextId = 1;

// Current filter: "all" | "active" | "completed"
let currentFilter = "all";


// ─── 2. DOM REFERENCES ──────────────────────────────────────
const taskInput          = document.getElementById("task-input");
const btnAdd             = document.getElementById("btn-add");
const taskListEl         = document.getElementById("task-list");
const errorMsgEl         = document.getElementById("error-msg");
const btnClearCompleted  = document.getElementById("btn-clear-completed");
const filterButtons      = document.querySelectorAll(".btn-filter");
const statTotal          = document.getElementById("stat-total");
const statDone           = document.getElementById("stat-done");
const statRemaining      = document.getElementById("stat-remaining");


// ─── 3. CORE FUNCTIONS ──────────────────────────────────────

// addTask: Validates input, creates a task object, pushes to array
function addTask() {
  // Trim whitespace from both ends of the input value
  const text = taskInput.value.trim();

  // INPUT VALIDATION: show an error and stop if empty
  if (text === "") {
    showError("Task cannot be empty. Please type something!");
    return;
  }

  // Clear any previous error
  clearError();

  // Create a new task OBJECT
  const newTask = {
    id: nextId,          // unique number
    text: text,          // the task description
    completed: false,    // starts incomplete
  };

  nextId++; // increment for the next task

  // Push the object into the tasks ARRAY
  tasks.push(newTask);

  // Clear the input field
  taskInput.value = "";

  // Re-render everything
  renderTasks();
  updateStats();
}


// deleteTask: Removes a task from the array by id
function deleteTask(id) {
  // findIndex returns the position of the first matching element
  const index = tasks.findIndex(function (task) {
    return task.id === id;
  });

  // splice(start, deleteCount) removes elements in place
  if (index !== -1) {
    tasks.splice(index, 1);
  }

  renderTasks();
  updateStats();
}


// toggleTask: Flips the completed boolean on a task
function toggleTask(id) {
  // find() returns the actual object (not a copy) so we can mutate it
  const task = tasks.find(function (t) {
    return t.id === id;
  });

  if (task) {
    task.completed = !task.completed; // flip true <-> false
  }

  renderTasks();
  updateStats();
}


// clearCompleted: Removes all completed tasks from the array
function clearCompleted() {
  // filter() returns a NEW array containing only tasks where completed === false
  tasks = tasks.filter(function (task) {
    return task.completed === false;
  });

  renderTasks();
  updateStats();
}


// ─── 4. RENDER FUNCTION ─────────────────────────────────────
// Reads the tasks array and rebuilds the DOM list
function renderTasks() {
  // Determine which tasks to show based on current filter
  let visibleTasks;

  if (currentFilter === "active") {
    visibleTasks = tasks.filter(function (t) { return !t.completed; });
  } else if (currentFilter === "completed") {
    visibleTasks = tasks.filter(function (t) { return t.completed; });
  } else {
    visibleTasks = tasks; // "all"
  }

  // Clear the current DOM list
  taskListEl.innerHTML = "";

  // Show an empty-state message if there's nothing to display
  if (visibleTasks.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = tasks.length === 0
      ? "No tasks yet. Add one above! 🎉"
      : "No tasks match this filter.";
    taskListEl.appendChild(li);
    return;
  }

  // Loop through visible tasks and build a <li> for each
  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    // CLOSURE EXAMPLE: The event handlers below "close over"
    // the `task.id` variable from this forEach iteration.
    // Each handler remembers the specific id it was created with.

    // Checkbox for marking complete
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id); // <-- task.id is captured by closure
    });

    // Task text span
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id); // <-- task.id is captured by closure
    });

    // Assemble the list item
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    taskListEl.appendChild(li);
  });
}


// ─── 5. STATS UPDATE ────────────────────────────────────────
function updateStats() {
  const total     = tasks.length;
  const done      = tasks.filter(function (t) { return t.completed; }).length;
  const remaining = total - done;

  statTotal.textContent     = total + " task" + (total !== 1 ? "s" : "");
  statDone.textContent      = done + " done";
  statRemaining.textContent = remaining + " remaining";
}


// ─── 6. ERROR HELPERS ───────────────────────────────────────
function showError(msg) {
  errorMsgEl.textContent = msg;
}

function clearError() {
  errorMsgEl.textContent = "";
}


// ─── 7. EVENT LISTENERS ─────────────────────────────────────

// Add button click
btnAdd.addEventListener("click", addTask);

// Allow pressing Enter in the input to add a task
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Clear any error when the user starts typing again
taskInput.addEventListener("input", function () {
  if (errorMsgEl.textContent !== "") {
    clearError();
  }
});

// Clear completed tasks
btnClearCompleted.addEventListener("click", clearCompleted);

// Filter buttons: use a loop to attach listeners
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // Remove "active" class from all filter buttons
    filterButtons.forEach(function (b) { b.classList.remove("active"); });

    // Add "active" to the clicked button
    btn.classList.add("active");

    // Update the current filter from the data attribute
    currentFilter = btn.getAttribute("data-filter");

    // Re-render with the new filter
    renderTasks();
  });
});


// ─── 8. INITIAL RENDER ──────────────────────────────────────
renderTasks();
updateStats();
