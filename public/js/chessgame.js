const socket = io();
const game = new Chess();
const chessAI = new ChessAI(game);
const boardElement = document.querySelector(".chessboard");
const difficultySelect = document.getElementById("aiDifficulty");
const resetBtn = document.getElementById("resetBtn");

const whiteTimerEl = document.getElementById("whiteTimer");
const blackTimerEl = document.getElementById("blackTimer");

let draggedPiece = null;
let sourceSquare = null;
let isAiThinking = false;
let whiteTime = 600; // 10 minutes in seconds
let blackTime = 600;
let timerInterval = null;
let lastMove = null; // { from: 'e2', to: 'e4' }

// --- Piece-Square Tables (PST) and Piece Values are now in evaluation.js ---

// --- Timer Logic ---
const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (game.game_over()) {
            clearInterval(timerInterval);
            return;
        }

        if (game.turn() === 'w') {
            whiteTime--;
            updateTimerDisplay(whiteTimerEl, whiteTime);
            if (whiteTime <= 0) endGame("Black wins on time!");
        } else {
            blackTime--;
            updateTimerDisplay(blackTimerEl, blackTime);
            if (blackTime <= 0) endGame("White wins on time!");
        }
    }, 1000);
};

const updateTimerDisplay = (el, time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    el.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Highlight active timer
    if (game.turn() === 'w' && el.id === 'whiteTimer') {
        whiteTimerEl.classList.add('bg-orange-600');
        blackTimerEl.classList.remove('bg-orange-600');
    } else if (game.turn() === 'b' && el.id === 'blackTimer') {
        blackTimerEl.classList.add('bg-orange-600');
        whiteTimerEl.classList.remove('bg-orange-600');
    }
};

const endGame = (message) => {
    clearInterval(timerInterval);
    alert(message);
    if (difficultySelect.value !== 'player') {
        // Simple logic: if white time out -> loss.
        updateRating(message.includes("White wins") ? "win" : "loss");
    }
};

resetBtn.addEventListener("click", () => {
    game.reset();
    isAiThinking = false;
    whiteTime = 600;
    blackTime = 600;
    lastMove = null;
    updateTimerDisplay(whiteTimerEl, whiteTime);
    updateTimerDisplay(blackTimerEl, blackTime);
    clearInterval(timerInterval);
    whiteTimerEl.classList.remove('bg-orange-600');
    blackTimerEl.classList.remove('bg-orange-600');
    renderBoard();
});

// Update renderBoard to show highlights
const renderBoard = () => {
    const board = game.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );

            // Highlight last move
            const squareName = `${String.fromCharCode(97 + squareindex)}${8 - rowindex}`;
            if (lastMove && (lastMove.from === squareName || lastMove.to === squareName)) {
                squareElement.classList.add("highlight");
            }

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );

                pieceElement.innerText = getPieceUnicode(square);

                const isPlayerTurn = (game.turn() === 'w' && difficultySelect.value !== 'player') || difficultySelect.value === 'player';
                if (isPlayerTurn) {
                    pieceElement.draggable = true;
                } else {
                    pieceElement.classList.add('cursor-default');
                }

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowindex, col: squareindex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (sourceSquare && !isAiThinking) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSource);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    try {
        const result = game.move(move);
        if (result) {
            lastMove = result; // { color: 'w', from: 'e2', to: 'e4', ... }
            if (!timerInterval) startTimer(); // Start timer on first move

            renderBoard();
            checkGameStatus();

            if (difficultySelect.value !== 'player' && game.turn() === 'b' && !game.game_over()) {
                isAiThinking = true;
                // Use setTimeout to allow UI to render the player's move first
                setTimeout(makeAiMove, 250);
            }
        }
    } catch (error) {
        // Invalid move
    }
};

const checkGameStatus = () => {
    if (game.in_checkmate()) {
        let result = "";
        if (game.turn() === 'b') {
            alert("Checkmate! You Win!");
            result = "win";
        } else {
            alert("Checkmate! You Lose!");
            result = "loss";
        }

        if (difficultySelect.value !== 'player') {
            updateRating(result);
        }
    } else if (game.in_draw()) {
        alert("Draw!");
        if (difficultySelect.value !== 'player') {
            updateRating("draw");
        }
    } else if (game.in_check()) {
        // Optional: Highlight king
    }
};

const updateRating = async (result) => {
    try {
        const response = await fetch('/game/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result,
                difficulty: difficultySelect.value
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log("New Rating:", data.newRating);
            // Optionally update UI
            location.reload(); // Simple reload to show new stats
        }
    } catch (err) {
        console.error(err);
    }
};

const makeAiMove = () => {
    const difficulty = difficultySelect.value;

    if (difficulty === 'random') {
        makeRandomMove();
    } else if (difficulty === 'minimax') {
        const bestMove = chessAI.makeMove(2); // Depth 2
        game.move(bestMove);
    }

    renderBoard();
    checkGameStatus();
    isAiThinking = false;
};

// --- Random AI ---
const makeRandomMove = () => {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
};

// --- Minimax AI ---
// Logic moved to ai.js and evaluation.js

const getPieceUnicode = (piece) => {
    if (piece.color === 'w') {
        const whiteMap = { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' };
        return whiteMap[piece.type];
    } else {
        const blackMap = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
        return blackMap[piece.type];
    }
};

renderBoard();
