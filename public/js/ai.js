
class ChessAI {
    constructor(chess) {
        this.chess = chess;
        this.nodesCount = 0;
    }

    makeMove(depth = 2) {
        this.nodesCount = 0;
        const bestMoveInfo = this.minimaxRoot(depth, true);
        console.log(`AI Evaluated ${this.nodesCount} positions. Best move: ${bestMoveInfo.bestMove}`);
        return bestMoveInfo.bestMove;
    }

    minimaxRoot(depth, isMaximisingPlayer) {
        // Generates moves (verbose: true gives details like { from: 'a2', to: 'a3', ... })
        const newGameMoves = this.chess.moves({ verbose: true });
        let bestMove = -9999;
        let bestMoveFound;

        // Optimization: Shuffle moves to add variety if evaluations are equal
        newGameMoves.sort(() => Math.random() - 0.5);

        for (let i = 0; i < newGameMoves.length; i++) {
            const newGameMove = newGameMoves[i];
            this.chess.move(newGameMove);
            const value = this.minimax(depth - 1, -10000, 10000, !isMaximisingPlayer);
            this.chess.undo();
            if (value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }
        return {
            bestMove: bestMoveFound,
            value: bestMove
        };
    }

    minimax(depth, alpha, beta, isMaximisingPlayer) {
        this.nodesCount++;
        if (depth === 0) {
            // Updated to pass the board array to the global evaluateBoard function
            return -evaluateBoard(this.chess.board());
        }

        const newGameMoves = this.chess.moves({ verbose: true });

        if (isMaximisingPlayer) {
            let bestMove = -9999;
            for (let i = 0; i < newGameMoves.length; i++) {
                this.chess.move(newGameMoves[i]);
                bestMove = Math.max(bestMove, this.minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
                this.chess.undo();
                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            let bestMove = 9999;
            for (let i = 0; i < newGameMoves.length; i++) {
                this.chess.move(newGameMoves[i]);
                bestMove = Math.min(bestMove, this.minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
                this.chess.undo();
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    }
}
