const sprite = document.getElementById('sprite');
const gameWorld = document.getElementById('game-world');
const gameContainer = document.getElementById('game-container');

// Game world size (match CSS)
const worldWidth = 4000;
const worldHeight = 3000;

// Set camera size to match the screen
let cameraWidth = window.innerWidth;
let cameraHeight = window.innerHeight;

// Update camera size when the window resizes
window.addEventListener('resize', () => {
    cameraWidth = window.innerWidth;
    cameraHeight = window.innerHeight;
});

// Movement tracking
let x = 200;  // Initial X position of the sprite
let y = 200;  // Initial Y position of the sprite
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let lastDirection = 'down'; // Default idle direction

// Function to update sprite animation
function updateAnimation() {
    if (moveLeft) {
        lastDirection = 'left';
        sprite.classList.add('moveLeft');
        sprite.classList.remove('moveRight', 'moveUp', 'moveDown', 'idle');
    } else if (moveRight) {
        lastDirection = 'right';
        sprite.classList.add('moveRight');
        sprite.classList.remove('moveLeft', 'moveUp', 'moveDown', 'idle');
    } else if (moveUp) {
        lastDirection = 'up';
        sprite.classList.add('moveUp');
        sprite.classList.remove('moveRight', 'moveLeft', 'moveDown', 'idle');
    } else if (moveDown) {
        lastDirection = 'down';
        sprite.classList.add('moveDown');
        sprite.classList.remove('moveRight', 'moveLeft', 'moveUp', 'idle');
    } else {
        // Stop animation and set idle frame based on lastDirection
        sprite.classList.remove('moveUp', 'moveDown', 'moveLeft', 'moveRight');

        // Set the correct idle frame based on last direction
        if (lastDirection === 'left') {
            sprite.style.backgroundImage = "url('images/left2.png')";
        } else if (lastDirection === 'right') {
            sprite.style.backgroundImage = "url('images/right2.png')";
        } else if (lastDirection === 'up') {
            sprite.style.backgroundImage = "url('images/up2.png')";
        } else {
            sprite.style.backgroundImage = "url('images/down2.png')";
        }
    }
}

// Function to update sprite position and camera
function updatePosition() {
    // Keep the sprite within the world boundaries
    x = Math.max(0, Math.min(worldWidth - sprite.offsetWidth, x));
    y = Math.max(0, Math.min(worldHeight - sprite.offsetHeight, y));

    // Update sprite position inside game world
    sprite.style.left = `${x}px`;
    sprite.style.top = `${y}px`;

    // Calculate camera position (centered on sprite)
    let cameraX = x - cameraWidth / 2 + sprite.offsetWidth / 2;
    let cameraY = y - cameraHeight / 2 + sprite.offsetHeight / 2;

    // Clamp camera to prevent scrolling past the world
    cameraX = Math.max(0, Math.min(worldWidth - cameraWidth, cameraX));
    cameraY = Math.max(0, Math.min(worldHeight - cameraHeight, cameraY));

    // Move the game world within the container
    gameWorld.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
}

// Key event listeners for movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveUp = true;
    if (event.key === 's') moveDown = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
    updateAnimation();
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveUp = false;
    if (event.key === 's') moveDown = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
    updateAnimation();
});

// Game loop
function gameLoop() {
    const step = 5;
    let moveX = 0, moveY = 0;

    if (moveUp) moveY -= step;
    if (moveDown) moveY += step;
    if (moveLeft) moveX -= step;
    if (moveRight) moveX += step;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        const diagonalFactor = Math.sqrt(2) / 2;
        moveX *= diagonalFactor;
        moveY *= diagonalFactor;
    }

    // Update sprite position
    x += moveX;
    y += moveY;

    updatePosition();
    updateAnimation(); // Ensure animation updates each frame

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
