package com.bapachec.chess_api.chess_game.DTO;

import com.bapachec.chess_api.chess_game.entity.GameResult;

public record ChessMoveResponse(String fen, boolean isValid, boolean GameComplete, GameResult gameResult) { }
