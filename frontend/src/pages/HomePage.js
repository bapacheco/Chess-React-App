//import { useEffect } from "react";

import Body from "../components/Body";
import Button from "react-bootstrap/Button";
import { Chessboard } from "react-chessboard";

import { useGameProvider } from "../contexts/GameProvider";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    const { setGameType } = useGameProvider();
    const navigate = useNavigate();

    const playLocal = () => {
        setGameType('local');
        localStorage.setItem("game-type", 'local');
        navigate('/play');
    };

    return (
        <Body>
            <h1>Home Page</h1>

            <div className="ChessHome">
                
                <Chessboard id="HomeBoard"
                position={"start"} 
                arePiecesDraggable={false} />
                <h2>Click here to play chess - 2 player local</h2>
                <div className="mt-4 mb-4">
                    <Button variant="primary" size="lg" onClick={playLocal}>Play Now Locally</Button>
                </div>
            </div>
        </Body>
    );
}