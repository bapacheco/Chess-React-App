import { useEffect, createContext, useContext, useState, useCallback, useLayoutEffect } from "react";
import { useApi } from "./ApiProvider";
const BASE_API_URL = process.env.REACT_APP_SPRING_API_URL;
const GameProviderContext = createContext();

export default function GameProvider({ children }) {
    const [gameId, SetGameId] = useState(null);
    const [fen, setFen] = useState();
    const [turn, setTurn] = useState();

    const api = useApi();

    const getGameID = useCallback(async () => {
        const result = await api.post('spring', '/start-game-local');
        return result;
    }, [api]);

    
    useEffect(() => {

        (async () => {
            let savedGameID = localStorage.getItem('local_game_id');
            let savedFen = localStorage.getItem('fen');
            let savedTurn = localStorage.getItem('turn');
            if (savedGameID && savedFen && savedTurn) {
                SetGameId(savedGameID);
                setFen(savedFen);
                setTurn(savedTurn);
            }
            else {
                const response = await getGameID();
                if (!response.ok) {
                    //flash here
                    console.log('Error', response);
                }
                else if (response.ok) {
                    //console.log('Data of response', response.data);
                    localStorage.setItem('local_game_id', response.data.local_game_id);
                    SetGameId(response.data.local_game_id);
        
                    setFen(response.data.fen);
                    localStorage.setItem('fen', response.data.fen);
                    localStorage.setItem('turn', response.data.turn);
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