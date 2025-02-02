package com.bapachec.chess_api.chess_game.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveRequest {

    //MoveRequestDTO move;
    String game_id;
    String start;
    String end;


    public MoveRequest() {}
    public MoveRequest(String start, String end, String fen, String turn, String game_id) {
        this.game_id = game_id;
        this.start = start;
        this.end = end;
    }

    /*
    public MoveRequestDTO getMove() {
        return this.move;
    }
     */

}
