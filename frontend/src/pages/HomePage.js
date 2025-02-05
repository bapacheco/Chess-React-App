//import { useEffect } from "react";

import Body from "../components/Body";
import Button from "react-bootstrap/Button";
import { Chessboard } from "react-chessboard";

//import { useApi } from "../contexts/ApiProvider";
//import { useUser } from "../contexts/UserProvider";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    //const api = useApi();
    //const { user, setUser , guest_login } = useUser();
    //const navigate = useNavigate();
    //const location = useLocation();
    const navigate = useNavigate();

    const playLocal = () => {
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
                    <Button variant="primary" size="lg" onClick={playLocal}>Play Now</Button>
                </div>
            </div>
        </Body>
    );
}