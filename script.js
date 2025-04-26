const quizData = [
  {
    question: "What does SOLID stand for?",
    options: ["Single Responsibility, Open-Closed, Liskov, Interface, Dependency", "Simple, Object, Layered, Interface, Domain"],
    answer: 0
  },
  {
    question: "What is a Singleton?",
    options: ["Pattern that ensures only one instance", "Pattern for event handling"],
    answer: 0
  },
  {
    question: "Which is NOT a design pattern?",
    options: ["Observer", "Transformer"],
    answer: 1
  },
  {
    question: "What principle promotes using composition over inheritance?",
    options: ["KISS", "Composition Over Inheritance"],
    answer: 1
  },
  {
    question: "What is Encapsulation?",
    options: ["Hiding internal details", "Exposing everything"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];
let timer;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timerInner = document.getElementById('timer-inner');
const submitBtn = document.getElementById('submit-btn');
const reviewSection = document.getElementById('review-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const leaderboardTable = document.getElementById('leaderboard');
const successAlert = document.getElementById('success-alert');

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswers = [];
  renderQuestion();
  startTimer();
  reviewSection.innerHTML = '';
  leaderboardSection.classList.add('hidden');
  successAlert.classList.add('hidden');
}

function startTimer() {
  clearInterval(timer);
  timerInner.style.animation = 'shrink 300s linear forwards'; // 5 min
  let timeLeft = 300;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

function renderQuestion() {
  const data = quizData[currentQuestion];
  questionEl.textContent = data.question;
  optionsEl.innerHTML = '';

  data.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option-btn';
    btn.onclick = () => selectOption(idx);
    optionsEl.appendChild(btn);
  });
}

function selectOption(index) {
  selectedAnswers[currentQuestion] = index;
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.remove('correct', 'incorrect');
    if (idx === index) {
      btn.classList.add('selected');
    }
  });
}

submitBtn.addEventListener('click', submitQuiz);

function submitQuiz() {
  clearInterval(timer);

  score = 0;
  optionsEl.innerHTML = '';
  questionEl.innerHTML = '';

  quizData.forEach((q, idx) => {
    const isCorrect = q.answer === selectedAnswers[idx];
    if (isCorrect) score++;
  });

  document.getElementById('submit-confirm').classList.add('hidden');
  successAlert.classList.remove('hidden');
  successAlert.textContent = `You scored ${score} / ${quizData.length}`;

  showReview();
  updateLeaderboard();
}

function showReview() {
  reviewSection.innerHTML = '<h3>Review:</h3>';

  quizData.forEach((q, idx) => {
    const div = document.createElement('div');
    div.classList.add('review-item');
    div.innerHTML = `
      <p><strong>Q${idx+1}: ${q.question}</strong></p>
      <p>Your Answer: ${q.options[selectedAnswers[idx]] ?? "No Answer"}</p>
      <p>Correct Answer: ${q.options[q.answer]}</p>
      <hr/>
    `;
    reviewSection.appendChild(div);
  });
}

function updateLeaderboard() {
  leaderboardSection.classList.remove('hidden');

  const name = prompt("Enter your name for the leaderboard:") || "Anonymous";

  const newEntry = { name, score };
  const existing = JSON.parse(localStorage.getItem('leaderboard')) || [];
  existing.push(newEntry);
  existing.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(existing));

  renderLeaderboard();
}

function renderLeaderboard() {
  const data = JSON.parse(localStorage.getItem('leaderboard')) || [];

  leaderboardTable.innerHTML = `
    <tr><th>Name</th><th>Score</th></tr>
  `;

  data.slice(0, 5).forEach(entry => {
    const row = leaderboardTable.insertRow();
    row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td>`;
  });
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

startQuiz();
    
