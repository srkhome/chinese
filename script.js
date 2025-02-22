// 字庫
const words = ["要", "靜", "天", "空", "雲", "水", "蟲", "鳥", "草", "先", "完", "再", "去", "園", "聽", "沒", "正", "唱", "著", "輕", "快", "歌", "出", "新", "芽", "聞", "身", "香", "呢"];

let currentWord = null;

// 取得 HTML 元素
const charDisplay = document.getElementById("character");
const drawArea = document.getElementById("drawArea");
const submitBtn = document.getElementById("submit");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next");

// 初始化 canvas
const ctx = drawArea.getContext("2d");
drawArea.width = 200;
drawArea.height = 200;

// 筆順繪製相關變數
let strokes = [];
let currentStroke = [];
let drawing = false;

// 取得滑鼠與觸控座標
function getTouchPos(e) {
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}
function getMousePos(e) {
  return { x: e.offsetX, y: e.offsetY };
}

// 平滑繪製筆劃
function drawStroke(points) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

// 重新繪製畫布
function redrawCanvas() {
  ctx.clearRect(0, 0, drawArea.width, drawArea.height);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  strokes.forEach(stroke => drawStroke(stroke));
  drawStroke(currentStroke);
}

// 滑鼠事件
drawArea.addEventListener("mousedown", (e) => {
  drawing = true;
  currentStroke = [];
  currentStroke.push(getMousePos(e));
});
drawArea.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  currentStroke.push(getMousePos(e));
  redrawCanvas();
});
drawArea.addEventListener("mouseup", () => {
  drawing = false;
  strokes.push(currentStroke);
});

// 觸控事件
drawArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  currentStroke = [];
  currentStroke.push(getTouchPos(e));
}, { passive: false });

drawArea.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  currentStroke.push(getTouchPos(e));
  redrawCanvas();
}, { passive: false });

drawArea.addEventListener("touchend", (e) => {
  e.preventDefault();
  drawing = false;
  strokes.push(currentStroke);
}, { passive: false });

// 防止全域滾動
document.addEventListener("touchmove", function(e) {
  if (e.target === drawArea) {
    e.preventDefault();
  }
}, { passive: false });

// **影像比對**
function compareDrawing() {
  // 取得使用者繪製的影像
  const userDrawing = drawArea.toDataURL();

  // 建立標準字影像（這裡模擬，未來可用 AI 自動生成）
  const standardCanvas = document.createElement("canvas");
  const standardCtx = standardCanvas.getContext("2d");
  standardCanvas.width = 200;
  standardCanvas.height = 200;
  standardCtx.font = "150px Arial";
  standardCtx.fillText(currentWord, 40, 150);
  
  const standardDrawing = standardCanvas.toDataURL();

  return userDrawing === standardDrawing;  // 這裡可用更精確的圖像比對技術
}

// 開始新題目
function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  charDisplay.textContent = currentWord;
  feedback.textContent = "";
  strokes = [];
  currentStroke = [];
  ctx.clearRect(0, 0, drawArea.width, drawArea.height);
  
  // 隱藏「下一題」按鈕
  nextBtn.style.display = "none";
  drawArea.classList.remove("correct", "wrong");
}

submitBtn.addEventListener("click", () => {
  if (compareDrawing()) {
    feedback.textContent = "正確！";
    feedback.style.color = "green";
    drawArea.classList.add("correct");
  } else {
    feedback.textContent = "錯誤，請再試一次";
    feedback.style.color = "red";
    drawArea.classList.add("wrong");
  }
  
  // 顯示「下一題」按鈕
  nextBtn.style.display = "block";
});

nextBtn.addEventListener("click", startGame);

// 預設隱藏「下一題」按鈕，開始遊戲
nextBtn.style.display = "none";
startGame();







