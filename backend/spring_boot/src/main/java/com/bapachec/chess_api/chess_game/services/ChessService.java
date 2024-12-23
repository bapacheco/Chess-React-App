package com.bapachec.chess_api.chess_game.services;
import java.util.Random;

public class ChessService {

    //for online match generation
    public static String generateUniqueID() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random rand = new Random();
        StringBuilder gameID = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            int randIndex = rand.nextInt(characters.length());
            char randChar = characters.charAt(randIndex);
            gameID.append(randChar);
        }

        return gameID.toString();
    }

    public static String convertToFen(char[][] boardData) {
        StringBuilder fen = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int emptyCount = 0;
            for (int j = 0; j < 8; j++) {
                char spot = boardData[i][j];
                if (Character.isLetter(spot)) {
                    if (emptyCount > 0) {
                        fen.append(emptyCount);
                        emptyCount = 0;
                    }
                    fen.append(spot);
                }
                else { emptyCount += 1; }

            }
            if (emptyCount > 0) {
                fen.append(emptyCount);
            }

            if (i != 7)
                fen.append("/");

        }

        return fen.toString();
    }

    public static char[][] convertToMatrix(String fen) {
        char[][] arr = new char[8][8];
        String[] rows = fen.split("/");

        for (int i = 0; i < 8; i++) {
            String row = rows[i];
            int col = 0;

            for (char ch : row.toCharArray()) {
                if (Character.isDigit(ch)) {
                    //empty spaces
                    int emptySpaces = Character.getNumericValue(ch);
                    for (int j = 0; j < emptySpaces; j++) {
                        arr[i][col++] = '_';
                    }
                } else {
                    arr[i][col++] = ch;
                }
            }
        }

        return arr;
    }
}
