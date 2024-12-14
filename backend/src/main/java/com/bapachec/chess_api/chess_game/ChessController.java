package com.bapachec.chess_api.chess_game;

import com.bapachec.chess_api.chess_game.services.ChessEngineManager;
import com.bapachec.chess_api.chess_game.services.ChessListener;
import com.bapachec.chess_api.chess_game.services.ChessService;
import com.bapachec.chess_api.exceptions.GameNotFoundException;
import com.bapachec.chess_api.exceptions.UserNotFoundException;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/chess")
//@CrossOrigin
public class ChessController {

    private final ChessEngineManager engineManager;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LocalGameRepository localGameRepository;

    @Autowired
    public ChessController(ChessEngineManager engineManager) {
        this.engineManager = engineManager;
    }

    private String getUserid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    //todo add player ids, online match
    @PostMapping("/start-game-online")
    public ResponseEntity<Map<String, String>> startGameOnline() {
        log.info("REACHED IN START-GAME");
        Map<String, String> response = new HashMap<>();

        String gameID = ChessService.generateUniqueID();
        response.put("gameID", gameID);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/local-make-move")
    public ResponseEntity<Map<String, String>> makeMoveLocally(@RequestBody MoveRequest moveReq) throws UserNotFoundException, GameNotFoundException {
        Map<String, String> response = new HashMap<>();
        //log.info("REACHED IN LOCAL-MAKE-MOVE");

        //Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findById(Long.valueOf(getUserid()));

        //log.info(user.toString());
        //log.info("IS ID INCLUDED: " + moveReq.getGame_id());
        if (!user.isPresent()) {
            throw new UserNotFoundException("User not found");
        }
        Long numId = Long.valueOf(moveReq.getGame_id());

        Optional<LocalGameEntity> localGameOpt = localGameRepository.findById(numId);
        //Optional<OnlineGameEntity
        log.info(localGameOpt.toString());

        if (!localGameOpt.isPresent()) {
            throw new GameNotFoundException("Game not found");
        }


        String turn = moveReq.getTurn();
        String start = moveReq.getStart();
        String end = moveReq.getEnd();
        String fen = moveReq.getFen();

        //ChessEngine engine = new ChessEngine(turn.charAt(0));
        ChessListener listener = engineManager.getListenerForUser(getUserid());
        char[][] arr = ChessService.convertToMatrix(fen);

        //pass in array
        //engine.start(arr);
        //boolean result = engine.makeMove(start, end);
        //arr = engine.boardData();

        listener.setArr(arr);
        listener.setStartSquare(start);
        listener.setTargetSquare(end);
        listener.run();
        boolean result = listener.isSuccess();

        arr = listener.getUpdatedArr();
        String newFen = ChessService.convertToFen(arr);

        response.put("fen", newFen);

        if (!result) {
            response.put("valid", "false");
        }
        else {
            response.put("valid", "true");
            LocalGameEntity localGame = localGameOpt.get();
            localGame.setFen(newFen);
            localGameRepository.save(localGame);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/start-game-local")
    public ResponseEntity<Map<String, String>> startGameLocal() throws UserNotFoundException {
        log.info("REACHED IN START-GAME-LOCAL");
        Map<String, String> response = new HashMap<>();

        //Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findById(Long.valueOf(getUserid()));

        //todo: initialize engine for custom boards for future
        /*
        ChessEngine engine = new ChessEngine();
        engine.start();
        char[][] arr = ChessService.convertToMatrix(fen);
        arr = engine.boardData();
        */

        if (user.isPresent()) {
            LocalGameEntity new_local_game = new LocalGameEntity();
            new_local_game.setUser(user.get());
            localGameRepository.save(new_local_game);
            engineManager.getListenerForUser(getUserid()); //getter but still creates new listener/game
            response.put("local_game_id", String.valueOf(new_local_game.getId()));
            //this is just for getting app to work, delete this if initialized engine above.
            response.put("fen", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
            response.put("turn", "w");
            return ResponseEntity.ok(response);
        } else {
            throw new UserNotFoundException("User not found");
        }


    }


}
