let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let painting = false;

// 手機支援
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopPosition);

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", stopPosition);
canvas.addEventListener("mousemove", draw);

function startPosition(e) {
    painting = true;
    draw(e);
}

function stopPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    let x = e.clientX || e.touches[0].clientX - canvas.offsetLeft;
    let y = e.clientY || e.touches[0].clientY - canvas.offsetTop;

    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 🔹 AI 預測筆順（TensorFlow.js）
async function predictStroke() {
    const model = await tf.loadLayersModel('model/model.json');
    
    let imageData = ctx.getImageData(0, 0, 280, 280);
    let tensor = tf.browser.fromPixels(imageData, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

    let prediction = model.predict(tensor);
    let result = await prediction.data();

    document.getElementById("result").innerText = result[1] > result[0] ? "✅ 筆順正確！" : "❌ 筆順錯誤！";
}
