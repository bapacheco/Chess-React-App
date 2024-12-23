package com.bapachec.chess_api.chess_game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocalGameRepository extends JpaRepository<LocalGameEntity, Long> {
}
