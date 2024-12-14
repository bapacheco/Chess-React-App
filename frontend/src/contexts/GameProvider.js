import { useEffect, createContext, useContext, useState, useCallback, useLayoutEffect } from "react";
//import { useApi } from "./ApiProvider";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const GameProviderContext = createContext();

export default function GameProvider({ children }) {
    const [gameId, SetGameId] = useState(null);
    const [fen, setFen] = useState();
    const [turn, setTurn] = useState();
    //const api = useApi();

    const getGameID = useCallback(async () => {
        let response;
        try {
            response = await fetch(BASE_API_URL + '/api/chess/start-game-local', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                credentials: 'include',
            });

        } catch(error) {
            console.log("WRONG");
            console.error("HHHHHEEELP");
            response = {
                ok: false,
                status: 500,
                json: async() => { return {
                    code: 500,
                    message: 'The server is unresponsive',
                    description: error.toString(),
                };}

            };
        }
                
            console.log("ASYNC IS CALLED");

        return {
            ok: response.ok,
            status: response.status,
            body: response.status !== 204 ? await response.json() : null
        };

    }, []);

    
    useLayoutEffect(() => {

        (async () => {
            let savedGameID = localStorage.getItem('local_game_id');
            if (savedGameID) {
                SetGameId(savedGameID);
                setFen(localStorage.getItem('fen'));
                setTurn(localStorage.getItem('turn'));
            }
            else {
                const response = await getGameID();
                if (!response.ok) {
                    //flash here
                }
                else if (response.ok) {
                    localStorage.setItem('local_game_id', response.body.local_game_id);
                    SetGameId(response.body.local_game_id);
        
                    setFen(response.body.fen);
                    localStorage.setItem('fen', response.body.fen);
                    localStorage.setItem('turn', response.body.turn);
                }
   
            }
        }) ();

    }, [getGameID]);
    




    return (
        <GameProviderContext.Provider value={{gameId, getGameID, fen}}>
            { children }
        </GameProviderContext.Provider>
    );

}

export function useGameProvider() {
    return useContext(GameProviderContext);
}