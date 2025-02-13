package com.bapachec.chess_api.chess_game;

import com.bapachec.chess_api.chess_game.DTO.ChessMoveResponse;
import com.bapachec.chess_api.chess_game.DTO.MoveRequest;
import com.bapachec.chess_api.chess_game.entity.GameResult;
import com.bapachec.chess_api.chess_game.entity.LocalGameEntity;
import com.bapachec.chess_api.chess_game.repository.LocalGameRepository;
import com.bapachec.chess_api.chess_game.services.ChessEngineManager;
import com.bapachec.chess_api.chess_game.services.ChessListener;
import com.bapachec.chess_api.chess_game.services.ChessService;
import com.bapachec.chess_api.exceptions.GameNotFoundException;
import com.bapachec.chess_api.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ChessWebSocketController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LocalGameRepository localGameRepository;

    private final ChessEngineManager engineManager;
    @Autowired
    public ChessWebSocketController(ChessEngineManager engineManager) {
        this.engineManager = engineManager;
    }

    private String getUserid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @MessageMapping("/move")
    @SendTo("/topic/game")
    public ChessMoveResponse makeMove(MoveRequest request, SimpMessageHeaderAccessor headerAccessor) throws GameNotFoundException {
        Long numId = Long.valueOf(request.getGame_id());

        LocalGameEntity game = localGameRepository.findById(numId).orElseThrow(()
                -> new GameNotFoundException("Game not found: "+ request.getGame_id()));


        String start = request.getStart();
        String end = request.getEnd();


        ChessListener listener = engineManager.getListenerForUser(headerAccessor.getUser().getName());


        char [][] arr;
        listener.setStartSquare(start);
        listener.setTargetSquare(end);
        listener.run();
        boolean result = listener.isSuccess();
        

        arr = listener.getArr();
        String newFen = ChessService.convertToFen(arr);
        String newFenToSave = newFen + " " +listener.getCurrentTurn();
        
        if (!result) {
            return new ChessMoveResponse(newFen, false, false, GameResult.NONE);
        }

        //assume result is true
        game.setFen(newFenToSave);


        //check if listener/engine is game complete, set entity to complete with game result
        if (!listener.isGameOver()) {
            localGameRepository.save(game);
            return new ChessMoveResponse(newFen, true, false, GameResult.NONE);
        }

        //assumes its game over
        GameResult gameResult = listener.getGameOverResult();
        game.gameWon(gameResult);
        return new ChessMoveResponse(newFen, true, true, gameResult);
    }
}
