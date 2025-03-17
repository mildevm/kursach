const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameTime = Date.now()

// Параметры мяча
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 6;
let dy = -6;

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

// Счетчик очков и рекорд
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

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
                    if (brick.strength === 0) {
                        score += 10; // Увеличить счет на 10 очков за разрушение кирпича
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('highScore', highScore); // Сохранить рекорд
                        }
                    }
                }
            }
        }
    }
}

// Отрисовка счета и рекорда
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Счет: " + score, 8, 20);
    ctx.fillText("Время: " + Math.round((Date.now() - startGameTime) / 1000), canvas.width - 120, 20);
}
// Основной игровой цикл
function draw() {
    // console.log(Date.now()-startGameTime)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();

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
            // dy = -dy;
        }
    }

    // Движение платформы
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 9;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 9;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Запуск игры
draw();