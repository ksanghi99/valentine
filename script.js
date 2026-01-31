/* ===== PAGE REFERENCES ===== */
const pages = {
  start: document.getElementById("startPage"),
  question: document.getElementById("questionPage"),
  transition1: document.getElementById("transition1"),
  game1: document.getElementById("game1Page"),
  transition2: document.getElementById("transition2"),
  maze: document.getElementById("mazePage"),
  days: document.getElementById("daysPage"),
  song: document.getElementById("songPage"),
  transition3: document.getElementById("transition3"),
  riddle: document.getElementById("riddlePage"),
  transition4: document.getElementById("transition4"),
  match: document.getElementById("matchPage"),
  transition5: document.getElementById("transition5"),
  day7: document.getElementById("day7Page"),
  final: document.getElementById("finalPage")
};

/* ===== NAVIGATION FUNCTION ===== */
function showPage(pageId) {
  // Hide all pages
  Object.values(pages).forEach(page => {
    page.classList.remove("active");
  });
  
  // Show requested page
  pages[pageId].classList.add("active");
  
  // Handle page-specific setups
  if (pageId === 'game1') {
    startGame1();
  } else if (pageId === 'maze') {
    setTimeout(initMazeGame, 100);
  } else if (pageId === 'days') {
    showDay(1);
  } else if (pageId === 'riddle') {
    initRiddleGame();
  } else if (pageId === 'match') {
    initMatchingGame();
  }
}

/* ===== BUTTON EVENT LISTENERS ===== */
document.getElementById("startBtn").onclick = () => {
  showPage("question");
};

document.getElementById("yesBtn").onclick = () => {
  showPage("transition1");
  setTimeout(() => {
    showPage("game1");
  }, 4500);
};

// Floating NO button
document.getElementById("noBtn").onmouseover = () => {
  const noBtn = document.getElementById("noBtn");
  noBtn.style.left = Math.random() * 80 + "vw";
  noBtn.style.top = Math.random() * 60 + "vh";
};

/* ===== GAME 1: 10 HEARTS ===== */
const compliments = [
  "You make my heart feel safe ❤️",
  "You are my favorite feeling 💕",
  "Life feels softer with you 🌸",
  "I smile more because of you 😊",
  "You are my calm in chaos ✨",
  "You feel like home 🏡",
  "I choose you every day 💖",
  "You are my happiness 💫",
  "My heart trusts you 💘",
  "It was always you ❤️"
];

let heartIndex = 0;
let gameArea, complimentBox;

function startGame1() {
  gameArea = document.getElementById("gameArea");
  complimentBox = document.getElementById("compliment");
  heartIndex = 0;
  gameArea.innerHTML = "";
  spawnHeart();
}

function spawnHeart() {
  if (heartIndex >= compliments.length) {
    setTimeout(() => {
      showPage("transition2");
      setTimeout(() => {
        showPage("maze");
      }, 4000);
    }, 1500);
    return;
  }

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = "❤️";
  heart.style.left = Math.random() * 80 + "vw";
  heart.style.top = Math.random() * 50 + "vh";
  gameArea.appendChild(heart);

  heart.onclick = () => {
    showCompliment(compliments[heartIndex]);
    heart.remove();
    heartIndex++;
    setTimeout(spawnHeart, 1200);
  };
}

function showCompliment(text) {
  complimentBox.innerText = text;
  complimentBox.style.opacity = "1";
  setTimeout(() => {
    complimentBox.style.opacity = "0";
  }, 1000);
}

/* ===== GAME 2: MAZE ===== */
let mazeCanvas, mazeCtx;
let player = { x: 1, y: 1 }; // Start position
let end = { x: 13, y: 11 }; // End position
const cellSize = 30;
let mazeWalls = [];

function initMazeGame() {
  mazeCanvas = document.getElementById("mazeCanvas");
  mazeCtx = mazeCanvas.getContext("2d");
  
  // Set canvas size
  mazeCanvas.width = 500;
  mazeCanvas.height = 400;
  
  // Define maze walls (1 = wall, 0 = path)
  mazeWalls = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];
  
  // Add mobile control listeners
  document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.direction;
      movePlayer(dir);
    });
  });
  
  // Add keyboard controls
  document.addEventListener('keydown', handleKeyPress);
  
  drawMaze();
}

function drawMaze() {
  mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  
  // Draw walls and paths
  for (let y = 0; y < mazeWalls.length; y++) {
    for (let x = 0; x < mazeWalls[y].length; x++) {
      if (mazeWalls[y][x] === 1) {
        mazeCtx.fillStyle = '#ffb3c6';
        mazeCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        mazeCtx.strokeStyle = '#ff4d6d';
        mazeCtx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  
  // Draw end point (Krishna)
  mazeCtx.fillStyle = '#4cc9f0';
  mazeCtx.beginPath();
  mazeCtx.arc(
    end.x * cellSize + cellSize/2,
    end.y * cellSize + cellSize/2,
    cellSize/2 - 2,
    0,
    Math.PI * 2
  );
  mazeCtx.fill();
  mazeCtx.fillStyle = 'white';
  mazeCtx.font = '16px Pacifico';
  mazeCtx.textAlign = 'center';
  mazeCtx.textBaseline = 'middle';
  mazeCtx.fillText('K', end.x * cellSize + cellSize/2, end.y * cellSize + cellSize/2);
  
  // Draw player (Mitthi)
  mazeCtx.fillStyle = '#ff4d6d';
  mazeCtx.beginPath();
  mazeCtx.arc(
    player.x * cellSize + cellSize/2,
    player.y * cellSize + cellSize/2,
    cellSize/2 - 2,
    0,
    Math.PI * 2
  );
  mazeCtx.fill();
  mazeCtx.fillStyle = 'white';
  mazeCtx.font = '16px Pacifico';
  mazeCtx.fillText('M', player.x * cellSize + cellSize/2, player.y * cellSize + cellSize/2);
}

function handleKeyPress(e) {
  if ([37, 38, 39, 40].includes(e.keyCode)) {
    e.preventDefault();
    const dir = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }[e.keyCode];
    movePlayer(dir);
  }
}

function movePlayer(direction) {
  let newX = player.x;
  let newY = player.y;
  
  switch(direction) {
    case 'up': newY--; break;
    case 'down': newY++; break;
    case 'left': newX--; break;
    case 'right': newX++; break;
  }
  
  // Check if move is valid (not a wall)
  if (mazeWalls[newY] && mazeWalls[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    
    // Check if reached end
    if (player.x === end.x && player.y === end.y) {
      winMazeGame();
    }
  }
}

function winMazeGame() {
  document.removeEventListener('keydown', handleKeyPress);
  document.getElementById("mazeMessage").innerText = "No matter the maze, I'll always find you ❤️";
  
  // Screen shake effect
  mazeCanvas.style.animation = 'shake 0.5s';
  setTimeout(() => {
    mazeCanvas.style.animation = '';
  }, 500);
  
  setTimeout(() => {
    showPage("days");
  }, 3000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

/* ===== DAYS 1-6 ===== */
const daysContent = [
  {
    day: 1,
    message: "Day 1: Every moment with you feels like magic ✨",
    photo: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    day: 2,
    message: "Day 2: You make ordinary days extraordinary 💖",
    photo: "https://images.unsplash.com/photo-1516487200032-8532cb603261?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    day: 3,
    message: "Day 3: Laughs, hugs, and love — my favorite trio 😊",
    photo: "https://images.unsplash.com/photo-1544717305-99670f9c28f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    day: 4,
    message: "Day 4: You are my calm in a chaotic world 🏡",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    day: 5,
    message: "Day 5: Life is sweeter with you 🍫💕",
    photo: "https://images.unsplash.com/photo-1529254479751-fbacb4c7a587?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    day: 6,
    message: "Day 6: My heart beats only for you ❤️"
  }
];

let currentDay = 1;

function showDay(dayNum) {
  currentDay = dayNum;
  const dayContent = document.getElementById("dayContent");
  const dayCounter = document.getElementById("dayCounter");
  
  if (dayNum >= 1 && dayNum <= 6) {
    const dayData = daysContent[dayNum - 1];
    
    let photoHTML = '';
    if (dayData.photo) {
      photoHTML = `
        <div class="photo-container">
          <img src="${dayData.photo}" alt="Day ${dayNum}" class="blur-photo" onclick="revealPhoto(this)">
          <p class="reveal-instruction">Click to reveal</p>
        </div>
      `;
    }
    
    dayContent.innerHTML = `
      <div class="day-card">
        <div class="day-number">Day ${dayNum}</div>
        <div class="day-message">${dayData.message}</div>
        ${photoHTML}
      </div>
    `;
    
    dayCounter.textContent = `Day ${dayNum} of 7`;
    
    // Show/hide navigation buttons
    document.getElementById("prevDayBtn").style.display = dayNum === 1 ? "none" : "block";
    
    if (dayNum === 6) {
      document.getElementById("nextDayBtn").textContent = "Our Song →";
    } else {
      document.getElementById("nextDayBtn").textContent = "Next →";
    }
  } else if (dayNum === 7) {
    showPage("song");
  }
}

function revealPhoto(imgElement) {
  imgElement.classList.add("revealed");
  imgElement.parentElement.querySelector(".reveal-instruction").style.display = "none";
}

// Day navigation
document.getElementById("prevDayBtn").onclick = () => {
  if (currentDay > 1) {
    showDay(currentDay - 1);
  }
};

document.getElementById("nextDayBtn").onclick = () => {
  if (currentDay === 6) {
    showPage("song");
  } else if (currentDay < 6) {
    showDay(currentDay + 1);
  }
};

/* ===== SONG PAGE ===== */
document.getElementById("playSongBtn").onclick = function() {
  const song = document.getElementById("valentineSong");
  const record = document.getElementById("record");
  const needle = document.querySelector(".needle");
  const btn = this;
  
  if (song.paused) {
    song.play();
    record.classList.add("spinning");
    needle.classList.add("playing");
    btn.textContent = "Pause Song";
  } else {
    song.pause();
    record.classList.remove("spinning");
    needle.classList.remove("playing");
    btn.textContent = "Play 'Perfect' by Ed Sheeran";
  }
};

document.getElementById("continueFromSongBtn").onclick = () => {
  showPage("transition3");
  setTimeout(() => {
    showPage("riddle");
  }, 4000);
};

/* ===== GAME 3: RIDDLES ===== */
const riddles = [
  {
    question: "I start with a 'H', beat fast for you, what am I?",
    answer: "heart"
  },
  {
    question: "I am invisible but felt, I grow when you smile, what am I?",
    answer: "love"
  },
  {
    question: "I'm the place your name always lives in me. What am I?",
    answer: "mind"
  },
  {
    question: "I travel from you to me in letters and notes. What am I?",
    answer: "message"
  },
  {
    question: "I sparkle when you laugh, shine when you smile. What am I?",
    answer: "joy"
  },
  {
    question: "I am the tie that binds two souls together. What am I?",
    answer: "bond"
  },
  {
    question: "I am what I feel for you every day. What am I?",
    answer: "love"
  }
];

let currentRiddle = 0;
let riddleScore = 0;

function initRiddleGame() {
  currentRiddle = 0;
  riddleScore = 0;
  loadRiddle();
  
  document.getElementById("submitAnswerBtn").onclick = checkAnswer;
  document.getElementById("answerInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
}

function loadRiddle() {
  document.getElementById("riddleDisplay").textContent = riddles[currentRiddle].question;
  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").focus();
  updateRiddleProgress();
}

function checkAnswer() {
  const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
  const correctAnswer = riddles[currentRiddle].answer.toLowerCase();
  
  if (userAnswer === correctAnswer) {
    riddleScore++;
    
    // Show success effect
    const riddleDisplay = document.getElementById("riddleDisplay");
    riddleDisplay.style.color = "#ff006e";
    riddleDisplay.style.transform = "scale(1.05)";
    setTimeout(() => {
      riddleDisplay.style.color = "#5a3d5c";
      riddleDisplay.style.transform = "scale(1)";
    }, 500);
    
    currentRiddle++;
    
    if (currentRiddle < riddles.length) {
      setTimeout(loadRiddle, 800);
    } else {
      // All riddles completed
      setTimeout(() => {
        showPage("transition4");
        setTimeout(() => {
          showPage("match");
        }, 4000);
      }, 1500);
    }
  } else {
    // Show error effect
    document.getElementById("answerInput").style.borderColor = "#ff0000";
    setTimeout(() => {
      document.getElementById("answerInput").style.borderColor = "#ff85a1";
    }, 500);
  }
  
  updateRiddleProgress();
}

function updateRiddleProgress() {
  const progress = ((currentRiddle + 1) / riddles.length) * 100;
  document.querySelector(".progress-fill").style.width = `${progress}%`;
  document.getElementById("riddleCounter").textContent = `Riddle ${currentRiddle + 1}/${riddles.length}`;
}

/* ===== GAME 4: MATCHING ===== */
let matchCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

const cardPairs = [
  { id: 1, content: "❤️", matchId: 1 },
  { id: 2, content: "💕", matchId: 2 },
  { id: 3, content: "💖", matchId: 3 },
  { id: 4, content: "💘", matchId: 4 },
  { id: 5, content: "💞", matchId: 5 },
  { id: 6, content: "❤️", matchId: 1 },
  { id: 7, content: "💕", matchId: 2 },
  { id: 8, content: "💖", matchId: 3 },
  { id: 9, content: "💘", matchId: 4 },
  { id: 10, content: "💞", matchId: 5 }
];

function initMatchingGame() {
  const matchGrid = document.getElementById("matchGrid");
  matchGrid.innerHTML = "";
  matchesFound = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  
  // Shuffle cards
  const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
  
  // Create card elements
  shuffledCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "match-card";
    cardElement.dataset.id = card.id;
    cardElement.dataset.matchId = card.matchId;
    cardElement.innerHTML = `<div class="card-back">?</div><div class="card-front">${card.content}</div>`;
    cardElement.onclick = () => flipCard(cardElement);
    matchGrid.appendChild(cardElement);
  });
  
  updateMatchScore();
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) {
    return;
  }
  
  card.classList.add("flipped");
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  lockBoard = true;
  
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.matchId === secondCard.dataset.matchId;
  
  if (isMatch) {
    disableCards();
    matchesFound++;
    updateMatchScore();
    
    if (matchesFound === 5) {
      setTimeout(() => {
        showPage("transition5");
        setTimeout(() => {
          showPage("day7");
        }, 4000);
      }, 1000);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateMatchScore() {
  document.getElementById("matchScore").textContent = `Matches: ${matchesFound}/5`;
}

/* ===== DAY 7 ===== */
document.getElementById("day7Photo").onclick = function() {
  this.classList.add("revealed");
  document.querySelector(".reveal-instruction").style.display = "none";
};

document.getElementById("toFinalBtn").onclick = () => {
  showPage("final");
  createHeartRain();
};

/* ===== FINAL PAGE HEART RAIN ===== */
function createHeartRain() {
  const heartRain = document.querySelector(".heart-rain");
  heartRain.innerHTML = "";
  
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = "-50px";
    heart.style.fontSize = Math.random() * 30 + 20 + "px";
    heart.style.color = "#ff4d6d";
    heart.style.opacity = "0.7";
    heart.style.animation = `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`;
    
    heartRain.appendChild(heart);
  }
  
  // Add fall animation
  const fallStyle = document.createElement("style");
  fallStyle.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(fallStyle);
}
