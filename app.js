const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const ground = document.getElementById("ground");
const ball = document.getElementById("ball");
const body = document.getElementById("screen");
const leftGoal = document.getElementById("left-goal")
const rightGoal = document.getElementById("right-goal")
const player1score = document.getElementById("player1score")
const player2score = document.getElementById("player2score")

let isAKeyDown = false;
let isDKeyDown = false;
let isArrowLeftKeyDown = false;
let isArrowRightKeyDown = false;
let isSKeyDown = false;
let isArrowDownKeyDown = false;
let isPlayer1Jump = false;
let player1jumpStart = 0;
let isPlayer2Jump = false;
let player2jumpStart = 0;
let player1tally = 0;
let player2tally = -1;

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      isAKeyDown = true;
      break;
    case "d":
      isDKeyDown = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      isAKeyDown = false;
      break;
    case "d":
      isDKeyDown = false;
      break;
  }
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      isArrowLeftKeyDown = true;
      break;
    case "ArrowRight":
      isArrowRightKeyDown = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      isArrowLeftKeyDown = false;
      break;
    case "ArrowRight":
      isArrowRightKeyDown = false;
      break;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === 'w' && !isPlayer1Jump) {
    isPlayer1Jump = true;
    player1jumpStart = Date.now();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === 'ArrowUp' && !isPlayer2Jump) {
    isPlayer2Jump = true;
    player2jumpStart = Date.now();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "s") {
    isSKeyDown = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "s") {
    isSKeyDown = false;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    isArrowDownKeyDown = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    isArrowDownKeyDown = false;
  }
});

// Player 1 jump
const player1jumpLoop = () => {
  if (isPlayer1Jump) {
    let player1progress = (Date.now() - player1jumpStart) / 150;
    let player1jumpHeight = Math.cos(player1progress) * 30;
    player1.style.top = (player1.offsetTop - player1jumpHeight) + "px";
    if (player1.offsetTop + player1.offsetHeight >= ground.offsetTop) {
        player1.style.top = (ground.offsetTop - player1.offsetHeight) + "px";
        isPlayer1Jump = false;
    }
  }
  requestAnimationFrame(player1jumpLoop);
};
requestAnimationFrame(player1jumpLoop);

// Player 2 jump
const player2jumpLoop = () => {
  if (isPlayer2Jump) {
    let player2progress = (Date.now() - player2jumpStart) / 150;
    let player2jumpHeight = Math.cos(player2progress) * 30;
    player2.style.top = (player2.offsetTop - player2jumpHeight) + "px";
    if (player2.offsetTop + player2.offsetHeight >= ground.offsetTop) {
        player2.style.top = (ground.offsetTop - player2.offsetHeight) + "px";
        isPlayer2Jump = false;
    }
  }
  requestAnimationFrame(player2jumpLoop);
};
requestAnimationFrame(player2jumpLoop);

// Smoothens the animations for the movement of the players
const gameLoop = () => {
  if (isAKeyDown && player1.offsetLeft > body.offsetLeft) {
    player1.style.left = (player1.offsetLeft - 13) + "px";
  }
  if (isDKeyDown && player1.offsetLeft + player1.offsetWidth < body.offsetWidth) {
    player1.style.left = (player1.offsetLeft + 13) + "px";
  }
  if (isArrowLeftKeyDown && player2.offsetLeft > body.offsetLeft) {
    player2.style.left = (player2.offsetLeft - 13) + "px";
  }
  if (isArrowRightKeyDown && player2.offsetLeft + player2.offsetWidth < body.offsetWidth) {
    player2.style.left = (player2.offsetLeft + 13) + "px";
  }
  requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);


// Set initial position and velocity of the ball
ball.x = window.innerWidth / 2;
ball.y = 0;
ball.vx = 0;
ball.vy = 10;
ball.radius = 38;
ball.height = 38;
ball.width = 76;
ball.speed = 30;

let ballLeft = ball.offsetLeft;
let ballRight = ball.offsetLeft + ball.offsetWidth;
let ballMiddleX = (ballLeft + ballRight) / 2;

const leftBar = document.getElementById("left-bar");
const rightBar = document.getElementById("right-bar");


// Defines a function to reset the ball to the starting position
const resetBall = () => {
  ball.vx = 0;
  ball.vy = 10
  ball.x = window.innerWidth / 2;
  ball.y = 0;
};

let ballInGoal = false;

const checkCollision = () => {

  let ballRect = ball.getBoundingClientRect();
  let player1Rect = player1.getBoundingClientRect();
  let player2Rect = player2.getBoundingClientRect();
  let leftBarRect = leftBar.getBoundingClientRect();
  let rightBarRect = rightBar.getBoundingClientRect();
  let leftGoalRect = leftGoal.getBoundingClientRect();
  let rightGoalRect = rightGoal.getBoundingClientRect();


  // Check if the ball is colliding with the left goal bar
  if (ballRect.left < leftBarRect.right &&
    ballRect.right > leftBarRect.left &&
    ballRect.top < leftBarRect.bottom &&
    ballRect.bottom > leftBarRect.top) {

    // Calculate the angle of collision
    let collisionAngle = Math.atan2(ball.y + ball.height / 2 - (leftBarRect.top + leftBarRect.height / 2),
      ball.x + ball.width / 2 - (leftBarRect.left + leftBarRect.width / 2));
    // Reverse the direction of the ball based on the angle of collision
    ball.vx = Math.cos(collisionAngle) * ball.speed;
    ball.vy = Math.sin(collisionAngle) * ball.speed;

    // Update the ball's position to be outside of the bar
    ball.style.top = parseInt(ball.style.top) - ball.offsetHeight + "px";
  }

  // Check if the ball is colliding with the right goal bar
  if (ballRect.left < rightBarRect.right &&
    ballRect.right > rightBarRect.left &&
    ballRect.top < rightBarRect.bottom &&
    ballRect.bottom > rightBarRect.top) {

    // Calculate the angle of collision
    let collisionAngle = Math.atan2(ball.y + ball.height / 2 - (rightBarRect.top + rightBarRect.height / 2),
      ball.x + ball.width / 2 - (rightBarRect.left + rightBarRect.width / 2));
    // Reverse the direction of the ball based on the angle of collision
    ball.vx = Math.cos(collisionAngle) * ball.speed;
    ball.vy = Math.sin(collisionAngle) * ball.speed;

    // Update the ball's position to be outside of the bar
    ball.style.top = parseInt(ball.style.top) + ball.offsetHeight + "px";
  }

  // Update score if ball in either goal
  if (ballRect.left < leftGoalRect.right &&
      ballRect.right > leftGoalRect.left &&
      ballRect.top < leftGoalRect.bottom &&
      ballRect.bottom > leftGoalRect.top) {
      
      if (!ballInGoal) {
          player2tally++;
          player2score.innerText = player2tally;
          ballInGoal = true;
          resetBall()
      }
  } else if (ballRect.left < rightGoalRect.right &&
      ballRect.right > rightGoalRect.left &&
      ballRect.top < rightGoalRect.bottom &&
      ballRect.bottom > rightGoalRect.top) {

      if (!ballInGoal) {
          player1tally++;
          player1score.innerText = player1tally;
          ballInGoal = true;
          resetBall()
      }
  } else {
      // If the ball is not in a goal, reset the ballInGoal variable
      ballInGoal = false;
  }

  // Check if the ball and player1 are colliding
  if (ballRect.left < player1Rect.right &&
    ballRect.right > player1Rect.left &&
    ballRect.top < player1Rect.bottom &&
    ballRect.bottom > player1Rect.top) {
    
  // Catch the ball with 's' key  
  if(isSKeyDown) {
    ball.style.left = (player1.offsetLeft + (player1.offsetWidth / 2)) - ball.radius + 'px';
    ball.style.top = (player1.offsetTop + player1.offsetHeight) - ball.radius + 'px';

    // Make ball go around player1 when 'a' is pressed
    if(isAKeyDown) {
      if(ballMiddleX < player1.offsetLeft + (player1.offsetWidth / 2)) {
        ball.y = ball.y - 7
      }
    }

    // Make ball go around player1 when 'd' is pressed
    if(isDKeyDown) {
      if(ballMiddleX < player1.offsetLeft + (player1.offsetWidth / 2)) {
        ball.y = ball.y - 7
      }
    }
    
    ball.vx = 0;
    ball.vy = 0;

  } else {

    // Calculate the angle of collision
    let collisionAngle = Math.atan2(ball.y + ball.height / 2 - (player1.offsetTop + player1.offsetHeight / 2),
                                    ball.x + ball.width / 2 - (player1.offsetLeft + player1.offsetWidth / 2));

    // Reverse the direction of the ball based on the angle of collision
    ball.vx = Math.cos(collisionAngle) * ball.speed;
    ball.vy = Math.sin(collisionAngle) * ball.speed;
  }
}
if (ballRect.left < player2Rect.right &&
    ballRect.right > player2Rect.left &&
    ballRect.top < player2Rect.bottom &&
    ballRect.bottom > player2Rect.top) {
   
 // Catch the ball with 's' key  
  if(isArrowDownKeyDown) {
    ball.style.left = (player2.offsetLeft + (player2.offsetWidth / 2)) - ball.radius + 'px';
    ball.style.top = (player2.offsetTop + player2.offsetHeight) - ball.radius + 'px';

    // Make ball go around player1 when 'a' is pressed
    if(isArrowLeftKeyDown) {
      if(ballMiddleX < player2.offsetLeft + (player2.offsetWidth / 2)) {
        ball.y = ball.y - 7;
      }
    }

    // Make ball go around player1 when 'd' is pressed
    if(isArrowRightKeyDown) {
      if(ballMiddleX < player2.offsetLeft + (player2.offsetWidth / 2)) {
        ball.y = ball.y - 7;
      } 
    }
   
    ball.vx = 0;
    ball.vy = 0;

  } else {

    // Calculate the angle of collision
    let collisionAngle = Math.atan2(ball.y + ball.height / 2 - (player2.offsetTop + player2.offsetHeight / 2),
                                    ball.x + ball.width / 2 - (player2.offsetLeft + player2.offsetWidth / 2));

    // Reverse the direction of the ball based on the angle of collision
    ball.vx = Math.cos(collisionAngle) * ball.speed;
    ball.vy = Math.sin(collisionAngle) * ball.speed;
    }
  }
};

const updateBall = () => {

  checkCollision()

  // Update the ball's position based on its velocity
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Apply gravity to the ball's vertical velocity
  ball.vy += 0.6;

  // Check if the ball has hit the ground
  if (ball.y + ball.height > ground.offsetTop) {
    ball.y = ground.offsetTop - ball.radius;
    ball.vy *= -0.9;
  }

  // Check if the ball has hit the walls
  if (ball.x - ball.radius < body.offsetLeft - 30) {
    ball.vx *= -0.9;
    ball.x = body.offsetLeft - 30 + ball.radius;
  }

  if (ball.x + ball.radius > body.offsetLeft + body.offsetWidth - 30) {
    ball.vx *= -0.9;
    ball.x = body.offsetLeft + body.offsetWidth - 30 - ball.radius;
  }

  // Check if the ball has hit the ceiling
  if (ball.y < 0) {
    ball.y = 0;
    ball.vy *= -1.0;
  }

  // Update the style of the ball to reflect its new position
  ball.style.left = ball.x + 'px';
  ball.style.top = ball.y + 'px';

  requestAnimationFrame(updateBall);
};

// Start the animation loop
requestAnimationFrame(updateBall);