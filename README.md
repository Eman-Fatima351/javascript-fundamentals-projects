# JavaScript Fundamentals Demos

> A collection of three beginner-friendly interactive apps that demonstrate core JavaScript concepts — built with vanilla HTML, CSS, and JavaScript (no frameworks, no libraries).

---

## 📋 Project Overview

This repository was created as a JavaScript Fundamentals assignment. It contains three fully working interactive demos and a comprehensive reference file (`concepts.js`) that illustrates the key concepts covered in each app.

Every file is heavily commented to make it easy to follow along, even as a beginner.

---

## 📁 Folder Structure

```
javascript-fundamentals-demos/
│
├── Counter-App/
│   ├── index.html      ← App structure & layout
│   ├── style.css       ← Dark-theme responsive styles
│   └── script.js       ← Counter logic with closures & events
│
├── Todo-App/
│   ├── index.html      ← App structure & layout
│   ├── style.css       ← Dark-theme responsive styles
│   └── script.js       ← Task management with arrays & DOM
│
├── Quiz-App/
│   ├── index.html      ← App structure & layout
│   ├── style.css       ← Dark-theme responsive styles
│   └── script.js       ← Quiz logic with Promises & objects
│
├── concepts.js         ← Standalone JS concepts reference file
└── README.md           ← This file
```

---

## 🚀 Project 1 — Counter App

**Location:** `Counter-App/`

### Features
- ➕ **Increase** button — increments the count (max: +10)
- ➖ **Decrease** button — decrements the count (min: -10)
- ↺ **Reset** button — returns count to 0
- 🔢 **Live count display** with color coding (green = positive, red = negative, indigo = zero)
- ⚠️ **Limit warnings** shown when min/max is reached
- 📜 **Click history log** showing every action with a timestamp
- 🗑️ **Clear History** button

### JavaScript Concepts Used
| Concept | Where |
|---|---|
| **Closure** | `makeCounter()` factory — `count` is private inside the closure |
| **DOM Manipulation** | `getElementById`, `textContent`, `setAttribute`, `classList` |
| **Event Listeners** | `addEventListener('click', ...)` on all buttons |
| **Arrays** | History array with `push`, `splice`, `forEach` |
| **Scope** | `count` in function scope; `history` in module scope |

---

## 🚀 Project 2 — To-Do App

**Location:** `Todo-App/`

### Features
- ✏️ **Add tasks** via input field (Enter key or Add button)
- ✅ **Mark tasks complete** with a custom circular checkbox
- 🗑️ **Delete individual tasks** with a × button
- ⚠️ **Empty-input validation** with an error message
- 📊 **Live stats bar** (total / done / remaining)
- 🔽 **Filter tabs**: All | Active | Completed
- 🧹 **Clear Completed** button to bulk-delete finished tasks

### JavaScript Concepts Used
| Concept | Where |
|---|---|
| **Arrays** | `tasks[]` array — `push`, `filter`, `findIndex`, `splice`, `forEach` |
| **Objects** | Each task is `{ id, text, completed }` |
| **DOM Manipulation** | `createElement`, `appendChild`, `innerHTML`, `classList` |
| **Event Listeners** | `click`, `keydown`, `input` events |
| **Closures** | Delete/toggle handlers capture `task.id` per iteration |
| **Scope** | `tasks`, `nextId`, `currentFilter` in module scope |

---

## 🚀 Project 3 — Quiz App

**Location:** `Quiz-App/`

### Features
- 📝 **10 multiple-choice questions** on JavaScript fundamentals
- 📊 **Progress bar** and question counter
- ✅ **Instant visual feedback** — correct answer highlighted green, wrong in red
- 💡 **Explanation** shown after every answer
- ➡️ **Next button** (becomes "See Results" on the final question)
- 🏆 **Result screen** with score, percentage, and a dynamic message
- 🔄 **Play Again** button to restart without refreshing

### JavaScript Concepts Used
| Concept | Where |
|---|---|
| **Objects** | Each question is `{ question, options[], answer, explain }` |
| **Arrays** | `questions[]` array iterated with `forEach` |
| **DOM Manipulation** | Dynamic screen switching, option button creation |
| **Event Listeners** | `click` events on dynamically created buttons |
| **Promises** | Custom `wait(ms)` Promise for async delay before results |
| **async/await** | `showResults()` uses `await wait(800)` |
| **Closures** | Option click handlers capture `q` and `index` |

---

## 📖 JavaScript Concepts Covered

The file `concepts.js` contains fully commented, runnable examples of:

### 1. Variable Scope
```js
// Global scope — accessible everywhere
var globalVar = "I am global";

// Function scope — only inside the function
function demo() {
  var functionScoped = "only inside here";
}

// Block scope — only inside { }
{
  let blockScoped = "only inside this block";
}
```

### 2. Closures
```js
// Inner function "remembers" the outer variable
function makeGreeter(greeting) {
  return function(name) {
    console.log(greeting + ", " + name + "!"); // greeting is closed over
  };
}
const sayHello = makeGreeter("Hello");
sayHello("Eman"); // Hello, Eman!
```

### 3. Hoisting
```js
// Function declarations are fully hoisted
greet(); // ✅ works before the definition
function greet() { console.log("Hello!"); }

// var declarations are hoisted (but NOT the value)
console.log(x); // undefined — NOT an error
var x = 5;

// let / const are in the Temporal Dead Zone — cannot be used before
// console.log(y); // ❌ ReferenceError
let y = 10;
```

### 4. Promises
```js
// Creating a Promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done!"), 500);
});

// .then() / .catch() / .finally()
p.then(val => console.log(val))
 .catch(err => console.error(err))
 .finally(() => console.log("settled"));

// async / await
async function run() {
  try {
    const result = await p;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

### 5. Arrays — Common Methods
`push`, `pop`, `shift`, `unshift`, `map`, `filter`, `find`, `forEach`, `reduce`, `splice`, `slice`, `indexOf`, `includes`, `join`

### 6. Objects — Creation & Access
```js
const obj = { name: "Eman", role: "Developer" };
obj.name;          // dot notation
obj["role"];       // bracket notation
Object.keys(obj);  // ["name", "role"]
const { name } = obj; // destructuring
```

---

## ▶️ How to Run Locally

All three apps are **pure HTML/CSS/JS** — no build step, no dependencies.

### Option A — Open directly in a browser
1. Clone or download this repository
2. Navigate to any app folder (e.g., `Counter-App/`)
3. Double-click `index.html` — it opens in your default browser

### Option B — Use VS Code Live Server (recommended)
1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

### Option C — Run concepts.js in Node.js
```bash
# Make sure Node.js is installed, then:
node concepts.js
```

### Option D — Run concepts.js in the browser console
1. Open any browser
2. Press `F12` to open DevTools → go to the **Console** tab
3. Paste the entire contents of `concepts.js` and press Enter

---

## ✅ Assignment Checklist

| Requirement | Status | Where |
|---|---|---|
| GitHub repository with 3 demos | ✅ | Counter, Todo, Quiz folders |
| Understands scope | ✅ | `concepts.js` §1, all `script.js` files |
| Understands closures | ✅ | `concepts.js` §2, Counter `makeCounter()`, Todo handlers |
| Understands hoisting | ✅ | `concepts.js` §3 |
| DOM manipulation | ✅ | All three `script.js` files |
| Event handling | ✅ | All three `script.js` files |
| Built at least 2 interactive demos | ✅ | Counter App + Todo App + Quiz App |
| Understands Promises | ✅ | `concepts.js` §4, Quiz `showResults()` async/await |

---

## 👤 Author

**Eman Fatima**  
Software Engineering Student | Comsats University Islamabad Lahore Campus 

---

## 📄 License

This project is open-source and available for educational use.
