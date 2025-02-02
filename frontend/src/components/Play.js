import { useGameProvider } from "../contexts/GameProvider";
import { useEffect, useState } from "react";
//import ChessGame from "../components/ChessGame";
import { Button } from "react-bootstrap";
import Spinner  from 'react-bootstrap/Spinner';

//from chessgamejs
import { Chessboard } from "react-chessboard";
import { useWebSocket } from "../contexts/WebSocketProvider";

export default function Play() {
    var map = {a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7};
    const { sendMove, board, setBoard, isValid } = useWebSocket();

    const [promotionPiece, setPromotionPiece] = useState(null); //piece or square
    const { gameId, local_game_start, saved_game } = useGameProvider();
    
    console.log(board, " BEFORE USEEFFECT");
    useEffect(() => {
        //let saved_fen = saved_game();
        //if (saved_fen === null) {
            (async () => {
                let saved_fen = await saved_game();
                if (saved_fen === null) {
                    saved_fen = await local_game_start();
                }
                setBoard(saved_fen);
            }) ();
        //}
        
    }, [gameId, local_game_start, saved_game]);

    
    const handlePromotionPiece = (piece) => {

    }

    const convertToMatrix = (fen_string) => {
        const matrix = [];
        const rows = fen_string.split("/");
        for (let i = 0; i < 8; i++) {
            //this is how to make row in matrix
            matrix[i] = [];

            let row = rows[i];
            let col = 0;
            
            for (const char of row) {
                if (char >= '0' && char <= '9') {
                    const emptySpaces = parseInt(char);
                    for (let j = 0; j < emptySpaces; j++) {
                        matrix[i][col++] = '_';
                    }
                } else {
                    matrix[i][col++] = char;
                }
            }
        }

        return matrix;
    };

    const convertToFen = (matrix) => {
        for (let i = 0; i < 8; i++) {
            let emptyCount = 0;
            for (let j = 0; j < 8; j++) {
                const spot = matrix[i][j];
                if (spot.toLowerCase() !== spot.toUpperCase()) {
                    if (emptyCount > 0) {
                        //fen.append(emptyCount);
                        emptyCount = 0;
                    }
                    //fen.append(spot);
                }
                else {
                    emptyCount = emptyCount + 1;
                }
            }
        }
    };

    const updateBoard = (sourceSquare, targetSquare) => {
        let fen_string = board;
        const matrix = convertToMatrix(fen_string);
        console.log(matrix);
        
        const charA1 = sourceSquare[0];
        const startCol = map[charA1];
        const charA2 = parseInt(sourceSquare[1]);
        const startRow = 8 - charA2;

        const charB1 = targetSquare[0];
        const targetCol = map[charB1];
        const charB2 = parseInt(targetSquare[1]);
        const targetRow = 8 - charB2;

        console.log(startRow, startCol, targetRow, targetCol);


        const piece = matrix[startRow][startCol];

        if (!piece) return board;

        matrix[startRow][startCol] = '_';
        matrix[targetRow][targetCol] = piece;


        return matrix;
    };

    function onDrop(sourceSquare, targetSquare) {
        const newBoardState = updateBoard(sourceSquare, targetSquare);
        setBoard(newBoardState);
        console.log(newBoardState);

        sendMove(gameId.current, sourceSquare, targetSquare);

    }


    return (
        <>
            {board === undefined ? 
                <Spinner animation="border" variant="info" />
            :
                <>
                    {board === null ?
                        <p>Could not connect to backend</p>
                    :
                        <div className="PlayArea">
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
                            <div className="d-flex gap-5 mt-3">
                            <Button variant="secondary" size="lg">Reset Game</Button>
                            <Button variant="danger" size="lg">Request Draw</Button>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}