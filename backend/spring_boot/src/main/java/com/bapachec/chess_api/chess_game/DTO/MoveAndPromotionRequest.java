package com.bapachec.chess_api.chess_game.DTO;

import com.bapachec.chess_api.chess_game.entity.GameResult;

public record MoveAndPromotionRequest( String game_id, String start, String end, int promotionChoice) { }
