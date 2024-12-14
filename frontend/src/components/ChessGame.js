import { Chessboard } from "react-chessboard";
import { useGameProvider } from "../contexts/GameProvider";
import { useState } from "react";
import { Button } from "react-bootstrap";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function ChessGame() {

    const {gameId} = useGameProvider();
    const [board, setBoard] = useState(localStorage.getItem('fen'));
    const [turn, setTurn] = useState(localStorage.getItem('turn'));
    //const [position, setPosition] = useState(localStorage.getItem('fen'));
    const [promotionPiece, setPromotionPiece] = useState(null); //piece or square

    const handlePromotionPiece = (piece) => {

    }

    const makeMove = async(data) => {
        try {
            const response = await fetch(BASE_API_URL + '/api/chess/local-make-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid === 'true') {
                    //console.log(board);
                    if (turn === "w") {
                        setTurn("b");
                        localStorage.setItem("turn", "b");
                    }
                    else {
                        setTurn("w");
                        localStorage.setItem("turn", "w");
                    }
                    setBoard(data.fen);
                    localStorage.setItem("fen", data.fen);
                    
                }

            }
        } catch (error) {
            console.log("WRONG");
        }

    }

    function onDrop(sourceSquare, targetSquare) {
        //const lee = localStorage.getItem('fen')
        console.log("board");
        console.log(board);
        console.log("Turn");
        console.log(turn);
        const DummDate = {
            "game_id": gameId,
            "start": sourceSquare,
            "end": targetSquare,
            "fen": board,
            "turn": turn
        };

        makeMove(DummDate);

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