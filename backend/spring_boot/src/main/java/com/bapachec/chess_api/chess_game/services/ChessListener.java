package com.bapachec.chess_api.chess_game.services;

import com.github.bapachec.chessengine.ChessEngine;
import com.github.bapachec.chessengine.ChessUI;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

public class ChessListener implements ChessUI {

    ChessEngine engine;
    @Getter
    @Setter
    char[][] arr;
    @Setter
    String startSquare;
    @Setter
    String targetSquare;

    @Getter
    @Setter
    boolean success;

    @Getter
    @Setter
    String currentTurn;

    public ChessListener(ChessEngine engine) {
        this.engine = engine;
        this.engine.addListener(this);
        currentTurn = "w";
    }

    @Override
    public void run() {
        engine.start(arr);
        if (!engine.isGameOver()) {
            boolean result = engine.makeMove(startSquare, targetSquare);
            if (result) {
                if (getCurrentTurn().equalsIgnoreCase("b")) {
                    setCurrentTurn("w");
                }
                else {
                    setCurrentTurn("b");
                }
            }
            setSuccess(result);

        }
        //display the match is over

    }

    @Override
    public int promotionRequest() {
        return 0;
    }


    //calls board.data in 2d char
    @Override
    public void onBoardUpdated(char[][] chars) {
        setArr(chars);
    }

    //warnings or messages below
    @Override
    public void kingInCheckWarning(boolean b) {

    }

    @Override
    public void checkmate(boolean b) {

    }

    @Override
    public void stalemate() {

    }

    @Override
    public boolean requestingDraw(boolean b) {
        return false;
    }

    @Override
    public void draw() {

    }



}
