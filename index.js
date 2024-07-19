const canvas = document.querySelector('canvas');
const c = canvas?.getContext('2d');
const scoreText = document.getElementById('score-text');
const resetButton = document.getElementById('reset-button');
const settingsSection = document.getElementById('settings');
const GAME_WIDTH = canvas.width = innerWidth - 120;
const GAME_HEIGHT = canvas.height = innerHeight - 100;

// GAME SETTINGS

const delay = 10;
const openSettingsMenuKey = 'Escape';

const GameSettings = {
    backgroundColor: 'forestgreen',
    paddleBorderColor: 'black',
    paddleSpeed: 50,
    intervalID: undefined,
    player1Score: 0,
    player2Score: 0,
};

const paddle1 = {
    color: 'lightblue',
    width: 25,
    height: 100,
    up: 'w',
    down: 's',
    x: 0,
    y: 0
};

const paddle2 = {
    color: 'red',
    width: 25,
    height: 100,
    up: 'ArrowUp',
    down: 'ArrowDown',
    x: GAME_WIDTH - 25,
    y: GAME_HEIGHT - 100
};

const ball = {
    color: 'white',
    borderColor: 'black',
    speed: 1,
    radius: 12.5,
    x: GAME_WIDTH / 2,
    xDirection: 0,
    y: GAME_HEIGHT / 2,
    yDirection: 0
};

window.addEventListener('keydown', handleKeyPressed);

resetButton && resetButton.addEventListener('click', resetGame);

startGame();

function startGame() {
    createBall();
    nextTick();
}

function nextTick() {
    GameSettings.intervalID = setTimeout(() => {
        clearBoard();
        renderPaddles();
        moveBall();
        renderBall(ball.x, ball.y);
        checkCollision();
        nextTick();
    }, delay);
}

function clearBoard() {
    if (!c) return;
    c.fillStyle = GameSettings.backgroundColor;
    c.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function renderPaddles() {
    if (!c) return;

    c.fillStyle = paddle1.color;
    c.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    c.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    c.fillStyle = paddle2.color;
    c.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    c.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ball.xDirection = Math.random() < 0.5 ? 1 : -1;
    ball.yDirection = Math.random() < 0.5 ? 1 : -1;
}

function moveBall() {
    ball.x += ball.speed * ball.xDirection;
    ball.y += ball.speed * ball.yDirection;
}

function renderBall(x, y) {
    if (!c) return;
    c.fillStyle = ball.color;
    c.strokeStyle = ball.borderColor;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(x, y, ball.radius, 0, 2 * Math.PI);
    c.stroke();
    c.fill();
}

function checkCollision() {
    if (ball.y <= 0 || ball.y >= GAME_HEIGHT) {
        ball.yDirection *= -1;
    }

    if (
        (ball.x - ball.radius <= paddle1.x + paddle1.width &&
         ball.y >= paddle1.y &&
         ball.y <= paddle1.y + paddle1.height) ||
        (ball.x + ball.radius >= paddle2.x &&
         ball.y >= paddle2.y &&
         ball.y <= paddle2.y + paddle2.height)
    ) {
        ball.xDirection *= -1;
    }
    if (ball.x <= 0 || ball.x >= GAME_WIDTH) {
        updateScore(ball.x <= 0 ? 2 : 1);
        resetBall();
    }
}

function handleKeyPressed(event) {
    switch(event.key) {
        case paddle1.up:
            if (paddle1.y > 0) {
                paddle1.y -= GameSettings.paddleSpeed;
            }
            break;
        case paddle1.down:
            if (paddle1.y < GAME_HEIGHT - paddle1.height) {
                paddle1.y += GameSettings.paddleSpeed;
            }
            break;
        case paddle2.up:
            event.preventDefault();
            if (paddle2.y > 0) {
                paddle2.y -= GameSettings.paddleSpeed;
            }
            break;
        case paddle2.down:
            event.preventDefault();
            if (paddle2.y < GAME_HEIGHT - paddle2.height) {
                paddle2.y += GameSettings.paddleSpeed;
            }
            break;
        case openSettingsMenuKey:
            openSettingsMenu();
            break;
    }
}

function updateScore(player) {
    if (player === 1) {
        GameSettings.player1Score++;
    } else {
        GameSettings.player2Score++;
    }

    if (scoreText) {
        scoreText.innerText = GameSettings.player1Score + ' : ' + GameSettings.player2Score;
    }
}

function resetGame() {
    GameSettings.player1Score = 0;
    GameSettings.player2Score = 0;

    if (scoreText) {
        scoreText.innerText = GameSettings.player1Score + ' : ' + GameSettings.player2Score;
    }

    resetBall();
}

function resetBall() {
    ball.x = GAME_WIDTH / 2;
    ball.y = GAME_HEIGHT / 2;
    ball.xDirection = Math.random() < 0.5 ? 1 : -1;
    ball.yDirection = Math.random() < 0.5 ? 1 : -1;
}

function openSettingsMenu() {
    do {
        const setting = prompt(`-----------\nSETTINGS\n-----------\nq = quit and save \nbs = ball Speed (${ball.speed})\nbg = background color (${GameSettings.backgroundColor})\nps = paddle speed (${GameSettings.paddleSpeed})\nk = keys configuration (p1: (${paddle1.up.toUpperCase()}, ${paddle1.down.toUpperCase()}), p2: (${paddle2.up.toUpperCase()}, ${paddle2.down.toUpperCase()})\n`).toLowerCase();

        if (setting === 'bs') 
            ball.speed = Number(prompt('Set ball speed: '));
        else if (setting === 'bg') 
            GameSettings.backgroundColor = String(prompt('Set background color: ').toLocaleLowerCase());
        else if (setting === 'ps') 
            GameSettings.paddleSpeed = Number(prompt('Set paddle speed: '));
        else if (setting === 'k') {
            const playerKeyConfigurationChoose = Number(prompt('For which player do you want to customize keys? (1/2): '));
        if (playerKeyConfigurationChoose === 1) {
            const p1upKey = String(prompt('Enter your up key: '));
            paddle1.up = p1upKey;
            const p1downKey = String(prompt('Enter your down key: '));
            paddle1.down = p1downKey;
        } else if (playerKeyConfigurationChoose === 2) {
            const p2upKey = String(prompt('Enter your up key: '));
            paddle2.up = p2upKey;
            const p2downKey = String(prompt('Enter your down key: '));
            paddle2.down = p2downKey;
        }
    }
            
    } while (setting !== 'q');
}

if (settingsSection) {
    settingsSection.innerHTML = `
    <hr>
    <h1>Settings</h1>
    <hr>
    <label for="ballSpeedValue">Ball speed: </label>
    <input type="number" name="ballSpeedValue" id="ballSpeedValue" value="${ball.speed}" min="1">
    <br>
    <label for="BGColorValue">Background color: </label>
    <input type="color" name="BGColorValue" id="BGColorValue" value="${GameSettings.backgroundColor}">
    <hr>
    `;

    const ballSpeedValue = document.getElementById('ballSpeedValue');

    ballSpeedValue.addEventListener('change', (event) => {
        ball.speed = Number(ballSpeedValue.value);
        startGame();
    });

    const BGColorValue = document.getElementById('BGColorValue');

    BGColorValue.addEventListener('change', (event) => {
        GameSettings.backgroundColor = BGColorValue.value;
        startGame();
    });
}