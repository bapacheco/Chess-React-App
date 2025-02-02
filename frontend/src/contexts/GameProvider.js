import { createContext, useContext, useCallback, useRef, useState } from "react";
import { useApi } from "./ApiProvider";

const GameProviderContext = createContext();
//todo move gameid and turn to play component alongside fen,
export default function GameProvider({ children }) {
    //let gameId = null;
    //let turn = "";
    //const [fen, setFen] = useState();
    const gameId = useRef();
    const turn = useRef("");
    //const [gameId, SetGameId] = useState(null);
    //const [fen, setFen] = useState();
    //const [turn, setTurn] = useState();
    const count = useRef(0);
    const api = useApi();


    const saved_game = useCallback(async() => {

        let fen = null;
        const response = await api.get('spring', '/get-local-game');
        
        if (response.ok) {
            if (response.status === 200) {
                gameId.current = response.data.local_game_id;
                fen = response.data.fen;
                turn.current = response.data.turn;
            }
        }
        
        return fen;

    }, [api]);

    const local_game_start = useCallback(async() => {
        
        console.log("EXECUTED: ", count);
        count.current = count.current + 1;
        let fen = null;
        
        const response = await api.post('spring', '/start-game-local');
        console.log(response.ok);
        if (!response.ok) {
            //flash here
            console.log('Error', response);
        }
        else if (response.ok) {
            //console.log('Data of response', response.data);
            if (response.status === 200) {
                localStorage.setItem('local_game_id', response.data.local_game_id);
                localStorage.setItem('fen', response.data.fen);
                localStorage.setItem('turn', response.data.turn);
                gameId.current = response.data.local_game_id;
                fen = response.data.fen;
                turn.current = response.data.turn;
            }
        }
        console.log(fen + " FEN");
        return fen;
    }, [api]);

    //took out turn from context
    return (
        <GameProviderContext.Provider value={{gameId, saved_game, local_game_start}}>
            { children }
        </GameProviderContext.Provider>
    );

}

export function useGameProvider() {
    return useContext(GameProviderContext);
}