const quizQuestions = [
  {
    question: "Which principle is NOT part of SOLID principles?",
    options: ["Single Responsibility", "Open/Closed", "Inheritance Reuse", "Dependency Inversion"],
    answer: 2
  },
  {
    question: "In the Factory Pattern, what gets separated?",
    options: ["Object creation from usage", "Data from UI", "Inheritance from Composition", "Class from Interface"],
    answer: 0
  },
  {
    question: "What is 'Polymorphism' in OOP?",
    options: ["Changing data types", "Same operation different forms", "Hiding data", "Adding new classes"],
    answer: 1
  },
  {
    question: "Which pattern ensures a class has only one instance?",
    options: ["Singleton", "Observer", "Decorator", "Adapter"],
    answer: 0
  },
  {
    question: "What does the Liskov Substitution Principle state?",
    options: ["Subtypes must be substitutable for base types", "Classes must inherit from multiple classes", "Private methods must stay hidden", "Always override methods"],
    answer: 0
  },
  {
    question: "Which pattern provides a simplified interface to a complex system?",
    options: ["Bridge", "Composite", "Facade", "Command"],
    answer: 2
  },
  {
    question: "Encapsulation is about:",
    options: ["Binding data and methods", "Splitting large classes", "Making methods public", "Copying properties"],
    answer: 0
  },
  {
    question: "Strategy pattern is used to:",
    options: ["Allow interchangeable algorithms", "Force one algorithm", "Hardcode rules", "Manage memory"],
    answer: 0
  },
  {
    question: "Which pattern converts the interface of a class into another interface clients expect?",
    options: ["Decorator", "Adapter", "Proxy", "Template"],
    answer: 1
  },
  {
    question: "Inheritance in OOP means:",
    options: ["One object controls another", "Classes share properties and methods", "Classes have multiple copies", "Creating multiple databases"],
    answer: 1
  },
  {
    question: "Observer Pattern is best for:",
    options: ["Static UIs", "One-time API calls", "Event-driven programming", "Database migrations"],
    answer: 2
  },
  {
    question: "Composition over Inheritance means:",
    options: ["Favoring building blocks over hierarchy", "Using deep class chains", "Avoiding all classes", "Only using interfaces"],
    answer: 0
  },
  {
    question: "Abstract Factory pattern helps in:",
    options: ["Creating families of related objects", "Hiding database queries", "Encrypting files", "Sorting algorithms"],
    answer: 0
  },
  {
    question: "Which OOP principle is about exposing only necessary parts?",
    options: ["Polymorphism", "Inheritance", "Abstraction", "Encapsulation"],
    answer: 2
  },
  {
    question: "Prototype pattern is based on:",
    options: ["Copying existing objects", "Creating new from scratch", "Updating class hierarchies", "Locking database rows"],
    answer: 0
  }
];

let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let timerInterval;
let totalTime = 15 * 60; // 15 minutes in seconds
let leaderboard = [];

const timerInner = document.getElementById('timer-inner');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const submitButton = document.getElementById('submit-btn');
const reviewSection = document.getElementById('review-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const leaderboardTable = document.getElementById('leaderboard');
const successAlert = document.getElementById('success-alert');
const quizContainer = document.getElementById('quiz-container');

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function startQuiz() {
  currentQuiz = [...quizQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentIndex = 0;
  score = 0;
  reviewSection.innerHTML = '';
  leaderboardSection.classList.add('hidden');
  successAlert.classList.add('hidden');
  document.getElementById('submit-confirm').classList.remove('hidden');
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const current = currentQuiz[currentIndex];
  questionElement.textContent = current.question;
  optionsElement.innerHTML = '';
  current.options.forEach((option, idx) => {
    const btn = document.createElement('button');
    btn.classList.add('option');
    btn.textContent = option;
    btn.addEventListener('click', () => selectAnswer(idx));
    optionsElement.appendChild(btn);
  });
}

function selectAnswer(selected) {
  const correct = currentQuiz[currentIndex].answer;
  const optionButtons = document.querySelectorAll('.option');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correct) {
      btn.classList.add('correct');
    }
    if (idx === selected && idx !== correct) {
      btn.classList.add('incorrect');
    }
  });
  if (selected === correct) score++;
}

submitButton.addEventListener('click', submitQuiz);

function submitQuiz() {
  const confirmBox = document.getElementById('confirm-submit');
  if (!confirmBox.checked) {
    alert('Please confirm before submitting.');
    return;
  }
  clearInterval(timerInterval);
  document.getElementById('submit-confirm').classList.add('hidden');
  showReview();
  updateLeaderboard();
  successAlert.classList.remove('hidden');
}

function showReview() {
  reviewSection.innerHTML = '<h3>Review:</h3>';
  currentQuiz.forEach((q, idx) => {
    const review = document.createElement('div');
    review.classList.add('review-question');
    review.innerHTML = `${idx + 1}. ${q.question} <br> Correct Answer: <span class="review-correct">${q.options[q.answer]}</span>`;
    reviewSection.appendChild(review);
  });
}

function updateLeaderboard() {
  leaderboard.push({ score: score, percentage: ((score / 5) * 100).toFixed(2) });
  leaderboardTable.innerHTML = `
    <tr><th>Score</th><th>Percentage</th></tr>
    ${leaderboard.map(entry => `<tr><td>${entry.score}</td><td>${entry.percentage}%</td></tr>`).join('')}
  `;
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = totalTime;
  timerInner.style.animationDuration = `${totalTime}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Time\'s up! Submitting quiz.');
      submitQuiz();
    }
  }, 1000);
}

// Show leaderboard button
document.getElementById('show-leaderboard').addEventListener('click', () => {
  leaderboardSection.classList.toggle('hidden');
});

// Retake button
document.getElementById('retake-btn').addEventListener('click', startQuiz);

startQuiz();
      
