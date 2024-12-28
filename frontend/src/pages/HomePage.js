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
            <div className="HomePage">
                <h1>Home Page</h1>
                
                <div className="mt-4 mb-4">
                <Chessboard 
                position={"start"} 
                arePiecesDraggable={false}
                boardWidth={500} />
                </div>
                <h2>Click here to play chess - 2 player local</h2>
                <div className="mt-4 mb-4">
                    <Button variant="primary" size="lg" onClick={playLocal}>Play Now</Button>
                </div>
            </div>
        </Body>
    );
}