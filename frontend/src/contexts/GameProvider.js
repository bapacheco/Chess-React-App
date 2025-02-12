import { createContext, useContext, useCallback, useRef, useState } from "react";
import { useApi } from "./ApiProvider";

const GameProviderContext = createContext();
//todo move gameid and turn to play component alongside fen,
export default function GameProvider({ children }) {
    const [isGameComplete, setIsGameComplete] = useState();
    const [gameResult, setGameResult] = useState();
    const [gameType, setGameType] = useState(localStorage.getItem("game-type"));
    //consider switching ref to state variables
    const gameId = useRef();
    const turn = useRef("");

    //const [gameId, SetGameId] = useState(null);
    //const [fen, setFen] = useState();
    //const [turn, setTurn] = useState();
//    const count = useRef(0);
    const api = useApi();


    const saved_game = useCallback(async() => {
        console.log(gameType, "gameType SAVED_GAME");
        let fen = null;
        const response = await api.get('spring', '/get-game-'+gameType);
        
        if (response.ok) {
            if (response.status === 200) {
                gameId.current = response.data.local_game_id;
                fen = response.data.fen;
                turn.current = response.data.turn;

                setIsGameComplete(response.data.game_complete);
                if (response.data.game_complete === true) {
                    setGameResult(response.data.game_result);
                }
            }
        }
        
        return fen;

    }, [api]);

    const local_game_start = useCallback(async() => {
        
//        console.log("EXECUTED: ", count);
//        count.current = count.current + 1;
        console.log(gameType, "gameType game_Start");

        let fen = null;
        
        const response = await api.post('spring', '/start-game-'+gameType);
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
                setIsGameComplete(false);
            }
        }
        console.log(fen + " FEN");
        return fen;
    }, [api]);


    //took out turn from context
    return (
        <GameProviderContext.Provider value={{gameId, saved_game, local_game_start, 
        isGameComplete, setIsGameComplete, gameResult, setGameResult, setGameType, gameType}}>
            { children }
        </GameProviderContext.Provider>
    );

}

export function useGameProvider() {
    return useContext(GameProviderContext);
}