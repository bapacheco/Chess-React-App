package com.bapachec.chess_api.chess_game;

import com.bapachec.chess_api.chess_game.DTO.MoveRequest;
import com.bapachec.chess_api.chess_game.entity.GameResult;
import com.bapachec.chess_api.chess_game.entity.LocalGameEntity;
import com.bapachec.chess_api.chess_game.repository.LocalGameRepository;
import com.bapachec.chess_api.chess_game.services.ChessEngineManager;
import com.bapachec.chess_api.chess_game.services.ChessListener;
import com.bapachec.chess_api.chess_game.services.ChessService;
import com.bapachec.chess_api.chess_game.services.GameSetting;
import com.bapachec.chess_api.exceptions.GameNotFoundException;
import com.bapachec.chess_api.exceptions.UserNotFoundException;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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


    @PostMapping("/reset-game-local")
    public ResponseEntity<Map<String, String>> resetGameLocal() throws GameNotFoundException {
        Map<String, String> response = new HashMap<>();

        String User_id = getUserid();
        //ChessListener listener = engineManager.getListenerForUser(User_id);
        LocalGameEntity gameEntity = localGameRepository.findLocalGameByUser_Id(User_id).orElseThrow(() -> new GameNotFoundException("Game not found"));

        engineManager.resetEngineForListener(User_id);
        //check if game completed, then make it false

        gameEntity.resetGame();
        localGameRepository.save(gameEntity);
        response.put("success", "Local Game reset");
        response.put("fen", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
        return ResponseEntity.status((HttpStatus.OK)).body(response);

    }

    @PostMapping("/draw-game-local")
    public ResponseEntity<Map<String, Object>> drawGameLocal() throws GameNotFoundException {
        Map<String, Object> response = new HashMap<>();
        String user_id = getUserid();
        //User user = userRepository.findUserByUser_id(user_id).orElseThrow(() -> new UserNotFoundException("User not found"));

        ChessListener listener = engineManager.getListenerForUser(user_id);
        LocalGameEntity localGame = localGameRepository.findLocalGameByUser_Id(user_id).orElseThrow(() -> new GameNotFoundException("Game not found"));

        listener.initiateDraw();
        localGame.drawGame();
        localGameRepository.save(localGame);
        response.put("game_result", GameResult.DRAW);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/start-game-local")
    public ResponseEntity<Map<String, String>> startGameLocal() throws UserNotFoundException {
        Map<String, String> response = new HashMap<>();
        String user_id = getUserid();
        User user = userRepository.findUserByUser_id(user_id).orElseThrow(() -> new UserNotFoundException("User not found"));

        ChessListener listener = engineManager.createListenerForUser(user_id, GameSetting.LOCAL);
        if (listener == null) {
            response.put("message", "A game is already active");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        LocalGameEntity new_local_game = new LocalGameEntity();
        new_local_game.setUser(user);
        localGameRepository.save(new_local_game);

        listener.setArr(ChessService.convertToMatrix("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));

        response.put("local_game_id", String.valueOf(new_local_game.getId()));
        //this is just for getting app to work, delete this if initialized engine above.
        response.put("fen", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
        response.put("turn", "w");
        return ResponseEntity.ok(response);



    }

    @GetMapping("/get-game-local")
    public ResponseEntity<Map<String, Object>> getLocalGame() throws GameNotFoundException {
        Map<String, Object> response = new HashMap<>();

        String user_id = getUserid();

        LocalGameEntity localSavedGame = localGameRepository.findLocalGameByUser_Id(user_id).orElseThrow(() -> new GameNotFoundException("Game not found"));

        String savedFen = localSavedGame.getFen().split(" ")[0];
        String savedTurn = localSavedGame.getFen().split(" ")[1];

        if (engineManager.getListenerForUser(user_id) == null) {

            char[][] savedGameArr = ChessService.convertToMatrix(savedFen);
            ChessListener listener = engineManager.createListenerForUser(user_id, GameSetting.LOCAL, savedTurn, savedGameArr);


        }



        response.put("local_game_id", String.valueOf(localSavedGame.getId()));
        response.put("fen", savedFen);
        response.put("turn", savedTurn);

        //check if game is completed, if so then put game completed
        if(localSavedGame.isGameComplete()) {
            response.put("game_complete", true);
            response.put("game_result", localSavedGame.getGameResult());
        }

        response.put("game_complete", false);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }


}
