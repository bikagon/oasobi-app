const quizThemes = ["ケーキ", "りんご", "パン", "おにぎり", "アイス","くま", "ねこ", "いぬ", "うさぎ", "ぞう","カフェラテ", "ジュース", "おちゃ", "ココア", "ミルク"]
let selectedTheme = "";

const drawerTimeLimit = 60;   // 描く人の制限時間（秒）
const guesserTimeLimit = 30;  // 答える人の制限時間（秒）
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
  timeDisplay.style.color = "#5c4b3b"; // 初期色

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;

    if (time <= 10) {
      timeDisplay.style.color = "#d94f4f"; // 注意色
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

// 描画処理
let drawing = false;

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
});

canvas.addEventListener('mouseleave', () => {
  drawing = false;
});

// リセットボタン
document.getElementById("resetButton").addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
