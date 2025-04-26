const questions = [
  {
    question: "What is encapsulation in OOP?",
    options: [
      "Binding data and methods together",
      "Breaking a program into modules",
      "Hiding code from the user",
      "Accessing variables globally"
    ],
    answer: "Binding data and methods together"
  },
  {
    question: "Which design pattern ensures a class has only one instance?",
    options: ["Observer", "Singleton", "Factory", "Strategy"],
    answer: "Singleton"
  },
  {
    question: "What is polymorphism?",
    options: [
      "Defining multiple classes with the same name",
      "Taking many forms",
      "Restricting access to methods",
      "None of the above"
    ],
    answer: "Taking many forms"
  },
  {
    question: "Factory pattern is used for?",
    options: ["Object creation", "Memory management", "Thread synchronization", "Logging"],
    answer: "Object creation"
  },
  {
    question: "What is an interface?",
    options: ["A concrete class", "An abstract class", "A class with only method signatures", "A library"],
    answer: "A class with only method signatures"
  },
  {
    question: "The main principle behind SOLID principles is?",
    options: ["Code reuse", "Maintainability", "Speed", "Testing"],
    answer: "Maintainability"
  },
  {
    question: "Which pattern provides a simplified interface to a complex subsystem?",
    options: ["Adapter", "Facade", "Decorator", "Proxy"],
    answer: "Facade"
  },
  {
    question: "Which pattern lets objects notify other objects about changes?",
    options: ["Decorator", "Observer", "Builder", "Command"],
    answer: "Observer"
  },
  {
    question: "Composition over inheritance promotes?",
    options: ["Flexibility", "Tight coupling", "Memory leaks", "Speed"],
    answer: "Flexibility"
  },
  {
    question: "In OOP, abstraction is?",
    options: [
      "Hiding implementation details",
      "Creating lots of classes",
      "Inheritance between classes",
      "Running multiple threads"
    ],
    answer: "Hiding implementation details"
  },
  {
    question: "Which principle is 'Open for extension, closed for modification'?",
    options: ["Liskov", "Open/Closed", "Interface Segregation", "Dependency Inversion"],
    answer: "Open/Closed"
  },
  {
    question: "Builder pattern is mainly used to?",
    options: ["Create complex objects", "Destroy objects", "Monitor objects", "Move objects"],
    answer: "Create complex objects"
  },
  {
    question: "Strategy pattern is for?",
    options: ["Changing algorithm behavior at runtime", "Saving memory", "Serializing objects", "Notifying objects"],
    answer: "Changing algorithm behavior at runtime"
  },
  {
    question: "Dependency Injection is a form of?",
    options: ["Composition", "Inheritance", "Overloading", "Recursion"],
    answer: "Composition"
  },
  {
    question: "What is the main advantage of Observer pattern?",
    options: ["Low coupling", "High coupling", "Speed", "Ease of access"],
    answer: "Low coupling"
  }
];

// Variables
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 900; // 15 minutes = 900 seconds
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// DOM Elements
const quizContainer = document.getElementById('quizContainer');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const resultContainer = document.getElementById('resultContainer');
const leaderboardContainer = document.getElementById('leaderboardContainer');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
const timerBar = document.getElementById('timerBar');
const timerText = document.getElementById('timerText');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
});

// Start Quiz
function startQuiz() {
  selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
  showQuestion();
  startTimer();
}

// Show Question
function showQuestion() {
  let q = selectedQuestions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <h4>${q.question}</h4>
    <div class="list-group mt-3">
      ${q.options.map(opt => `
        <button class="list-group-item list-group-item-action" onclick="selectAnswer(this, '${opt}')">${opt}</button>
      `).join('')}
    </div>
  `;
}

// Select Answer
function selectAnswer(button, selected) {
  const correct = selectedQuestions[currentQuestionIndex].answer;
  const allButtons = document.querySelectorAll('.list-group-item');

  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === selected) btn.classList.add('incorrect');
  });

  if (selected === correct) score++;
}

// Next Question
nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < selectedQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    if (currentQuestionIndex === selectedQuestions.length - 1) {
      nextBtn.classList.add('d-none');
      submitBtn.classList.remove('d-none');
    }
  }
});

// Submit Quiz
submitBtn.addEventListener('click', () => {
  clearInterval(timer);
  showResult();
});

// Show Result
function showResult() {
  const percentage = Math.round((score / selectedQuestions.length) * 100);
  resultContainer.classList.remove('d-none');
  resultContainer.innerHTML = `
    <h3>Your Score: ${score}/${selectedQuestions.length}</h3>
    <h4>Percentage: ${percentage}%</h4>
    <button class="btn btn-primary mt-3" onclick="reviewAnswers()">Review Answers</button>
  `;
  saveToLeaderboard(score, percentage);
}

// Review Answers
function reviewAnswers() {
  quizContainer.innerHTML = selectedQuestions.map((q, i) => `
    <div class="mb-3">
      <h5>Q${i+1}: ${q.question}</h5>
      <p><strong>Correct Answer:</strong> ${q.answer}</p>
    </div>
  `).join('');
  nextBtn.classList.add('d-none');
  submitBtn.classList.add('d-none');
}

// Start Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    timerText.textContent = `${mins}m ${secs}s`;
    timerBar.style.width = `${(timeLeft/900)*100}%`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitBtn.click();
    }
  }, 1000);
}

// Save Leaderboard
function saveToLeaderboard(score, percentage) {
  const username = prompt("Enter your name for the leaderboard:");
  leaderboard.push({ name: username || 'Anonymous', score, percentage });
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// View Leaderboard
viewLeaderboardBtn.addEventListener('click', () => {
  leaderboardContainer.classList.toggle('d-none');
  renderLeaderboard();
});

// Render Leaderboard
function renderLeaderboard() {
  leaderboardContainer.innerHTML = `
    <h4>Leaderboard</h4>
    <table class="table table-striped">
      <thead>
        <tr><th>Name</th><th>Score</th><th>Percentage</th></tr>
      </thead>
      <tbody>
        ${leaderboard.sort((a,b) => b.percentage - a.percentage).map(entry => `
          <tr><td>${entry.name}</td><td>${entry.score}</td><td>${entry.percentage}%</td></tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Initialize
startQuiz();
      
