import ChessGame from "../components/ChessGame";
import Button from "react-bootstrap/Button";
import Spinner  from 'react-bootstrap/Spinner';
import { useGameProvider } from "../contexts/GameProvider";

export default function Play() {
    const {gameId, fen, turn} = useGameProvider();
    console.log(fen);
    return (
        <>
        {fen === undefined ? 
            <Spinner animation="border" variant="info" />
        :
            <>
                {fen === null ?
                    <p>Could not connect to backend</p>
                :
                    <div className="PlayArea">
                        <ChessGame gameId={gameId} fen={fen} turn={turn}/>
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