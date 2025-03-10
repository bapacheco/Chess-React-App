package com.bapachec.chess_api.chess_game.services;

import com.bapachec.chess_api.chess_game.entity.GameResult;
import com.github.bapachec.chessengine.ChessEngine;
import com.github.bapachec.chessengine.ChessUI;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Setter
@Getter
public class ChessListener implements ChessUI {

    ChessEngine engine;

    char[][] arr;
    String startSquare;
    String targetSquare;

    int promotionChoice;

    boolean success;

    String currentTurn;

    GameSetting setting;

    GameResult gameOverResult;

    //gameover set to false
    boolean gameOver = false;


    public ChessListener(ChessEngine engine, GameSetting setting) {
        this.engine = engine;
        this.engine.addListener(this);
        //change with parameter
        currentTurn = "w";
        this.setting = setting;
        this.engine.start();
    }

    public ChessListener(ChessEngine engine, GameSetting setting, String turn, char[][] board) {
        this.engine = engine;
        this.engine.addListener(this);
        currentTurn = turn;
        this.setting = setting;
        arr = board;
        this.engine.start(arr, turn);
    }

    @Override
    public void run() {
        //engine.start(arr);
        if (!engine.isGameOver()) {
            boolean result = engine.makeMove(startSquare, targetSquare);
            if (result) {
                if (currentTurn.equalsIgnoreCase("b")) {
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
        return promotionChoice;
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
    public void checkmate(boolean whiteWon) {
        gameOver = true;
        if (whiteWon)
            gameOverResult = GameResult.WHITE_WIN;
        else
            gameOverResult = GameResult.BLACK_WIN;
    }

    @Override
    public void stalemate() {
        gameOver = true;
        gameOverResult = GameResult.STALEMATE;
    }

    @Override
    public boolean requestingDraw(boolean b) {
        //todo implement properly for online play

        return setting == GameSetting.LOCAL;

    }

    @Override
    public void draw() {
        gameOver = true;
        gameOverResult = GameResult.DRAW;
    }

    public void initiateDraw() {
        engine.requestDraw();
    }



}
