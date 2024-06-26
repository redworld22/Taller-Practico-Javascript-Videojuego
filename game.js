/*** @type {HTMLCanvasElement} */

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart = undefined;
let timePlayer;
let timeInterval;

let playerPosition = {
    x: undefined,
    y: undefined
}

const giftPosition = {
    x: undefined,
    y: undefined
}

let enemyPositions = [];

window.addEventListener('keydown', moveByKeys);
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function startGame(){
    game.font = elementSize - 8 + 'px verdana';
    game.textAlign = 'end';

    let map = maps[level];

    if(!map){
        gameWin()
        return  
    }

    let mapRow = map.trim().split('\n');
    let mapRowCol = mapRow.map( row => row.trim().split(''));

    showLives();

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    if(!timeStart){
        if(playerPosition.x != undefined && playerPosition.y != undefined){
            timeStart = Date.now();
            timeInterval = setInterval(showTime, 100);
        }
    }

    mapRowCol.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI+1);
            const posY = elementSize * (rowI+1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
                console.log({giftPosition});
            } else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY
                })
            }

            game.fillText(emoji, posX, posY - (elementSize / 4));
        })
    });
    movePlayer();
    showRecord();
}

function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(2));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10;
    console.log(canvasSize, elementSize);

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
    movePlayer();
}

function showLives(){
    // spanLives.innerHTML = emojis['HEART'].repeat(lives);
    
    const countHeart = Array(lives).fill(emojis['HEART']).join('');

    spanLives.innerHTML = "";
    spanLives.append(countHeart);
}

function showTime(){
    timePlayer = Date.now() - timeStart;
    spanTime.innerHTML = timePlayer;
}

function gameWin(){
    clearInterval(timeInterval);
    alert('Ganaste la partida!');

    let recordTime = localStorage.getItem('record');

    console.log(timePlayer);
    console.log(recordTime);
    if(recordTime){
        if(recordTime >= timePlayer){
            localStorage.setItem('record', timePlayer);
            pResult.innerHTML = 'Felicidades, nuevo record!';
        } else{
            pResult.innerHTML = 'No superaste el record, sigue intentando';
        }        
    } else{
        localStorage.setItem('record', timePlayer)
    }
    console.log(recordTime, timePlayer);
    return // location.reload();
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record');
}

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
    console.log(event);
    if(event.key == 'ArrowUp'){
        moveUp();
    } else if(event.key == 'ArrowLeft'){
        moveLeft();
    } else if(event.key == 'ArrowRight'){
        moveRight();
    } else if(event.key == 'ArrowDown'){
        moveDown();
    }
}

function moveUp() {
    if(playerPosition.y > (elementSize + 1)){
        playerPosition.y -= elementSize;
    }
    startGame();
}

function moveLeft() {
    if(playerPosition.x > (elementSize + 1)){
        playerPosition.x -= elementSize;
    }
    startGame();
}

function moveRight() {
    if(playerPosition.x < (canvasSize - 1)){
        playerPosition.x += elementSize;
    } 
    startGame();
}

function moveDown() {
    if(playerPosition.y < (canvasSize - 1)){
        playerPosition.y += elementSize;
    }
    startGame();
}

function movePlayer(){
    const giftCollisionX = giftPosition.x.toFixed(2) == playerPosition.x.toFixed(2);
    const giftCollisionY = giftPosition.y.toFixed(2) == playerPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision){
        level++;
        startGame();
    }

    const enemyCollision = enemyPositions.find( enemy => {
        const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    })

    if(enemyCollision){
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        alert('Perdiste!');
        lives--;
        if(lives <= 0){
            level = 0;
            lives = 3;
            clearInterval(timeInterval);
            startTime = undefined;
        }
        startGame();
    }

    // for (let i = 0; i < enemyPositions.length; i++) {
    //     if(enemyPositions[i].x == playerPosition.x && enemyPositions[i].y == playerPosition.y){
    //         game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y - (elementSize / 4));
    //         
    //         playerPosition.x = undefined;
    //         playerPosition.y = undefined;
    //         startGame()
    //         console.log(live);
    //         console.log('Boom!');
    //     }
    // } 
    
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y - (elementSize / 4));
}
