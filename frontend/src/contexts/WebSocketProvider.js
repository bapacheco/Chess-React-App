import { createContext, useContext, useEffect, useRef, useState } from "react";
//import { useGameProvider } from "./GameProvider";
import { Stomp } from "@stomp/stompjs";
import { useApi } from "./ApiProvider";
import { useGameProvider } from "./GameProvider";
const WebSocketContext = createContext();

export default function WebSocketProvider({ children }) {
    //const { fen } = useGameProvider();
    const api = useApi();

    const [board, setBoard] = useState();
    //const [isValid, setIsValid] = useState(false);
    const client = useRef(null);

    //gameid from gameprovider
    const { gameType, local_game_start, saved_game, setIsGameComplete,
        setGameResult, isGameComplete } = useGameProvider();
    
    //took out gameid from dependency
    useEffect(() => {
        //let saved_fen = saved_game();
        //if (saved_fen === null) {

        if (gameType === null)
            return;

            (async () => {
                let saved_fen = await saved_game(gameType);
                if (saved_fen === null) {
                    saved_fen = await local_game_start(gameType);
                }
                setBoard(saved_fen);
            }) ();
        //}
        
    }, [local_game_start, saved_game, gameType]);

    useEffect(() => {

        if (isGameComplete === null)
            return;
        if (isGameComplete)
            return;

        const socket = api.getWebsocket();

        let stompClient = Stomp.over(socket);

        stompClient.connect({Authorization: `Bearer ${localStorage.getItem('access_token')}`}, (frame) => {
            console.log(frame);

            stompClient.subscribe("/topic/game", (message) => {
                const move = JSON.parse(message.body);
                setBoard(move.fen);
                
                if (move.GameComplete) {
                    //set game complete
                    //set game result
                    setIsGameComplete(true);
                    setGameResult(move.gameResult);
                }
                //todo
                //check if game is completed then set state for gamecomplete/gameresult
                //setIsValid(move.isValid);
            });

        });

        stompClient.activate();

        client.current = stompClient;

        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [isGameComplete, api]);

    const sendMove = (game_id, start, end) => {
        console.log(client.current.connected);

        if (client.current && client.current.connected) {
            console.log(start);
            console.log(end);
            client.current.publish({
                destination: "/app/move",
                body: JSON.stringify({game_id, start, end}),
            });
        }
    };

    const sendMoveWithPromotion = (game_id, start, end, promotionChoice) => {
        if (client.current && client.current.connected) {
            console.log(start);
            console.log(end);
            console.log(promotionChoice);
            client.current.publish({
                destination: "/app/move-and-promote",
                body: JSON.stringify({game_id, start, end, promotionChoice}),
            });
        }
    };

    //took out isValid from context
    return (
        <WebSocketContext.Provider value={{sendMove, sendMoveWithPromotion, board, setBoard}} >
            { children }
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}