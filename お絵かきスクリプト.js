const quizThemes = [
  "ケーキ", "りんご", "パン", "おにぎり", "アイス",
  "くま", "ねこ", "いぬ", "うさぎ", "ぞう",
  "カフェラテ", "ジュース", "おちゃ", "ココア", "ミルク"
];
let selectedTheme = "";

const drawerTimeLimit = 60;
const guesserTimeLimit = 30;
let timer;

// キャンバスと色設定
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById("color-picker");
ctx.strokeStyle = colorPicker.value;

colorPicker.addEventListener("input", () => {
  ctx.strokeStyle = colorPicker.value;
});

// ランダムお題取得
function getRandomTheme(exclude = "") {
  let newTheme;
  do {
    newTheme = quizThemes[Math.floor(Math.random() * quizThemes.length)];
  } while (newTheme === exclude);
  return newTheme;
}

// タイマー開始
function startTimer(seconds, onTimeout) {
  let time = seconds;
  const timeDisplay = document.getElementById("time");
  timeDisplay.textContent = time;
  timeDisplay.style.color = "#5c4b3b";

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;

    if (time <= 10) {
      timeDisplay.style.color = "#d94f4f";
    }

    if (time <= 0) {
      clearInterval(timer);
      onTimeout();
    }
  }, 1000);
}

// 役割切り替え
function setRole(role) {
  clearInterval(timer);
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("time").style.color = "#5c4b3b";

  if (role === "drawer") {
    selectedTheme = getRandomTheme();
    document.getElementById("theme-text").textContent = selectedTheme;
    document.getElementById("drawer-ui").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";

    startTimer(drawerTimeLimit, () => {
      alert("描く時間が終了しました！");
    });

  } else if (role === "guesser") {
    document.getElementById("drawer-ui").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    startTimer(guesserTimeLimit, () => {
      document.getElementById("result").textContent = "時間切れ…！";
      document.getElementById("submit-btn").disabled = true;
    });
  }
}

// 新しいお題ボタン
document.getElementById("new-theme-btn").addEventListener("click", () => {
  const newTheme = getRandomTheme(selectedTheme);
  selectedTheme = newTheme;
  document.getElementById("theme-text").textContent = selectedTheme;
});

// 答え判定
document.getElementById("submit-btn").addEventListener("click", () => {
  const userAnswer = document.getElementById("answer-input").value.trim();
  if (userAnswer === selectedTheme) {
    document.getElementById("result").textContent = "正解！🎉";
  } else {
    document.getElementById("result").textContent = "ざんねん…もう一度考えてみてね！";
  }
});

// 描画処理（PC & スマホ対応）
let drawing = false;

function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  } else {
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  }
}

function startDrawing(e) {
  drawing = true;
  const { x, y } = getCanvasCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!drawing) return;
  const { x, y } = getCanvasCoordinates(e);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
}

// PCイベント
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// スマホイベント
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener('touchend', stopDrawing);

// リセットボタン
document.getElementById("resetButton").addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
