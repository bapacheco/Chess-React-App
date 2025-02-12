import { useGameProvider } from "../contexts/GameProvider";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Spinner  from 'react-bootstrap/Spinner';

//from chessgamejs
import { Chessboard } from "react-chessboard";

import { useWebSocket } from "../contexts/WebSocketProvider";
import { useApi } from "../contexts/ApiProvider";
import Popup from "../components/Popup";

//if playing local, draw should not be prompted twice, only in multiplayer
//if playing with ai, draw is replaced with surrender
export default function Play() {
    var map = {a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7};
    const { sendMove, board, setBoard } = useWebSocket();

    const [promotionPiece, setPromotionPiece] = useState(null); //piece or square
    const { gameId } = useGameProvider();
    const { isGameComplete, gameResult, gameType } = useGameProvider();

    const api = useApi();

    //const [isGameComplete, setIsGameComplete] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        acceptText: "",
        onAccept: null,
        type: "",
    });

    console.log(board, " BEFORE USEEFFECT");
    //useeffect was used here

    const gameResultTextMap = {
        WHITE_WIN: "White Wins!",
        BLACK_WIN: "Black Wins!",
        STALEMATE: "Stalemate!",
        DRAW: "Draw!"
    };


    useEffect(() => {
        if (isGameComplete) {

            gameCompleteModal();
        }

    }, [isGameComplete]);

    
    const handlePromotionPiece = (piece) => {

    };

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

    const gameCompleteModal = () => {

        setModalState({
            isOpen: true,
            title: "Game Over",
            acceptText: "New Game",
            onAccept: onReset,
            type: "gameover"
        });

    };

    const resetModal = () => {

        setModalState({
            isOpen: true,
            title: "Reset Game",
            acceptText: "Reset Game",
            onAccept: onReset,
            type: "reset"
        });

    };

    //move reset and draw to GameProvider
    const onReset = async(ev) => {
        const response = await api.post('spring', '/reset-game-'+gameType);
        if (response.ok && response.status === 200) {
            //flash ok
            setBoard(response.data.fen);
        }
        else {
            //flash fail
        }
        setModalState(prev => ({...prev, isOpen: false}))
    };

    const drawModal = () => {

        setModalState({
            isOpen: true,
            title: "Draw",
            acceptText: "Request Draw",
            onAccept: onDraw,
            type: "draw"
        });

    };

    const onDraw = () => {
        //action for request draw
        setModalState(prev => ({...prev, isOpen: false}))
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

    };


    return (
        <>
            {board === undefined ? 
                <Spinner animation="border" variant="info" />
            :
                <>
                    {board === null ?
                        <p>Could not connect to backend</p>
                    :
                    <>
                        <div className="PlayArea">
                            <Chessboard position={board}
                            arePiecesDraggable={!isGameComplete}
                            onPieceDrop={onDrop}
                        />
                            {promotionPiece && 
                            //todo make this as Modal (popup component)
                            (
                                <div>
                                    <Button onClick={() => handlePromotionPiece('q')}>Queen</Button>
                                    <Button onClick={() => handlePromotionPiece('r')}>Rook</Button>
                                    <Button onClick={() => handlePromotionPiece('b')}>Bishop</Button>
                                    <Button onClick={() => handlePromotionPiece('n')}>Knight</Button>

                                </div>
                            )}
                        </div>
                        <div className="d-flex gap-5 mt-3">
                        <Button variant="secondary" size="lg" onClick={resetModal}>Reset</Button>
                        <>
                            {!isGameComplete && <Button variant="danger" size="lg" onClick={drawModal}>Draw</Button>}
                        </>
                        </div>


                        
                        <Popup isOpen={modalState.isOpen} onClose={() => setModalState(prev => ({...prev, isOpen: false}))}
                        title={modalState.title} onAccept={modalState.onAccept} acceptText={modalState.acceptText}>
                            <>
                                {modalState.type === "reset" ? 
                                    <>
                                        <h5>Your progress will be lost</h5>
                                        <br></br>
                                        <h5>Proceed?</h5>
                                    </>
                                :
                                    <>
                                        <h5>Both players agree to draw</h5>
                                        <br></br>
                                        <h5>Proceed?</h5>
                                    </>
                                }
                                {isGameComplete &&
                                    <>
                                        <h5>{gameResultTextMap[gameResult]}</h5>
                                        <br></br>
                                        <h5>Would you like to play again?</h5>
                                    </>
                                }
                            </>
                        </Popup>

                    </>
                    }
                </>
            }
        </>
    );
}