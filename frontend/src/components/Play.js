import ChessGame from "../components/ChessGame";
import Button from "react-bootstrap/Button";
import Spinner  from 'react-bootstrap/Spinner';
import { useGameProvider } from "../contexts/GameProvider";

export default function Play() {
    const {gameId, fen} = useGameProvider();
    console.log(fen);
    return (

        <>
        {fen === undefined ? 
            <Spinner animation="border" variant="info" />
        :
            <>
                {fen !== null && 
                    <div className="PlayArea">
                        <ChessGame />
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