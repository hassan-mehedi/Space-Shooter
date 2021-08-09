const canvas = document.querySelector(".canva");
const brush = canvas.getContext("2d");

let arrayOfBullets = [];
let arrayOfEnemyPlane = [];
let arrayOfCoins = [];
let colors = 0;
let time = 0;
let score = 0;

const game_background = new Image();
const myPLaneImage = new Image();
const enemyPlaneImage = new Image();
const coinImage = new Image();
const boomImage = new Image();

const play = document.querySelector(".play");
const restart = document.querySelector(".replay");

enemyPlaneImage.src = "https://i.ibb.co/37KpLjW/enemy.png";
myPLaneImage.src = "https://i.ibb.co/FmhGV5t/myplane.png";
game_background.src = "https://i.ibb.co/1q2YVcW/back.png";
coinImage.src = "https://i.ibb.co/0tMhqD2/Coin.png";
boomImage.src = "https://i.ibb.co/R93Rh5g/bubble-explo4.png";

canvas.height = 400;
canvas.width = 600;

class MyPlane {
    constructor() {
        this.x = 10;
        this.y = Math.floor(canvas.height / 2) - 30;
        this.width = 120;
        this.height = 30;
        this.planeSpeed = 15;
    }
    drawMyPlane() {
        brush.fillStyle = "green";
        // brush.fillRect(this.x, this.y, this.width, this.height);
        brush.drawImage(myPLaneImage, this.x, this.y, this.width, this.height);
    }
    goUp() {
        this.y -= this.planeSpeed;
        if (this.y <= this.planeSpeed) {
            this.y = this.planeSpeed;
        }
    }
    goDown() {
        this.y += this.planeSpeed;
        if (this.y >= canvas.height - this.height - this.planeSpeed) {
            this.y = canvas.height - this.height - this.planeSpeed;
        }
    }
    goRight() {
        this.x += this.planeSpeed;
        if (this.x >= canvas.width - this.width - this.planeSpeed) {
            this.x = canvas.width - this.width - this.planeSpeed;
        }
    }
    goLeft() {
        this.x -= this.planeSpeed;
        if (this.x <= 0) {
            this.x = this.planeSpeed;
        }
    }
}

class EnemyPlane {
    constructor() {
        this.x = canvas.width;
        this.y = Math.floor(Math.random() * (canvas.height - 60));
        this.width = 120;
        this.height = 30;
        this.gameSpeed = 3;
        this.passed = false;
        this.crushed = false;
    }
    drawPLane() {
        brush.fillStyle = `hsl(${colors}, 100%, 50%)`;
        // brush.fillRect(this.x, this.y, this.width, this.height);
        brush.drawImage(
            enemyPlaneImage,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    movePlane() {
        // console.log(this.x);
        this.x -= this.gameSpeed;
        if (this.x <= 0 - this.width) {
            this.passed = true;
        }
    }
}

class Coins {
    constructor() {
        this.x = canvas.width;
        this.y = Math.floor(Math.random() * (canvas.height - 60));
        this.width = 20;
        this.height = 20;
        this.gameSpeed = 3;
        this.passed = false;
        this.scored = false;
    }
    drawCoins() {
        brush.fillStyle = `hsl(${colors}, 100%, 50%)`;
        // brush.fillRect(this.x, this.y, this.width, this.height);
        brush.drawImage(coinImage, this.x, this.y, this.width, this.height);
    }
    moveCoins() {
        // console.log(this.x);
        this.x -= this.gameSpeed;
        if (this.x <= 0 - this.width) {
            this.passed = true;
        }
    }
}

class Bullets {
    constructor() {
        this.x = myplane.x + myplane.width;
        this.y = myplane.y + myplane.height / 2;
        this.height = 5;
        this.width = 20;
        this.bulletSpeed = 10;
        this.gone = false;
    }
    drawBullet() {
        brush.fillStyle = "red";
        brush.fillRect(this.x, this.y, this.width, this.height);
    }
    runBullet() {
        this.x += this.bulletSpeed;
        if (this.x >= canvas.width) {
            this.gone = true;
        }
    }
}

const myplane = new MyPlane();

play.addEventListener("click", () => {
    play.style.display = "none";
    animate();
});

restart.addEventListener("click", () => {
    myplane.x = 10;
    myplane.y = Math.floor(canvas.height / 2) - 30;
    arrayOfBullets = [];
    arrayOfCoins = [];
    arrayOfEnemyPlane = [];
    score = 0;
    restart.style.display = "none";
    animate();
});

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") {
        myplane.goUp();
    }
    if (e.code === "ArrowDown") {
        myplane.goDown();
    }
    if (e.code === "ArrowLeft") {
        myplane.goLeft();
    }
    if (e.code === "ArrowRight") {
        myplane.goRight();
    }
});

window.addEventListener("keypress", (e) => {
    if (e.key === "f") {
        arrayOfBullets.push(new Bullets());
    }
});

//Bullet Collision

function fire() {
    if (arrayOfBullets.length > 0) {
        for (let i = 0; i < arrayOfEnemyPlane.length; ++i) {
            for (let j = 0; j < arrayOfBullets.length; ++j) {
                if (
                    arrayOfBullets[j].x + arrayOfBullets[j].width >
                        arrayOfEnemyPlane[i].x &&
                    arrayOfBullets[j].x < arrayOfEnemyPlane[i].x &&
                    arrayOfBullets[j].x + arrayOfBullets[j].width <
                        arrayOfEnemyPlane[i].x + arrayOfEnemyPlane[i].width &&
                    arrayOfBullets[j].y > arrayOfEnemyPlane[i].y &&
                    arrayOfBullets[j].y + arrayOfBullets[j].height <
                        arrayOfEnemyPlane[i].y + arrayOfEnemyPlane[i].height
                ) {
                    score += 10;
                    arrayOfEnemyPlane[i].crushed = true;
                }
            }
        }
    }
}

// Enemy Plane Collision

function collision() {
    for (let i = 0; i < arrayOfEnemyPlane.length; ++i) {
        if (
            myplane.x + myplane.width > arrayOfEnemyPlane[i].x &&
            myplane.x < arrayOfEnemyPlane[i].x &&
            ((myplane.y < arrayOfEnemyPlane[i].y &&
                myplane.y + myplane.height > arrayOfEnemyPlane[i].y) ||
                (myplane.y > arrayOfEnemyPlane[i].y &&
                    myplane.y <
                        arrayOfEnemyPlane[i].y + arrayOfEnemyPlane[i].height))
        ) {
            return true;
        }
        if (
            myplane.x > arrayOfEnemyPlane[i].x &&
            myplane.x < arrayOfEnemyPlane[i].x + arrayOfEnemyPlane[i].width &&
            ((myplane.y < arrayOfEnemyPlane[i].y &&
                myplane.y + myplane.height > arrayOfEnemyPlane[i].y) ||
                (myplane.y > arrayOfEnemyPlane[i].y &&
                    myplane.y <
                        arrayOfEnemyPlane[i].y + arrayOfEnemyPlane[i].height))
        ) {
            return true;
        }
    }
}

function coinsScored() {
    for (let i = 0; i < arrayOfCoins.length; ++i) {
        if (
            myplane.x + myplane.width > arrayOfCoins[i].x &&
            myplane.x < arrayOfCoins[i].x &&
            ((myplane.y < arrayOfCoins[i].y &&
                myplane.y + myplane.height > arrayOfCoins[i].y) ||
                (myplane.y > arrayOfCoins[i].y &&
                    myplane.y < arrayOfCoins[i].y + arrayOfCoins[i].height))
        ) {
            arrayOfCoins[i].scored = true;
            score++;
            return true;
        }
        if (
            myplane.x > arrayOfCoins[i].x &&
            myplane.x < arrayOfCoins[i].x + arrayOfCoins[i].width &&
            ((myplane.y < arrayOfCoins[i].y &&
                myplane.y + myplane.height > arrayOfCoins[i].y) ||
                (myplane.y > arrayOfCoins[i].y &&
                    myplane.y < arrayOfCoins[i].y + arrayOfCoins[i].height))
        ) {
            arrayOfCoins[i].scored = true;
            score++;
            return true;
        }
    }
}

function scoreBoard() {
    brush.fillStyle = "White";
    brush.font = "32px Poppins";
    brush.fillText(score, canvas.width - 75, 50);
}

function animate() {
    brush.clearRect(0, 0, canvas.width, canvas.height);
    brush.drawImage(game_background, 0, 0, canvas.width, canvas.height);
    scoreBoard();
    if (time % 200 === 0) {
        arrayOfEnemyPlane.push(new EnemyPlane());
    }
    if (time % 100 === 0) {
        arrayOfCoins.push(new Coins());
    }

    if (arrayOfCoins.length > 0) {
        for (let i = 0; i < arrayOfCoins.length; ++i) {
            if (
                arrayOfCoins[i].passed === false &&
                arrayOfCoins[i].scored === false
            ) {
                arrayOfCoins[i].drawCoins();
                arrayOfCoins[i].moveCoins();
            } else {
                arrayOfCoins.splice(i, 1);
            }
        }
    }
    if (arrayOfEnemyPlane.length > 0) {
        for (let i = 0; i < arrayOfEnemyPlane.length; ++i) {
            if (
                arrayOfEnemyPlane[i].passed === false &&
                arrayOfEnemyPlane[i].crushed === false
            ) {
                arrayOfEnemyPlane[i].drawPLane();
                arrayOfEnemyPlane[i].movePlane();
            } else {
                arrayOfEnemyPlane.splice(i, 1);
            }
        }
    }

    if (arrayOfBullets.length > 0) {
        for (let i = 0; i < arrayOfBullets.length; ++i) {
            if (arrayOfBullets[i].gone === false) {
                arrayOfBullets[i].drawBullet();
                arrayOfBullets[i].runBullet();
            }
        }
    }
    myplane.drawMyPlane();
    if (collision()) {
        brush.drawImage(
            boomImage,
            myplane.x + myplane.width - 25,
            myplane.y,
            50,
            50
        );
        brush.fillStyle = "White";
        brush.font = "64px Poppins";
        brush.fillText("Game over", canvas.width / 5, canvas.height / 2);
        restart.style.display = "block";
        return;
    }
    if (coinsScored()) {
    }
    fire();
    colors++;
    time++;
    requestAnimationFrame(animate);
}
