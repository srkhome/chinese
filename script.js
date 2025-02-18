// 字庫：國小三年級常見字（筆畫數僅供參考，請依實際標準調整）
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

// 初始化 canvas
const ctx = drawArea.getContext("2d");
drawArea.width = 200;
drawArea.height = 200;

// 為了平滑繪製，建立兩個陣列：儲存所有已完成的筆劃、以及目前正在繪製的筆劃
let strokes = [];         // 每個元素是一個筆劃 (array of points)
let currentStroke = [];   // 當前筆劃的點陣列
let drawing = false;

// 取得觸控與滑鼠的座標
function getTouchPos(e) {
  const touch = e.touches[0];
  const rect = drawArea.getBoundingClientRect();
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}
function getMousePos(e) {
  return { x: e.offsetX, y: e.offsetY };
}

// 用平滑曲線繪製一個筆劃
function drawStroke(points) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length === 1) {
    ctx.lineTo(points[0].x, points[0].y);
  } else {
    // 使用 quadraticCurveTo 平滑曲線：取相鄰點的中點作為終點
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }
  ctx.stroke();
}

// 重新繪製 canvas，將所有筆劃平滑繪出
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
  userStrokes++;   // 每次按下視為一筆開始
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

// 觸控事件（加入 {passive: false} 以確保 preventDefault 生效）
drawArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  userStrokes++;   // 開始新筆劃
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

// 全域攔截 touchmove，若目標為 canvas 則防止頁面滾動
document.addEventListener("touchmove", function(e) {
  if (e.target === drawArea) {
    e.preventDefault();
  }
}, { passive: false });

// 開始新題目，並清空畫布與筆劃資料
function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  charDisplay.textContent = currentWord.word;
  userStrokes = 0;
  feedback.textContent = "";
  strokes = [];
  currentStroke = [];
  ctx.clearRect(0, 0, drawArea.width, drawArea.height);
}

submitBtn.addEventListener("click", () => {
  if (userStrokes === currentWord.strokes) {
    feedback.textContent = "正確！";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `錯誤，正確筆畫數是 ${currentWord.strokes} 畫`;
    feedback.style.color = "red";
  }
});

nextBtn.addEventListener("click", startGame);

// 啟動遊戲
startGame();
