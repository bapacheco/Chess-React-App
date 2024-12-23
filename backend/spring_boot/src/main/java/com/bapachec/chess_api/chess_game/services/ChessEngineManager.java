package com.bapachec.chess_api.chess_game.services;

import com.github.bapachec.chessengine.ChessEngine;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChessEngineManager {
    private final Map<String, ChessListener> userListeners = new ConcurrentHashMap<>();

    public ChessListener getListenerForUser(String userId) {
        return userListeners.computeIfAbsent(userId, id -> {
            ChessEngine engine = new ChessEngine();
            return new ChessListener(engine);
        });
    }

    public ChessListener getEngineForUser(String userId) {
        return getListenerForUser(userId);
    }

    public void removeEngineForUser(String userId) {
        userListeners.remove(userId);
    }

}
