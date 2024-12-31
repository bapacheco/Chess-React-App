import { Chessboard } from "react-chessboard";
import { useGameProvider } from "../contexts/GameProvider";
import { useApi } from "../contexts/ApiProvider";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function ChessGame() {

    const {gameId} = useGameProvider();
    const [board, setBoard] = useState(localStorage.getItem('fen'));
    const [turn, setTurn] = useState(localStorage.getItem('turn'));
    //const [position, setPosition] = useState(localStorage.getItem('fen'));
    const [promotionPiece, setPromotionPiece] = useState(null); //piece or square

    const api = useApi();

    const handlePromotionPiece = (piece) => {

    }

    const makeMove = async(data) => {
        try {

            const response = await api.post('spring', '/local-make-move', data);
            console.log('RESPONSE IN MAKEMOVE', response);
            if (response.ok) {
                if (response.data.valid === 'true') {
                    console.log("ENTERED TRUE BRANCH");
                    if (turn === "w") {
                        setTurn("b");
                        localStorage.setItem("turn", "b");
                    }
                    else {
                        setTurn("w");
                        localStorage.setItem("turn", "w");
                    }
                    setBoard(response.data.fen);
                    localStorage.setItem("fen", response.data.fen);
                    
                }

            }
        } catch (error) {
            console.log("WRONG", error);
        }

    }

    function onDrop(sourceSquare, targetSquare) {
        //const lee = localStorage.getItem('fen')
        //console.log("board");
        //console.log(board);
        //console.log("Turn");
        //console.log(turn);
        const data = {
            "game_id": gameId,
            "start": sourceSquare,
            "end": targetSquare,
            "fen": board,
            "turn": turn
        };

        makeMove(data);

    }

    return (
        <div>
            <Chessboard position={board}
            onPieceDrop={onDrop}
            boardWidth={800}
            />
            {promotionPiece && (
                <div>
                    <Button onClick={() => handlePromotionPiece('q')}>Queen</Button>
                    <Button onClick={() => handlePromotionPiece('r')}>Rook</Button>
                    <Button onClick={() => handlePromotionPiece('b')}>Bishop</Button>
                    <Button onClick={() => handlePromotionPiece('n')}>Knight</Button>

                </div>
            )}
        </div>
    );
}