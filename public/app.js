let messageElement = document.getElementById("message");
let infoElement = document.getElementById("gameInfo");
let gameID = -1;
let myTurn = 0;
let board = "111111111";
let XO;
let flag = true;
let turns = 0;
const apiURL = "http://localhost:3003/api"; //='/api'

function gameOver(result) {
    console.log(result);
    if (result === 4) {
        infoElement.innerText = "Draw";
    } else if ((result === 2 && XO === 'X') || (result === 3 && XO === 'O')) {
        infoElement.innerText = "You win !!";
    } else {
        infoElement.innerText = "You lose!";
    }
    gameID = -1;
}

function fillBoard(board) {
    if (board=="111111111"){
        for (let i=0;i<9;i++){
            document.getElementById(`pole${i}`).style.background = 'black';
        }
    }
    for (let i = 0; i < 9; i++) {
        let button = document.getElementById(`pole${i}`);
        board[i] === '2' ? button.innerHTML = "X" : (board[i] === '3' ? button.innerHTML = "O" : button.innerHTML = "");
    }
}

async function waitingBoard() {
    res = await fetch(apiURL + "?id=waitingBoard");
    data = await res.json();
    console.log(data);
    if (data.ok === '1' && board != data.board) {
        board = data.board;
        flag = true;
        fillBoard(board);
    }
}

//setInterval(waitingBoard,5000);

function checkWin() {
    for (let i = 0; i < 3; i++) {
        for (let j = 2; j <= 3; j++) {
            if (board[3 * i] === board[3 * i + 1] && board[3 * i] === board[3 * i + 2] && board[3 * i] === "" + j) {
                document.getElementById(`pole${3 * i + 1}`).style.background = 'yellow';
                document.getElementById(`pole${3 * i + 2}`).style.background = 'yellow';
                document.getElementById(`pole${3 * i}`).style.background = 'yellow';
                return j;
            }
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] === "" + j) {
                document.getElementById(`pole${i + 3}`).style.background = 'yellow';
                document.getElementById(`pole${i + 6}`).style.background = 'yellow';
                document.getElementById(`pole${i}`).style.background = 'yellow';
                return j;
            }
        }
    }
    for (let j = 2; j <= 3; j++) {
        if (board[0] === board[4] && board[0] === board[8] && board[0] === "" + j) {
            document.getElementById(`pole${0}`).style.background = 'yellow';
            document.getElementById(`pole${4}`).style.background = 'yellow';
            document.getElementById(`pole${8}`).style.background = 'yellow';
            return j;
        }
        if (board[2] === board[4] && board[2] === board[6] && board[2] === "" + j) {
            document.getElementById(`pole${2}`).style.background = 'yellow';
            document.getElementById(`pole${4}`).style.background = 'yellow';
            document.getElementById(`pole${6}`).style.background = 'yellow';
            return j;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] === '1') {
            return 0;
        }
    }
    return 4;
}

function begin() {
    if (gameID !== -1) {
        return;
    }
    board = "111111111";
    gameID = -1;
    fillBoard(board);
    fetch(apiURL + "?id=begin")
        .then((response) => {
            messageElement.innerText = "Ожидание соперника";
            return response.json();
        })
        .then((data) => {
            gameID = parseFloat(data.gameID);
            myTurn = parseFloat(data.yourTurn);
            XO = data.XO;
        })
        .then(async () => {
            while (gameID === -1) {
                let res = await fetch(apiURL + "?id=waiting");
                let data = await res.json();
                gameID = parseFloat(data.gameID);
                if (gameID != -1) {
                    myTurn = parseFloat(data.yourTurn);
                    XO = data.XO;
                    break;
                }
            }
        })
        .then(() => {
            messageElement.innerText = "Игра " + gameID + " началась";
        })
        .then(() => {
            console.log(myTurn);
            game();
        })
}

function game() {
    let result = checkWin();
    if (result != 0) {
        gameOver(result);
        return;
    } else if (myTurn === 1) {
        infoElement.innerText = "Ваш ход";
    } else {
        infoElement.innerText = "Ожидается ход соперника";
        flag = false;
        let interval = setInterval(() => {
            waitingBoard();
            if (flag) {
                clearInterval(interval);
                myTurn = 1;
                fillBoard(board);
                game();
            }
        }, 1000);
    }

}


function turn(pole) {
    if (myTurn !== 1 || board[pole] !== "1") {
        return;
    }
    let button = document.getElementById(`pole${pole}`);
    button.innerText = XO;
    let digit;
    XO === 'X' ? digit = 2 : digit = 3;
    let url = `${apiURL}?id=turn&pole=${pole}&xo=${digit}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            board = data.board;
        })
        .then(() => {
            fillBoard(board);
            myTurn = 0;
            console.log("turn " + myTurn);
            game();
        })

}
