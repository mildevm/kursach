const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Параметры мяча
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

// Параметры платформы
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

// Управление платформой
let rightPressed = false;
let leftPressed = false;

// Параметры кирпичей с прочностью
const brickRowCount = 4;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        const strength = Math.floor(Math.random() * 3) + 1; // Случайная прочность от 1 до 3
        bricks[c][r] = { x: 0, y: 0, strength };
    }
}

// События клавиш
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = false;
    }
}

// Отрисовка мячика
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff69b4"; // Ярко-розовый мяч
    ctx.fill();
    ctx.closePath();
}

// Отрисовка платформы
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ff1493"; // Розовая платформа
    ctx.fill();
    ctx.closePath();
}

// Отрисовка кирпичей
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.strength > 0) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                brick.x = brickX;
                brick.y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);

                // Цвет меняется в зависимости от прочности
                if (brick.strength === 3) {
                    ctx.fillStyle = "#ff69b4"; // Самый прочный
                } else if (brick.strength === 2) {
                    ctx.fillStyle = "#ffb6c1"; // Средний
                } else {
                    ctx.fillStyle = "#ffe4e1"; // Минимальный
                }

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Обработка столкновений
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.strength > 0) {
                if (
                    x > brick.x &&
                    x < brick.x + brickWidth &&
                    y > brick.y &&
                    y < brick.y + brickHeight
                ) {
                    dy = -dy;
                    brick.strength--; // Уменьшить прочность кирпича
                }
            }
        }
    }
}

// Основной игровой цикл
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Движение мяча
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            document.location.reload(); // Перезапуск игры
        }
    }

    // Движение платформы
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Запуск игры
draw();