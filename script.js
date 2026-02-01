/* ===== PAGE NAVIGATION SYSTEM ===== */
function showPage(pageId) {
  // Hide all pages
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show requested page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    // Scroll to top
    window.scrollTo(0, 0);
  } else {
    console.error("Page not found:", pageId);
  }
  
  // Handle page-specific setups
  if (pageId === 'game1Page') {
    setTimeout(startGame1, 100);
  } else if (pageId === 'mazePage') {
    setTimeout(initMazeGame, 100);
  } else if (pageId === 'daysPage') {
    setTimeout(() => showDay(1), 100);
  } else if (pageId === 'riddlePage') {
    setTimeout(initRiddleGame, 100);
  } else if (pageId === 'matchPage') {
    setTimeout(initMatchingGame, 100);
  } else if (pageId === 'finalPage') {
    setTimeout(createHeartRain, 100);
  }
}

/* ===== START PAGE ===== */
document.getElementById("startBtn").onclick = () => {
  showPage("questionPage");
};

/* ===== QUESTION PAGE ===== */
document.getElementById("yesBtn").onclick = () => {
  showPage("transition1");
  setTimeout(() => {
    showPage("game1Page");
  }, 4500);
};

document.getElementById("noBtn").onmouseover = () => {
  const noBtn = document.getElementById("noBtn");
  noBtn.style.left = Math.random() * 70 + "vw";
  noBtn.style.top = Math.random() * 50 + "vh";
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

function startGame1() {
  const gameArea = document.getElementById("gameArea");
  const complimentBox = document.getElementById("compliment");
  heartIndex = 0;
  gameArea.innerHTML = "";
  complimentBox.style.opacity = "0";
  
  function spawnHeart() {
    if (heartIndex >= compliments.length) {
      setTimeout(() => {
        showPage("transition2");
        setTimeout(() => {
          showPage("mazePage");
        }, 4000);
      }, 1500);
      return;
    }

    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 85 + "vw";
    heart.style.top = Math.random() * 70 + "vh";
    
    heart.addEventListener('click', function handleClick() {
      complimentBox.textContent = compliments[heartIndex];
      complimentBox.style.opacity = "1";
      
      heart.style.animation = 'none';
      heart.style.transform = 'scale(2)';
      heart.style.opacity = '0';
      
      setTimeout(() => {
        complimentBox.style.opacity = "0";
        heart.remove();
        heartIndex++;
        spawnHeart();
      }, 1000);
      
      heart.removeEventListener('click', handleClick);
    });
    
    gameArea.appendChild(heart);
  }
  
  spawnHeart();
}

/* ===== GAME 2: MAZE ===== */
let mazeCtx, player = { x: 1, y: 1 }, end = { x: 13, y: 11 };
const cellSize = 30;
let mazeWalls = [];

function initMazeGame() {
  const mazeCanvas = document.getElementById("mazeCanvas");
  mazeCanvas.width = 500;
  mazeCanvas.height = 400;
  mazeCtx = mazeCanvas.getContext("2d");
  
  // Maze layout
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
  
  player = { x: 1, y: 1 };
  
  // Mobile controls
  document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => movePlayer(btn.dataset.direction));
  });
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if ([37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
      const dir = {37:'left',38:'up',39:'right',40:'down'}[e.keyCode];
      movePlayer(dir);
    }
  });
  
  drawMaze();
}

function drawMaze() {
  mazeCtx.clearRect(0, 0, 500, 400);
  
  // Draw walls
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
  mazeCtx.arc(end.x * cellSize + cellSize/2, end.y * cellSize + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2);
  mazeCtx.fill();
  mazeCtx.fillStyle = 'white';
  mazeCtx.font = '16px Pacifico';
  mazeCtx.textAlign = 'center';
  mazeCtx.textBaseline = 'middle';
  mazeCtx.fillText('K', end.x * cellSize + cellSize/2, end.y * cellSize + cellSize/2);
  
  // Draw player (Mitthi)
  mazeCtx.fillStyle = '#ff4d6d';
  mazeCtx.beginPath();
  mazeCtx.arc(player.x * cellSize + cellSize/2, player.y * cellSize + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2);
  mazeCtx.fill();
  mazeCtx.fillStyle = 'white';
  mazeCtx.fillText('M', player.x * cellSize + cellSize/2, player.y * cellSize + cellSize/2);
}

function movePlayer(direction) {
  let newX = player.x, newY = player.y;
  if (direction === 'up') newY--;
  else if (direction === 'down') newY++;
  else if (direction === 'left') newX--;
  else if (direction === 'right') newX++;
  
  if (mazeWalls[newY] && mazeWalls[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    
    if (player.x === end.x && player.y === end.y) {
      winMazeGame();
    }
  }
}

function winMazeGame() {
  document.getElementById("mazeMessage").textContent = "No matter the maze, I'll always find you ❤️";
  document.removeEventListener('keydown', () => {});
  
  // Shake effect
  const canvas = document.getElementById("mazeCanvas");
  canvas.style.animation = 'shake 0.5s';
  
  // Add shake animation
  if (!document.querySelector('#shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    canvas.style.animation = '';
    showPage("daysPage");
  }, 2000);
}

/* ===== DAYS 1-6 ===== */
const daysContent = [
  { day: 1, message: "Day 1: Every moment with you feels like magic ✨", photo: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
  { day: 2, message: "Day 2: You make ordinary days extraordinary 💖", photo: "https://images.unsplash.com/photo-1516487200032-8532cb603261?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
  { day: 3, message: "Day 3: Laughs, hugs, and love — my favorite trio 😊", photo: "https://images.unsplash.com/photo-1544717305-99670f9c28f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
  { day: 4, message: "Day 4: You are my calm in a chaotic world 🏡", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
  { day: 5, message: "Day 5: Life is sweeter with you 🍫💕", photo: "https://images.unsplash.com/photo-1529254479751-fbacb4c7a587?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
  { day: 6, message: "Day 6: My heart beats only for you ❤️", photo: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
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
    document.getElementById("prevDayBtn").style.display = dayNum === 1 ? "none" : "inline-block";
    document.getElementById("nextDayBtn").textContent = dayNum === 6 ? "Our Song →" : "Next →";
  }
}

window.revealPhoto = function(imgElement) {
  imgElement.classList.add("revealed");
};

document.getElementById("prevDayBtn").onclick = () => {
  if (currentDay > 1) showDay(currentDay - 1);
};

document.getElementById("nextDayBtn").onclick = () => {
  if (currentDay === 6) {
    showPage("songPage");
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
    song.play().then(() => {
      record.classList.add("spinning");
      needle.classList.add("playing");
      btn.textContent = "Pause Song";
    }).catch(e => {
      console.log("Autoplay prevented:", e);
      btn.textContent = "Click to Play";
    });
  } else {
    song.pause();
    record.classList.remove("spinning");
    needle.classList.remove("playing");
    btn.textContent = "Play 'Perfect' by Ed Sheeran";
  }
};

document.getElementById("continueFromSongBtn").onclick = () => {
  const song = document.getElementById("valentineSong");
  song.pause();
  song.currentTime = 0;
  document.getElementById("record").classList.remove("spinning");
  document.querySelector(".needle").classList.remove("playing");
  document.getElementById("playSongBtn").textContent = "Play 'Perfect' by Ed Sheeran";
  
  showPage("transition3");
  setTimeout(() => showPage("riddlePage"), 4000);
};

/* ===== GAME 3: RIDDLES ===== */
const riddles = [
  { question: "I start with a 'H', beat fast for you, what am I?", answer: "heart" },
  { question: "I am invisible but felt, I grow when you smile, what am I?", answer: "love" },
  { question: "I'm the place your name always lives in me. What am I?", answer: "mind" },
  { question: "I travel from you to me in letters and notes. What am I?", answer: "message" },
  { question: "I sparkle when you laugh, shine when you smile. What am I?", answer: "joy" },
  { question: "I am the tie that binds two souls together. What am I?", answer: "bond" },
  { question: "I am what I feel for you every day. What am I?", answer: "love" }
];

let currentRiddle = 0;

function initRiddleGame() {
  currentRiddle = 0;
  document.querySelector(".progress-fill").style.width = "0%";
  loadRiddle();
  
  document.getElementById("submitAnswerBtn").onclick = checkAnswer;
  document.getElementById("answerInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
}

function loadRiddle() {
  document.getElementById("riddleDisplay").textContent = riddles[currentRiddle].question;
  document.getElementById("answerInput").value = "";
  document.getElementById("riddleCounter").textContent = `Riddle ${currentRiddle + 1}/${riddles.length}`;
  document.getElementById("answerInput").focus();
}

function checkAnswer() {
  const answer = document.getElementById("answerInput").value.trim().toLowerCase();
  const correct = riddles[currentRiddle].answer.toLowerCase();
  
  if (answer === correct) {
    currentRiddle++;
    const progress = (currentRiddle / riddles.length) * 100;
    document.querySelector(".progress-fill").style.width = `${progress}%`;
    
    if (currentRiddle >= riddles.length) {
      setTimeout(() => {
        showPage("transition4");
        setTimeout(() => showPage("matchPage"), 4000);
      }, 800);
    } else {
      setTimeout(loadRiddle, 800);
    }
  } else {
    document.getElementById("answerInput").style.borderColor = "#ff0000";
    setTimeout(() => {
      document.getElementById("answerInput").style.borderColor = "#ff85a1";
    }, 500);
  }
}

/* ===== GAME 4: MATCHING ===== */
let firstCard = null, secondCard = null, lockBoard = false, matches = 0;

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
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  document.getElementById("matchScore").textContent = "Matches: 0/5";
  
  const shuffled = [...cardPairs].sort(() => Math.random() - 0.5);
  
  shuffled.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "match-card";
    cardEl.dataset.id = card.id;
    cardEl.dataset.matchId = card.matchId;
    cardEl.innerHTML = `
      <div class="card-back">?</div>
      <div class="card-front">${card.content}</div>
    `;
    cardEl.addEventListener('click', () => flipCard(cardEl));
    matchGrid.appendChild(cardEl);
  });
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  lockBoard = true;
  
  const isMatch = firstCard.dataset.matchId === secondCard.dataset.matchId;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matches++;
  document.getElementById("matchScore").textContent = `Matches: ${matches}/5`;
  
  if (matches === 5) {
    setTimeout(() => {
      showPage("transition5");
      setTimeout(() => showPage("day7Page"), 4000);
    }, 1000);
  }
  
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

/* ===== DAY 7 ===== */
document.getElementById("day7Photo").addEventListener('click', function() {
  this.classList.add("revealed");
  this.nextElementSibling.style.display = "none";
});

document.getElementById("toFinalBtn").onclick = () => {
  showPage("finalPage");
};

/* ===== FINAL PAGE ===== */
function createHeartRain() {
  const heartRain = document.querySelector(".heart-rain");
  heartRain.innerHTML = "";
  
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = "-50px";
    heart.style.fontSize = (Math.random() * 30 + 20) + "px";
    heart.style.color = "#ff4d6d";
    heart.style.opacity = "0.7";
    heart.style.animation = `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`;
    
    heartRain.appendChild(heart);
  }
  
  if (!document.querySelector('#fall-style')) {
    const style = document.createElement('style');
    style.id = 'fall-style';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ===== INITIALIZE ===== */
document.addEventListener('DOMContentLoaded', () => {
  showPage('startPage');
});
