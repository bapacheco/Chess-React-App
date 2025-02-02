package com.bapachec.chess_api.chess_game;

import com.bapachec.chess_api.chess_game.DTO.ChessMoveResponse;
import com.bapachec.chess_api.chess_game.DTO.MoveRequest;
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
        log.info("REQUEST IN MAKEMOVE: {}, {}, {}", request.getStart(), request.getEnd(), request.getGame_id());
        Long numId = Long.valueOf(request.getGame_id());

        LocalGameEntity game = localGameRepository.findById(numId).orElseThrow(()
                -> new GameNotFoundException("Game not found: "+ request.getGame_id()));


        String start = request.getStart();
        String end = request.getEnd();

        log.info("AUTH: {}", headerAccessor.getUser());
        ChessListener listener = engineManager.getListenerForUser(headerAccessor.getUser().getName());


        char [][] arr;
        listener.setStartSquare(start);
        listener.setTargetSquare(end);
        listener.run();
        boolean result = listener.isSuccess();

        arr = listener.getArr();
        String newFen = ChessService.convertToFen(arr);

        newFen = newFen + " " +listener.getCurrentTurn();

        if (result) {
            game.setFen(newFen);
            localGameRepository.save(game);
        }

        return new ChessMoveResponse(newFen, result);
    }
}
