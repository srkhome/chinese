// 國小三年級簡單字
const words = [
    { word: "春", strokes: 9 },
    { word: "草", strokes: 3 },
    { word: "馬", strokes: 7 },
    { word: "魚", strokes: 10 },
    { word: "書", strokes: 9 }
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

// 開始畫畫
drawArea.addEventListener("mousedown", () => { drawing = true; userStrokes++; });
drawArea.addEventListener("mouseup", () => { drawing = false; });
drawArea.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(event.offsetX, event.offsetY, 3, 0, Math.PI * 2);
    ctx.fill();
}

// 開始新遊戲
function startGame() {
    // 隨機選擇一個字
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
