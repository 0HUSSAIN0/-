// إعداد الكانفاس والكونتكست
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// إعداد اللعبة
const scale = 20;
const rows = canvas.height / scale;
const cols = canvas.width / scale;
canvas.width = 400;
canvas.height = 400;

// متغيرات اللعبة
let snake = [{ x: 5 * scale, y: 5 * scale }];
let food = generateFood();
let direction = { x: scale, y: 0 };
let score = 0;
let speed = 200;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval = null;

// تحديث أعلى سكور
document.getElementById('highScore').textContent = highScore;

// بدء اللعبة
document.getElementById('startButton').addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyInput);

// توليد الطعام
function generateFood() {
    return {
        x: Math.floor(Math.random() * cols) * scale,
        y: Math.floor(Math.random() * rows) * scale,
    };
}

// رسم العناصر
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الدودة
    snake.forEach((segment, index) => {
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x, segment.y, scale, scale);
    });

    // رسم الطعام
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x, food.y, scale, scale);

    // تحديث النقاط
    document.getElementById('score').textContent = `النقاط: ${score}`;
}

// تحريك الدودة
function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    // التحقق من الاصطدام بالجدران (خروج من الطرف الآخر)
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - scale;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - scale;

    snake.unshift(head);

    // أكل الطعام
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        speed = Math.max(50, speed - 10); // زيادة السرعة تدريجيًا
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    } else {
        snake.pop();
    }
}

// التحقق من الاصطدام بجسم الدودة
function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// حلقة اللعبة
function gameLoop() {
    moveSnake();
    if (checkCollision()) endGame();
    draw();
}

// بدء اللعبة
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';

    // تهيئة المتغيرات
    snake = [{ x: 5 * scale, y: 5 * scale }];
    direction = { x: scale, y: 0 };
    score = 0;
    speed = 200;

    // بدء اللعبة
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

// إنهاء اللعبة
function endGame() {
    clearInterval(gameInterval);

    // تحديث أعلى سكور
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    // إعادة عرض شاشة البداية
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('highScore').textContent = highScore;
}

// التحكم في الاتجاه
function handleKeyInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -scale };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: scale };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -scale, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: scale, y: 0 };
            break;
    }
}

// ربط الأزرار بحركة الدودة
document.getElementById('up').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -scale };
});

document.getElementById('down').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: scale };
});

document.getElementById('left').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -scale, y: 0 };
});

document.getElementById('right').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: scale, y: 0 };
});