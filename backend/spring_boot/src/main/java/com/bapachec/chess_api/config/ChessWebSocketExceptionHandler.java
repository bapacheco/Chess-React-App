package com.bapachec.chess_api.config;

import com.bapachec.chess_api.exceptions.GameNotFoundException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class ChessWebSocketExceptionHandler {

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleGameNotFound(GameNotFoundException e) {
        return e.getMessage();
    }
}
