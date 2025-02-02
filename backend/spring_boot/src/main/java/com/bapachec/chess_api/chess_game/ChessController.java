package com.bapachec.chess_api.chess_game;

import com.bapachec.chess_api.chess_game.DTO.MoveRequest;
import com.bapachec.chess_api.chess_game.services.ChessEngineManager;
import com.bapachec.chess_api.chess_game.services.ChessListener;
import com.bapachec.chess_api.chess_game.services.ChessService;
import com.bapachec.chess_api.exceptions.GameNotFoundException;
import com.bapachec.chess_api.exceptions.UserNotFoundException;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

        Optional<User> user = userRepository.findById(Long.valueOf(getUserid()));

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        Long numId = Long.valueOf(moveReq.getGame_id());

        Optional<LocalGameEntity> localGameOpt = localGameRepository.findById(numId);
        log.info(localGameOpt.toString());

        if (localGameOpt.isEmpty()) {
            throw new GameNotFoundException("Game not found");
        }

        String start = moveReq.getStart();
        String end = moveReq.getEnd();

        ChessListener listener = engineManager.getListenerForUser(getUserid());


        char [][] arr;
        log.info("\nBEFORE MOVING {}", ChessService.convertToFen(listener.getArr()));
        listener.setStartSquare(start);
        listener.setTargetSquare(end);
        listener.run();
        boolean result = listener.isSuccess();
        log.info("\nAfter MOVING {}", ChessService.convertToFen(listener.getArr()));

        arr = listener.getArr();
        String newFen = ChessService.convertToFen(arr);
        newFen = newFen + " " +listener.getCurrentTurn();

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

    @PostMapping("/reset-local-game")
    public ResponseEntity<Map<String, String>> resetGameLocal() throws UserNotFoundException, GameNotFoundException {
        Map<String, String> response = new HashMap<>();

        Optional<User> user = userRepository.findById(Long.valueOf(getUserid()));

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        String User_id = user.get().getUser_id();

        Optional<LocalGameEntity> gameEntity = localGameRepository.findLocalGameByUser_Id(User_id);

        if (gameEntity.isEmpty()) {
            response.put("Error", "Local Game does not exist");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }

        engineManager.removeEngineForUser(User_id);
        //todo this will call for createListenerForUser
        engineManager.createListenerForUser(User_id);
        LocalGameEntity game = gameEntity.get();
        game.resetFen();
        localGameRepository.save(game);
        response.put("Success", "Local Game reset");

        return ResponseEntity.status((HttpStatus.ACCEPTED)).body(response);

    }

    @PostMapping("/start-game-local")
    public ResponseEntity<Map<String, String>> startGameLocal() throws UserNotFoundException {
        Map<String, String> response = new HashMap<>();
        String user_id = getUserid();
        User user = userRepository.findUserByUser_id(user_id).orElseThrow(() -> new UserNotFoundException("User not found"));

        ChessListener listener = engineManager.createListenerForUser(getUserid());
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

    @GetMapping("/get-local-game")
    public ResponseEntity<Map<String, String>> getLocalGame() throws GameNotFoundException {
        Map<String, String> response = new HashMap<>();

        String user_id = getUserid();

        LocalGameEntity localSavedGame = localGameRepository.findLocalGameByUser_Id(user_id).orElseThrow(() -> new GameNotFoundException("Game not found"));

        String savedFen = localSavedGame.getFen().split(" ")[0];
        String savedTurn = localSavedGame.getFen().split(" ")[1];

        if (engineManager.getEngineForUser(user_id) == null) {
            ChessListener listener = engineManager.createListenerForUser(user_id);

            char[][] savedGameArr = ChessService.convertToMatrix(savedFen);
            listener.setArr(savedGameArr);
            listener.setCurrentTurn(savedTurn);

        }

        response.put("local_game_id", String.valueOf(localSavedGame.getId()));
        response.put("fen", savedFen);
        response.put("turn", savedTurn);

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }


}
