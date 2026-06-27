// ============================================================
//  Quiz App — script.js
//  Concepts demonstrated:
//    ✅ Objects (each question is an object)
//    ✅ Arrays (questions array, iteration with forEach / index)
//    ✅ DOM manipulation (show/hide screens, build options)
//    ✅ Event listeners (click events on dynamic elements)
//    ✅ Scope (quiz state variables scoped at module level)
//    ✅ Closures (option-click handlers capture question data)
//    ✅ Promises / async-await (fake "loading" before results)
// ============================================================


// ─── 1. QUESTIONS DATA (Array of Objects) ───────────────────
// Each question is an OBJECT with:
//   question : string
//   options  : array of 4 strings
//   answer   : index (0-3) of the correct option
//   explain  : brief explanation shown after answering
const questions = [
  {
    question: "What does 'var' keyword use for scoping in JavaScript?",
    options: [
      "Block scope",
      "Module scope",
      "Function scope",
      "Global scope only",
    ],
    answer: 2,
    explain: "'var' is function-scoped, meaning it is accessible anywhere inside the function it was declared in, regardless of block boundaries like if-statements or loops.",
  },
  {
    question: "Which of the following is an example of a closure?",
    options: [
      "A function that calls itself recursively",
      "A function that returns another function accessing the outer function's variable",
      "A function with no return value",
      "An arrow function with no parameters",
    ],
    answer: 1,
    explain: "A closure is formed when an inner function 'closes over' variables from its outer function's scope, remembering them even after the outer function has finished.",
  },
  {
    question: "What is 'hoisting' in JavaScript?",
    options: [
      "Moving HTML elements to the top of the page",
      "Pushing array elements to the start",
      "JS engine moving declarations to the top of their scope before execution",
      "Converting a variable from local to global",
    ],
    answer: 2,
    explain: "Before running code, the JavaScript engine 'hoists' (moves) variable and function declarations to the top of their scope. This is why you can call a function before you define it.",
  },
  {
    question: "What does a Promise represent in JavaScript?",
    options: [
      "A guarantee that code will never throw an error",
      "A synchronous function that blocks the thread",
      "A placeholder for a value that will be available in the future",
      "A special type of object only used in Node.js",
    ],
    answer: 2,
    explain: "A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It is in one of three states: pending, fulfilled, or rejected.",
  },
  {
    question: "What will console.log(typeof null) print?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: 2,
    explain: "This is a well-known JavaScript bug that has existed since the beginning. 'typeof null' returns 'object' even though null is not an object. It's kept for backwards compatibility.",
  },
  {
    question: "Which array method returns a NEW array with only the elements that pass a test?",
    options: ["map()", "forEach()", "filter()", "reduce()"],
    answer: 2,
    explain: "filter() returns a new array containing all elements for which the callback function returns true. It does not mutate the original array.",
  },
  {
    question: "What is the output of: console.log(1 + '2')?",
    options: ["3", "'12'", "NaN", "TypeError"],
    answer: 1,
    explain: "JavaScript uses 'type coercion'. When you add a number and a string, it converts the number to a string and concatenates them, giving '12'.",
  },
  {
    question: "What keyword is used to declare a block-scoped variable that CAN be reassigned?",
    options: ["var", "let", "const", "block"],
    answer: 1,
    explain: "'let' creates a block-scoped variable that can be reassigned. 'const' is also block-scoped but cannot be reassigned. 'var' is function-scoped.",
  },
  {
    question: "Which method is used to attach a function to run AFTER a Promise resolves successfully?",
    options: [".catch()", ".finally()", ".then()", ".resolve()"],
    answer: 2,
    explain: ".then() is chained on a Promise to specify what to do when the Promise fulfills (resolves successfully). .catch() handles rejections.",
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Data Object Model",
      "Document Object Model",
      "Dynamic Object Manager",
      "Document Ordering Mechanism",
    ],
    answer: 1,
    explain: "DOM stands for Document Object Model. It is a tree-like representation of the HTML document that JavaScript can read and manipulate.",
  },
];


// ─── 2. QUIZ STATE ──────────────────────────────────────────
// These variables track the current state of the quiz.
// They live at the top (module) scope — accessible by all functions below.
let currentIndex = 0;    // which question we're on
let score        = 0;    // number of correct answers
let answered     = false; // has the user answered the current question?


// ─── 3. DOM REFERENCES ──────────────────────────────────────
const startScreen    = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen   = document.getElementById("result-screen");

const progressBar    = document.getElementById("progress-bar");
const progressText   = document.getElementById("progress-text");
const questionText   = document.getElementById("question-text");
const optionsList    = document.getElementById("options-list");
const feedbackDiv    = document.getElementById("feedback");
const feedbackMsg    = document.getElementById("feedback-msg");
const feedbackExplain= document.getElementById("feedback-explain");
const btnNext        = document.getElementById("btn-next");

const btnStart       = document.getElementById("btn-start");
const btnRestart     = document.getElementById("btn-restart");

const scoreFraction  = document.getElementById("score-fraction");
const scorePercent   = document.getElementById("score-percent");
const resultMsg      = document.getElementById("result-msg");
const resultEmoji    = document.getElementById("result-emoji");
const bdCorrect      = document.getElementById("bd-correct");
const bdWrong        = document.getElementById("bd-wrong");


// ─── 4. SCREEN HELPER ───────────────────────────────────────
// Shows one screen and hides all others
function showScreen(screenEl) {
  // NodeList of all screens — we hide everything first
  const allScreens = document.querySelectorAll(".screen");
  allScreens.forEach(function (s) {
    s.classList.remove("active");
  });
  screenEl.classList.add("active");
}


// ─── 5. RENDER QUESTION ─────────────────────────────────────
function renderQuestion() {
  answered = false; // reset for this question

  const q = questions[currentIndex]; // get the current question object

  // Update progress
  const questionNumber = currentIndex + 1;
  const total          = questions.length;
  progressText.textContent = `Question ${questionNumber} of ${total}`;
  progressBar.style.width  = ((questionNumber / total) * 100) + "%";

  // Set question text
  questionText.textContent = q.question;

  // Clear previous options and feedback
  optionsList.innerHTML = "";
  feedbackDiv.classList.add("hidden");
  btnNext.classList.add("hidden");

  // Build one <li><button> for each option
  // CLOSURE: the event handler captures `q` and `index` from this scope
  q.options.forEach(function (optionText, index) {
    const li  = document.createElement("li");
    const btn = document.createElement("button");

    btn.className   = "option-btn";
    btn.textContent = optionText;

    // When clicked, check the answer
    btn.addEventListener("click", function () {
      // q.answer is the correct index; index is what was clicked
      checkAnswer(index, q.answer, q.explain);
    });

    li.appendChild(btn);
    optionsList.appendChild(li);
  });
}


// ─── 6. CHECK ANSWER ────────────────────────────────────────
function checkAnswer(selectedIndex, correctIndex, explanation) {
  if (answered) return; // prevent double-clicking
  answered = true;

  const isCorrect = selectedIndex === correctIndex;
  if (isCorrect) score++;

  // Get all option buttons to apply visual feedback
  const optionBtns = optionsList.querySelectorAll(".option-btn");

  optionBtns.forEach(function (btn, i) {
    btn.disabled = true; // disable all buttons after answer

    if (i === correctIndex) {
      btn.classList.add("correct"); // always highlight correct answer
    }
    if (i === selectedIndex && !isCorrect) {
      btn.classList.add("wrong");   // highlight wrong choice in red
    }
  });

  // Show feedback
  feedbackDiv.classList.remove("hidden");

  if (isCorrect) {
    feedbackMsg.textContent = "✅ Correct!";
    feedbackMsg.className   = "feedback-msg correct";
  } else {
    feedbackMsg.textContent = "❌ Incorrect";
    feedbackMsg.className   = "feedback-msg wrong";
  }

  feedbackExplain.textContent = explanation;

  // Change Next button label on last question
  const isLastQuestion = currentIndex === questions.length - 1;
  btnNext.textContent = isLastQuestion ? "See Results" : "Next →";
  btnNext.classList.remove("hidden");
}


// ─── 7. NEXT QUESTION / SHOW RESULTS ────────────────────────
btnNext.addEventListener("click", function () {
  currentIndex++;

  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    // Use a Promise + async/await to simulate a brief "calculating" delay
    showResults();
  }
});


// ─── 8. SHOW RESULTS (uses async/await + Promise) ───────────
// PROMISE EXAMPLE:
// wait() returns a Promise that resolves after `ms` milliseconds.
// This simulates what you'd do with a real API call.
function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// async functions always return a Promise.
// Inside them, `await` pauses execution until the awaited Promise resolves.
async function showResults() {
  // First show a quick "loading" state on the Next button
  btnNext.textContent = "Calculating...";
  btnNext.disabled    = true;

  // AWAIT: pause here for 800ms before showing results
  await wait(800);

  // Now show the result screen
  showScreen(resultScreen);

  const total      = questions.length;
  const percentage = Math.round((score / total) * 100);
  const wrong      = total - score;

  scoreFraction.textContent = score + "/" + total;
  scorePercent.textContent  = percentage + "%";
  bdCorrect.textContent     = score;
  bdWrong.textContent       = wrong;

  // Dynamic message based on score
  if (percentage === 100) {
    resultEmoji.textContent = "🏆";
    resultMsg.textContent   = "Perfect score! You're a JavaScript master!";
  } else if (percentage >= 70) {
    resultEmoji.textContent = "🎉";
    resultMsg.textContent   = "Great job! You have a solid understanding of JS fundamentals.";
  } else if (percentage >= 50) {
    resultEmoji.textContent = "👍";
    resultMsg.textContent   = "Not bad! Review the topics you got wrong and try again.";
  } else {
    resultEmoji.textContent = "📚";
    resultMsg.textContent   = "Keep studying! JavaScript fundamentals take practice.";
  }
}


// ─── 9. START / RESTART ─────────────────────────────────────
function startQuiz() {
  // Reset state
  currentIndex = 0;
  score        = 0;
  answered     = false;

  // Re-enable next button (in case it was disabled)
  btnNext.disabled = false;

  showScreen(questionScreen);
  renderQuestion();
}

btnStart.addEventListener("click", startQuiz);
btnRestart.addEventListener("click", startQuiz);
