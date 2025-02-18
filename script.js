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
let drawing = false;

// 共用的繪圖函數
function drawPoint(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

// 處理滑鼠事件
drawArea.addEventListener("mousedown", (e) => {
  drawing = true;
  userStrokes++; // 每次按下表示開始一筆
  drawPoint(e.offsetX, e.offsetY);
});
drawArea.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  drawPoint(e.offsetX, e.offsetY);
});
drawArea.addEventListener("mouseup", () => {
  drawing = false;
});

// 處理觸控事件（加入 {passive: false} 選項以確保 preventDefault 生效）
drawArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  userStrokes++; // 開始新筆劃
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  drawPoint(x, y);
}, { passive: false });

drawArea.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  drawPoint(x, y);
}, { passive: false });

drawArea.addEventListener("touchend", (e) => {
  e.preventDefault();
  drawing = false;
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
