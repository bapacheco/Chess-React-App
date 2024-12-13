package com.bapachec.chess_api.chess_game;

import com.github.bapachec.chessengine.ChessEngine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChessEngineConfig {

    @Bean
    public ChessEngine chessEngine() {
        return new ChessEngine();
    }
}
