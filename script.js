// 取得 HTML 元素
const drawArea = document.getElementById("drawArea");
const ctx = drawArea.getContext("2d");
const feedback = document.getElementById("feedback");
const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("next");
const charDisplay = document.getElementById("character");

drawArea.width = 200;
drawArea.height = 200;

let drawing = false;
let strokes = [];

// 取得座標
function getPos(e) {
    if (e.touches) {
        const touch = e.touches[0];
        const rect = drawArea.getBoundingClientRect();
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else {
        return { x: e.offsetX, y: e.offsetY };
    }
}

// 滑鼠與觸控事件
drawArea.addEventListener("mousedown", (e) => { drawing = true; strokes.push([getPos(e)]); });
drawArea.addEventListener("mousemove", (e) => { if (drawing) strokes[strokes.length - 1].push(getPos(e)); });
drawArea.addEventListener("mouseup", () => { drawing = false; });

drawArea.addEventListener("touchstart", (e) => { drawing = true; strokes.push([getPos(e)]); }, { passive: false });
drawArea.addEventListener("touchmove", (e) => { if (drawing) strokes[strokes.length - 1].push(getPos(e)); }, { passive: false });
drawArea.addEventListener("touchend", () => { drawing = false; }, { passive: false });

// 防止滾動
document.addEventListener("touchmove", function(e) { if (e.target === drawArea) e.preventDefault(); }, { passive: false });

// **載入 AI 模型**
let model;
async function loadModel() {
    model = await tf.loadLayersModel("https://your-model-url/model.json");  // 請換成你訓練的模型網址
    console.log("AI 模型已載入");
}
loadModel();

// **將筆畫轉換為 AI 可讀數據**
function processDrawing() {
    let inputArray = new Array(28 * 28).fill(0);
    strokes.forEach(stroke => {
        stroke.forEach(point => {
            let x = Math.floor(point.x / drawArea.width * 28);
            let y = Math.floor(point.y / drawArea.height * 28);
            inputArray[y * 28 + x] = 1;
        });
    });
    return tf.tensor([inputArray]).reshape([1, 28, 28, 1]);
}

// **AI 判斷筆順是否正確**
async function checkHandwriting() {
    if (!model) {
        feedback.textContent = "AI 模型尚未載入";
        feedback.style.color = "gray";
        return;
    }

    let inputTensor = processDrawing();
    let prediction = model.predict(inputTensor);
    let result = await prediction.data();

    let maxIndex = result.indexOf(Math.max(...result));
    if (maxIndex === 1) {  // 1 代表筆順正確
        feedback.textContent = "正確！";
        feedback.style.color = "green";
        drawArea.classList.add("correct");
    } else {
        feedback.textContent = "錯誤，請再試一次";
        feedback.style.color = "red";
        drawArea.classList.add("wrong");
    }

    nextBtn.style.display = "block";
}

submitBtn.addEventListener("click", checkHandwriting);
nextBtn.addEventListener("click", () => {
    strokes = [];
    ctx.clearRect(0, 0, drawArea.width, drawArea.height);
    feedback.textContent = "";
    drawArea.classList.remove("correct", "wrong");
    nextBtn.style.display = "none";
});
