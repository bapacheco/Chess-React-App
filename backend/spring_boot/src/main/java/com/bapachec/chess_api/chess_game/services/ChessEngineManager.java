package com.bapachec.chess_api.chess_game.services;

import com.github.bapachec.chessengine.ChessEngine;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChessEngineManager {
    private final Map<String, ChessListener> userListeners = new ConcurrentHashMap<>();

    public ChessListener getListenerForUser(String userId) {
        return userListeners.get(userId);

    }

    public ChessListener createListenerForUser(String userId) {
        ChessEngine engine = new ChessEngine();
        ChessListener listener = new ChessListener(engine);
        userListeners.put(userId, listener);
        return listener;
    }

    //todo change this so that it can be checked if game exists
    public ChessListener getEngineForUser(String userId) {
        return getListenerForUser(userId);
    }

    public void removeEngineForUser(String userId) {
        userListeners.remove(userId);
    }

}
