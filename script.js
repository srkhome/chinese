// 字庫：國小三年級簡單字（筆畫數僅供參考，請根據實際標準調整）
const words = [
  { word: "要", strokes: 9 },
  { word: "靜", strokes: 14 },
  { word: "天", strokes: 4 },
  { word: "空", strokes: 8 },
  { word: "雲", strokes: 12 },
  { word: "水", strokes: 4 },
  { word: "蟲", strokes: 16 },
  { word: "鳥", strokes: 11 },
  { word: "草", strokes: 12 },
  { word: "先", strokes: 3 },
  { word: "完", strokes: 5 },
  { word: "再", strokes: 3 },
  { word: "去", strokes: 5 },
  { word: "園", strokes: 13 },
  { word: "聽", strokes: 14 },
  { word: "沒", strokes: 7 },
  { word: "正", strokes: 5 },
  { word: "唱", strokes: 12 },
  { word: "著", strokes: 11 },
  { word: "輕", strokes: 14 },
  { word: "快", strokes: 7 },
  { word: "歌", strokes: 14 },
  { word: "出", strokes: 5 },
  { word: "新", strokes: 13 },
  { word: "芽", strokes: 8 },
  { word: "聞", strokes: 14 },
  { word: "身", strokes: 7 },
  { word: "香", strokes: 9 },
  { word: "呢", strokes: 7 }
];

let currentWord = null;
let userStrokes = 0;

// 取得 HTML 元素
const charDisplay = document.getElementById("character");
const drawArea = document.getElementById("drawArea");
const submitBtn = document.getElementById("submit");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next");

// 初始化畫布
const ctx = drawArea.getContext("2d");
drawArea.width = 200;
drawArea.height = 200;

// 控制變數
let drawing = false;
let lastX, lastY;

// 處理滑鼠事件：用線段連接每個座標，形成連續線
drawArea.addEventListener("mousedown", (e) => {
  drawing = true;
  userStrokes++; // 開始一個新筆劃
  lastX = e.offsetX;
  lastY = e.offsetY;
});
drawArea.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
  lastX = e.offsetX;
  lastY = e.offsetY;
});
drawArea.addEventListener("mouseup", () => {
  drawing = false;
});

// 處理觸控事件（連續畫線，使用 { passive: false } 以確保 preventDefault 生效）
drawArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  userStrokes++; // 開始新筆劃
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
}, { passive: false });

drawArea.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
  lastX = x;
  lastY = y;
}, { passive: false });

drawArea.addEventListener("touchend", (e) => {
  e.preventDefault();
  drawing = false;
}, { passive: false });

// 全域攔截 touchmove，避免頁面捲動
document.addEventListener("touchmove", function(e) {
  if (e.target === drawArea) {
    e.preventDefault();
  }
}, { passive: false });

// 開始新題目
function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  charDisplay.textContent = currentWord.word;
  userStrokes = 0;
  feedback.textContent = "";
  ctx.clearRect(0, 0, drawArea.width, drawArea.height);
}

// 提交答案
submitBtn.addEventListener("click", () => {
  if (userStrokes === currentWord.strokes) {
    feedback.textContent = "正確！";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `錯誤，正確筆畫數是 ${currentWord.strokes} 畫`;
    feedback.style.color = "red";
  }
});

// 下一題
nextBtn.addEventListener("click", startGame);

// 啟動遊戲
startGame();
