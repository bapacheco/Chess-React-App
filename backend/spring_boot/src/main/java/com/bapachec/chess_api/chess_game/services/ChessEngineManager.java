package com.bapachec.chess_api.chess_game.services;

import com.github.bapachec.chessengine.ChessEngine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ChessEngineManager {
    private final Map<String, ChessListener> userListeners = new ConcurrentHashMap<>();

    public ChessListener getListenerForUser(String userId) {
        return userListeners.get(userId);

    }

    public ChessListener createListenerForUser(String userId, GameSetting setting) {
        if (getListenerForUser(userId) != null) {
            return null;
        }
        ChessEngine engine = new ChessEngine();
        ChessListener listener = new ChessListener(engine, setting);
        userListeners.put(userId, listener);
        return listener;
    }

    //todo: there will be a way to let engine to reset
    public void resetEngineForListener(String userId) {
        ChessListener listener = userListeners.get(userId);
        if (listener == null) {
            return;
        }
        log.info("Reset in manager BEFORE RESET FEN {}", ChessService.convertToFen(listener.getArr()));
        ChessEngine engine = new ChessEngine();
        listener.setEngine(engine);
        engine.addListener(listener);
        listener.setArr(ChessService.convertToMatrix("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));
        listener.setCurrentTurn("w");
        engine.start();
        //userListeners.put(userId, listener);
        log.info("Reset in manager AFTER RESET FEN: {}", ChessService.convertToFen(listener.getArr()));
    }

    public ChessListener getEngineForUser(String userId) {
        return getListenerForUser(userId);
    }

    public void removeEngineForUser(String userId) {
        userListeners.remove(userId);
    }

}
