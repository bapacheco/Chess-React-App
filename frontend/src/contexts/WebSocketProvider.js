import { createContext, useContext, useEffect, useRef, useState } from "react";
//import { useGameProvider } from "./GameProvider";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useApi } from "./ApiProvider";

const WebSocketContext = createContext();

//consider moving localstorage saves to here
export default function WebSocketProvider({ children }) {
    //const { fen } = useGameProvider();
    const api = useApi();

    const [board, setBoard] = useState();
    const [isValid, setIsValid] = useState(false);
    const client = useRef(null);
    
    useEffect(() => {

        console.log("in user effect in websocket");
        const socket = api.getWebsocket();

        let stompClient = Stomp.over(socket);

        stompClient.connect({Authorization: `Bearer ${localStorage.getItem('access_token')}`}, (frame) => {
            console.log(frame);

            stompClient.subscribe("/topic/game", (message) => {
                const move = JSON.parse(message.body);
                setBoard(move.fen);
                setIsValid(move.isValid);
            });

        });

        /*
        stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("connected to websocket in spring-boot");
                
                //stompclient.subscribe content here

                //stompclient.subscribe errors here

            },
            onDisconnect: () => console.log("disconnected"),
        });

        */

        stompClient.activate();

        client.current = stompClient;

        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, []);

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

    return (
        <WebSocketContext.Provider value={{sendMove, board, setBoard, isValid}} >
            { children }
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}