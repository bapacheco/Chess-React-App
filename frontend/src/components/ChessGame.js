import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function ChessGame() {

    const [position, SetPosition] = useState("start");

    const handleMove = (fromSquare, toSquare) => {
        console.log(fromSquare, toSquare);
        //todo
        return true;
    };


    return (
        <Chessboard 
        position={position}
        onPieceDrop={(sourceSquare, targetSquare) => {
            return handleMove(sourceSquare, targetSquare);
        }}
        />
    );
}