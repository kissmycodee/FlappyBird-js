const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreText = document.getElementById('score');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreText = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Default game dimensions
let gameWidth = 400; 
let gameHeight = 600; 

let birdY; // Position of the bird
let gravity = 1.5;
let isGameOver = false;
let score = 0;
let pipeFrequency = 2000; // Time interval to create a pipe
let gameLoop, pipeInterval;

// Resize the game area
function resizeGame(width, height) {
    gameWidth = width;
    gameHeight = height;

    game.style.width = `${gameWidth}px`;
    game.style.height = `${gameHeight}px`;

    // Adjust the bird's initial position based on the new height
    birdY = Math.max(height / 2, 30); // Ensure bird is always in view
    bird.style.top = `${birdY}px`;
    score = 0;
    scoreText.textContent = 'Score: 0';
    
    // Restart the game if it's already running
    if (isGameOver) {
        startGame();
    }
}

// Function to make the bird fly
function fly() {
    if (birdY > 0) {
        birdY -= 50; // Move the bird up
        bird.style.top = birdY + 'px';
    }
}

// Function for bird falling due to gravity
function fall() {
    birdY += gravity; // Apply gravity
    if (birdY > gameHeight - 30) { // Keep bird within bounds
        birdY = gameHeight - 30;
    }
    bird.style.top = birdY + 'px';
}

// Create a pipe
function createPipe() {
    const pipeGap = 150; // Gap between pipes
    const pipeHeight = Math.random() * (gameHeight - pipeGap - 50) + 50;
    
    // Create the top pipe
    let pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe');
    pipeTop.style.height = pipeHeight + 'px';
    pipeTop.style.bottom = `${gameHeight - pipeHeight}px`; // Position at the top
    pipeTop.style.left = '400px';
    game.appendChild(pipeTop);

    // Create the bottom pipe
    let pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe');
    pipeBottom.style.height = `${gameHeight - pipeHeight - pipeGap}px`;
    pipeBottom.style.bottom = '0'; // Position it at the bottom
    pipeBottom.style.left = '400px';
    game.appendChild(pipeBottom);

    // Move pipes and check for collision
    const pipeMovementInterval = setInterval(() => {
        if (parseInt(pipeTop.style.left) < -50) {
            clearInterval(pipeMovementInterval);
            game.removeChild(pipeTop);
            game.removeChild(pipeBottom);
            score++;
            scoreText.textContent = 'Score: ' + score;
        } else if (
            parseInt(pipeTop.style.left) < 100 &&
            parseInt(pipeTop.style.left) > 50 &&
            (birdY < pipeHeight || birdY > pipeHeight + pipeGap)
        ) {
            clearInterval(pipeMovementInterval);
            endGame();
        } else {
            pipeTop.style.left = parseInt(pipeTop.style.left) - 5 + 'px';
            pipeBottom.style.left = parseInt(pipeBottom.style.left) - 5 + 'px';
        }
    }, 20);
}

// End the game
function endGame() {
    isGameOver = true;
    clearInterval(pipeInterval);
    clearInterval(gameLoop);
    finalScoreText.textContent = score;
    gameOverModal.style.display = 'block'; // Show the modal
}

// Start the game
function startGame() {
    gameOverModal.style.display = 'none'; // Hide the modal on start
    birdY = gameHeight / 2;
    score = 0;
    scoreText.textContent = 'Score: 0';
    isGameOver = false;

    // Move the bird down steadily
    gameLoop = setInterval(() => {
        if (!isGameOver) {
            fall();
        }
    }, 20);

    // Create pipes at intervals
    pipeInterval = setInterval(() => {
        if (!isGameOver) {
            createPipe();
        }
    }, pipeFrequency);
}

// Restart the game when the button is clicked
restartButton.addEventListener('click', () => {
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove()); // Remove any remaining pipes
    startGame();
});

// Listen for key events to make the bird fly
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isGameOver) {
        fly();
    }
});

// Implement touch controls for mobile
game.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Prevent scrolling
    if (!isGameOver) {
        fly();
    }
});

// Handle screen size buttons
document.getElementById('small-screen').addEventListener('click', () => {
    localStorage.setItem('gameSize', 'small');
    resizeGame(300, 500);
});

document.getElementById('medium-screen').addEventListener('click', () => {
    localStorage.setItem('gameSize', 'medium');
    resizeGame(400, 600);
});

document.getElementById('large-screen').addEventListener('click', () => {
    localStorage.setItem('gameSize', 'large');
    resizeGame(500, 700);
});

// Check local storage for previous size preference
if (localStorage.getItem('gameSize')) {
    const gameSize = localStorage.getItem('gameSize');
    if (gameSize === 'small') {
        resizeGame(300, 500);
    } else if (gameSize === 'medium') {
        resizeGame(400, 600);
    } else if (gameSize === 'large') {
        resizeGame(500, 700);
    }
} else {
    resizeGame(400, 600); // Default game size
}

// Start the initial game
startGame();