// ============================================================
//  Counter App — script.js
//  Concepts demonstrated:
//    ✅ DOM manipulation (getElementById, textContent, setAttribute)
//    ✅ Event listeners (addEventListener)
//    ✅ Closures (makeCounter factory function)
//    ✅ Scope (count lives inside the closure, not global)
//    ✅ Arrays (history array + push / splice)
// ============================================================


// ─── 1. CLOSURE: Counter Factory ────────────────────────────
// makeCounter() returns an object of functions.
// The variable `count` is in the FUNCTION SCOPE of makeCounter —
// it is NOT accessible from outside. That's a closure!
function makeCounter(min, max) {
  let count = 0; // This variable is "closed over" by the inner functions

  return {
    increment() {
      if (count < max) {
        count++;
      }
      return count;
    },
    decrement() {
      if (count > min) {
        count--;
      }
      return count;
    },
    reset() {
      count = 0;
      return count;
    },
    getCount() {
      return count;
    },
    isAtMax() {
      return count === max;
    },
    isAtMin() {
      return count === min;
    },
  };
}

// Create our counter with limits -10 and +10
const counter = makeCounter(-10, 10);


// ─── 2. DOM REFERENCES ──────────────────────────────────────
// Grab the elements we need to read or update
const countValueEl   = document.getElementById("count-value");
const statusMsgEl    = document.getElementById("status-msg");
const historyListEl  = document.getElementById("history-list");
const btnIncrease    = document.getElementById("btn-increase");
const btnDecrease    = document.getElementById("btn-decrease");
const btnReset       = document.getElementById("btn-reset");
const btnClearHistory= document.getElementById("btn-clear-history");


// ─── 3. HISTORY ARRAY ───────────────────────────────────────
// We store each action as a string in this array
const history = [];


// ─── 4. HELPER: Update the display ──────────────────────────
// This function reads the current count from the closure
// and syncs the DOM to match it.
function updateDisplay(action) {
  const current = counter.getCount();

  // Update the big number
  countValueEl.textContent = current;

  // Change color based on positive / negative / zero
  if (current > 0) {
    countValueEl.setAttribute("data-state", "positive");
  } else if (current < 0) {
    countValueEl.setAttribute("data-state", "negative");
  } else {
    countValueEl.setAttribute("data-state", "zero");
  }

  // Pop animation: remove then re-add the class
  countValueEl.classList.remove("pop");
  // Timeout 0 forces the browser to repaint so the animation restarts
  setTimeout(() => countValueEl.classList.add("pop"), 0);

  // Show limit warnings
  if (counter.isAtMax()) {
    statusMsgEl.textContent = "⚠️ Maximum limit reached (10)";
  } else if (counter.isAtMin()) {
    statusMsgEl.textContent = "⚠️ Minimum limit reached (-10)";
  } else {
    statusMsgEl.textContent = "";
  }

  // Log to history if an action was provided
  if (action) {
    addToHistory(action, current);
  }
}


// ─── 5. HELPER: Add item to history list ────────────────────
function addToHistory(action, resultCount) {
  // Build a timestamp string
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Prepend newest action to the array (unshift adds to the beginning)
  history.unshift(`[${time}]  ${action}  →  count = ${resultCount}`);

  // Re-render the entire history list
  renderHistory();
}


// ─── 6. HELPER: Render history list to DOM ──────────────────
function renderHistory() {
  // Clear the current list
  historyListEl.innerHTML = "";

  if (history.length === 0) {
    // Show placeholder when empty
    historyListEl.innerHTML = '<li class="history-empty">No actions yet. Use the buttons above!</li>';
    return;
  }

  // Loop through the history array and create a <li> for each entry
  history.forEach(function (entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyListEl.appendChild(li);
  });
}


// ─── 7. EVENT LISTENERS ─────────────────────────────────────
// Each button gets an event listener that calls the counter,
// then updates the display.

btnIncrease.addEventListener("click", function () {
  counter.increment();
  updateDisplay("➕ Increased");
});

btnDecrease.addEventListener("click", function () {
  counter.decrement();
  updateDisplay("➖ Decreased");
});

btnReset.addEventListener("click", function () {
  counter.reset();
  updateDisplay("↺  Reset");
});

btnClearHistory.addEventListener("click", function () {
  // Empty the array using splice (keeps the same reference)
  history.splice(0, history.length);
  renderHistory();
});


// ─── 8. INITIAL RENDER ──────────────────────────────────────
// Run once on page load so the display is correct from the start
updateDisplay(null);
