// ============================================================
//  concepts.js — JavaScript Fundamentals Reference
//  Topics covered:
//    1. Variable Scope   (global, function, block)
//    2. Closures         (function returning function)
//    3. Hoisting         (variables and functions)
//    4. Promises         (create, .then, .catch, async/await)
//    5. Arrays           (common methods)
//    6. Objects          (creation and access)
// ============================================================
//
//  HOW TO RUN:
//    Option A — Browser Console: copy-paste this file into the
//               DevTools console (F12 → Console tab).
//    Option B — Node.js: run `node concepts.js` in your terminal.
// ============================================================


console.log("====================================================");
console.log("  JavaScript Fundamentals — concepts.js");
console.log("====================================================\n");


// ────────────────────────────────────────────────────────────
//  SECTION 1: VARIABLE SCOPE
//  Scope determines where in the code a variable can be used.
// ────────────────────────────────────────────────────────────
console.log("── 1. VARIABLE SCOPE ──────────────────────────────\n");

// ── 1a. Global Scope ──
// A variable declared OUTSIDE all functions and blocks
// is in global scope — accessible everywhere in the file.
var globalVar = "I am global (var)";
let globalLet = "I am also global (let)";

function demonstrateGlobalScope() {
  // We can read globalVar inside a function — it's global!
  console.log("Inside function, accessing global var:", globalVar);
}
demonstrateGlobalScope();
console.log("Outside function, global var is still:", globalVar);
console.log();

// ── 1b. Function Scope ──
// Variables declared with `var` inside a function are limited
// to that function. They cannot be accessed outside.
function functionScopeDemo() {
  var functionScoped = "I only exist inside this function";
  console.log("Inside function:", functionScoped); // ✅ works
}

functionScopeDemo();

// Uncommenting the next line would throw a ReferenceError:
// console.log(functionScoped); // ❌ ReferenceError: not defined

console.log("(functionScoped is NOT accessible outside its function)\n");

// ── 1c. Block Scope ──
// Variables declared with `let` or `const` inside { } blocks
// (if, for, while, etc.) are limited to that block.
{
  let blockScoped = "I only exist inside this block {}";
  const blockConst = "I am also block-scoped";
  console.log("Inside block:", blockScoped); // ✅ works
  console.log("Inside block:", blockConst);  // ✅ works
}

// Uncommenting would throw ReferenceError:
// console.log(blockScoped); // ❌ ReferenceError

console.log("(blockScoped is NOT accessible outside the { } block)");

// var ignores block scope — avoid this in modern code!
{
  var notReallyBlockScoped = "var leaks out of blocks!";
}
console.log("var leaked out of a block:", notReallyBlockScoped); // works ⚠️
console.log();


// ────────────────────────────────────────────────────────────
//  SECTION 2: CLOSURES
//  A closure is created when an inner function "remembers"
//  variables from its outer function's scope, even after the
//  outer function has finished running.
// ────────────────────────────────────────────────────────────
console.log("── 2. CLOSURES ────────────────────────────────────\n");

// ── 2a. Basic Closure ──
// makeGreeter() finishes running, but the returned function
// still has access to the `greeting` variable. That is a closure!
function makeGreeter(greeting) {
  // `greeting` is in the outer function's scope
  return function (name) {
    // This inner function CLOSES OVER `greeting`
    console.log(greeting + ", " + name + "!");
  };
}

const sayHello  = makeGreeter("Hello");
const sayBonjour= makeGreeter("Bonjour");

sayHello("Eman");     // Hello, Eman!
sayBonjour("Claude"); // Bonjour, Claude!
// Each greeter remembers its own `greeting` independently.
console.log();

// ── 2b. Closure for Private State ──
// This is the classic "counter" closure pattern.
// `count` is PRIVATE — it can only be changed through the
// returned functions. Nothing outside can directly modify it.
function makePrivateCounter() {
  let count = 0; // private variable — not accessible from outside

  return {
    increment: function () { count++;  return count; },
    decrement: function () { count--;  return count; },
    getCount:  function () { return count; },
  };
}

const myCounter = makePrivateCounter();
console.log("Increment:", myCounter.increment()); // 1
console.log("Increment:", myCounter.increment()); // 2
console.log("Decrement:", myCounter.decrement()); // 1
console.log("Count is:", myCounter.getCount());   // 1

// We cannot access `count` directly — it is truly private!
// console.log(myCounter.count); // undefined
console.log();


// ────────────────────────────────────────────────────────────
//  SECTION 3: HOISTING
//  JavaScript "hoists" (moves) declarations to the top of
//  their scope before executing code. Only declarations are
//  hoisted — NOT initializations (assigned values).
// ────────────────────────────────────────────────────────────
console.log("── 3. HOISTING ────────────────────────────────────\n");

// ── 3a. Function Hoisting ──
// You can CALL a function BEFORE its definition in the code
// because the entire function declaration is hoisted.
console.log("Calling hoistedFunction BEFORE its definition:");
hoistedFunction(); // ✅ This works!

function hoistedFunction() {
  console.log("I was hoisted! I can be called before I appear in the code.");
}

console.log();

// ── 3b. Variable Hoisting with `var` ──
// The DECLARATION `var x` is hoisted, but its VALUE (5) is not.
// So `x` exists before the assignment, but its value is `undefined`.
console.log("var before declaration:", hoistedVar); // undefined (NOT an error)
var hoistedVar = "I am now assigned!";
console.log("var after declaration:", hoistedVar);  // "I am now assigned!"
console.log();

// ── 3c. `let` and `const` are NOT usable before declaration ──
// They are hoisted but placed in a "Temporal Dead Zone" (TDZ).
// Accessing them before their line throws a ReferenceError.
//
// Uncommenting the next line would throw:
// console.log(hoistedLet); // ❌ ReferenceError: Cannot access before initialization
let hoistedLet = "I use let — no hoisting trickery here!";
console.log("let after declaration:", hoistedLet);  // works fine ✅
console.log();


// ────────────────────────────────────────────────────────────
//  SECTION 4: PROMISES
//  A Promise is an object representing a future value.
//  It is either: pending → fulfilled (resolved) or rejected.
// ────────────────────────────────────────────────────────────
console.log("── 4. PROMISES ────────────────────────────────────\n");

// ── 4a. Creating a custom Promise ──
// The Promise constructor takes a function with two arguments:
//   resolve(value)  — call when the async work succeeds
//   reject(reason)  — call when it fails
function fetchUserData(userId) {
  return new Promise(function (resolve, reject) {
    // Simulate a network request with setTimeout
    setTimeout(function () {
      if (userId > 0) {
        // Resolve with a fake user object
        resolve({ id: userId, name: "Eman Fatima", role: "CS Student" });
      } else {
        // Reject with an error message
        reject(new Error("Invalid user ID: must be greater than 0"));
      }
    }, 500); // pretend this takes 500ms
  });
}

// ── 4b. Consuming with .then() and .catch() ──
console.log("Fetching user (ID = 1)...");
fetchUserData(1)
  .then(function (user) {
    // .then() runs when the Promise is resolved
    console.log("✅ User found:", user.name, "| Role:", user.role);
  })
  .catch(function (error) {
    // .catch() runs when the Promise is rejected
    console.log("❌ Error:", error.message);
  })
  .finally(function () {
    // .finally() always runs, whether resolved or rejected
    console.log("(fetchUserData #1 settled)\n");
  });

console.log("Fetching user (ID = -1 — this will fail)...");
fetchUserData(-1)
  .then(function (user) {
    console.log("User:", user);
  })
  .catch(function (error) {
    console.log("❌ Caught rejection:", error.message);
  })
  .finally(function () {
    console.log("(fetchUserData #2 settled)\n");
  });

// ── 4c. async / await ──
// `async` before a function makes it always return a Promise.
// `await` pauses execution inside the async function until
// the awaited Promise resolves or rejects.
async function loadUser(userId) {
  console.log(`Loading user with ID ${userId}...`);
  try {
    // await pauses here until fetchUserData resolves
    const user = await fetchUserData(userId);
    console.log("✅ async/await got:", user.name);
  } catch (error) {
    // If the Promise rejects, execution jumps to catch
    console.log("❌ async/await caught:", error.message);
  }
}

loadUser(42);  // valid
loadUser(-5);  // invalid — will be caught
console.log();


// ────────────────────────────────────────────────────────────
//  SECTION 5: ARRAYS
//  Arrays store ordered lists of values.
//  JavaScript provides many built-in methods for working with them.
// ────────────────────────────────────────────────────────────
console.log("── 5. ARRAYS ──────────────────────────────────────\n");

const fruits = ["apple", "banana", "cherry", "date", "elderberry"];
console.log("Original array:", fruits);

// push() — add to the END; returns new length
fruits.push("fig");
console.log("After push('fig'):", fruits);

// pop() — remove from the END; returns removed item
const last = fruits.pop();
console.log("After pop():", fruits, "| Removed:", last);

// unshift() — add to the BEGINNING
fruits.unshift("avocado");
console.log("After unshift('avocado'):", fruits);

// shift() — remove from the BEGINNING
const first = fruits.shift();
console.log("After shift():", fruits, "| Removed:", first);

// indexOf() — find the position of an item (-1 if not found)
console.log("indexOf('cherry'):", fruits.indexOf("cherry")); // 1 (0-based)

// includes() — check if an item exists (returns boolean)
console.log("includes('banana'):", fruits.includes("banana")); // true

// map() — transform EVERY element; returns a NEW array
const upperFruits = fruits.map(function (fruit) {
  return fruit.toUpperCase();
});
console.log("map() to uppercase:", upperFruits);

// filter() — keep only elements that pass a test; returns NEW array
const longFruits = fruits.filter(function (fruit) {
  return fruit.length > 5;
});
console.log("filter() names longer than 5 chars:", longFruits);

// find() — return the FIRST element that passes the test
const foundFruit = fruits.find(function (fruit) {
  return fruit.startsWith("c");
});
console.log("find() starting with 'c':", foundFruit);

// forEach() — iterate without building a new array (no return value)
console.log("forEach() loop:");
fruits.forEach(function (fruit, index) {
  console.log("  [" + index + "] " + fruit);
});

// reduce() — collapse the array to a single value
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(function (accumulator, current) {
  return accumulator + current;
}, 0); // 0 is the starting value
console.log("reduce() sum of [1,2,3,4,5]:", sum); // 15

// splice() — remove/insert elements IN PLACE
const colors = ["red", "green", "blue", "yellow"];
const removed = colors.splice(1, 2); // start at index 1, remove 2 items
console.log("splice() removed:", removed);   // ["green", "blue"]
console.log("splice() remaining:", colors);  // ["red", "yellow"]

// slice() — extract a portion WITHOUT modifying original
const nums = [10, 20, 30, 40, 50];
const sliced = nums.slice(1, 4); // from index 1 up to (not including) 4
console.log("slice(1, 4):", sliced); // [20, 30, 40]

// join() — convert array to a string
const words = ["JavaScript", "is", "awesome"];
console.log("join():", words.join(" ")); // "JavaScript is awesome"
console.log();


// ────────────────────────────────────────────────────────────
//  SECTION 6: OBJECTS
//  Objects store key-value pairs. Keys are strings (or Symbols).
//  Values can be any type: string, number, array, function, etc.
// ────────────────────────────────────────────────────────────
console.log("── 6. OBJECTS ─────────────────────────────────────\n");

// ── 6a. Object literal syntax (most common way to create) ──
const student = {
  name:    "Eman Fatima",
  age:     21,
  major:   "Computer Science",
  skills:  ["JavaScript", "Python", "Machine Learning"],
  isActive: true,

  // A method is a function stored as a property of an object
  introduce: function () {
    // `this` refers to the object the method belongs to
    return "Hi, I'm " + this.name + " and I study " + this.major + ".";
  },
};

// ── 6b. Accessing Properties ──
// Dot notation (most common):
console.log("Name (dot):", student.name);
console.log("Age  (dot):", student.age);

// Bracket notation (useful when key is dynamic or has spaces):
const key = "major";
console.log("Major (bracket):", student[key]);

// Calling a method:
console.log("Method:", student.introduce());

// ── 6c. Adding & Updating Properties ──
student.gpa = 3.9;                    // add new property
student.age = 22;                     // update existing property
console.log("After update — age:", student.age, "| gpa:", student.gpa);

// ── 6d. Deleting a Property ──
delete student.gpa;
console.log("After delete — gpa:", student.gpa); // undefined

// ── 6e. Checking if a property exists ──
console.log("Has 'name'?",     "name"  in student); // true
console.log("Has 'address'?",  "address" in student); // false

// ── 6f. Object.keys / Object.values / Object.entries ──
const person = { firstName: "Ada", lastName: "Lovelace", year: 1815 };

console.log("Object.keys():",    Object.keys(person));
// ["firstName", "lastName", "year"]

console.log("Object.values():",  Object.values(person));
// ["Ada", "Lovelace", 1815]

console.log("Object.entries():", Object.entries(person));
// [["firstName", "Ada"], ["lastName", "Lovelace"], ["year", 1815]]

// ── 6g. Destructuring (modern shorthand to extract properties) ──
const { firstName, lastName } = person;
console.log("Destructured:", firstName, lastName); // Ada Lovelace

// ── 6h. Spread operator (shallow copy / merge objects) ──
const original  = { a: 1, b: 2 };
const copy      = { ...original, c: 3 };
console.log("Spread copy:", copy); // { a: 1, b: 2, c: 3 }

// ── 6i. Array of Objects (common real-world pattern) ──
const team = [
  { id: 1, name: "Alice",   role: "Frontend" },
  { id: 2, name: "Bob",     role: "Backend"  },
  { id: 3, name: "Charlie", role: "DevOps"   },
];

// Find a specific member using find()
const backend = team.find(function (member) {
  return member.role === "Backend";
});
console.log("Backend developer:", backend.name); // Bob

// Map to get just the names
const names = team.map(function (member) { return member.name; });
console.log("Team names:", names.join(", ")); // Alice, Bob, Charlie

console.log("\n====================================================");
console.log("  End of concepts.js");
console.log("====================================================");
