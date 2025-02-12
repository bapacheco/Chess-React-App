package com.bapachec.chess_api.chess_game.repository;

import com.bapachec.chess_api.chess_game.entity.LocalGameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
//SELECT u FROM User u WHERE u.user_id = :user_id
@Repository
public interface LocalGameRepository extends JpaRepository<LocalGameEntity, Long> {
    @Query(" SELECT l FROM LocalGameEntity l WHERE l.user.user_id = :user_id ")
    Optional<LocalGameEntity> findLocalGameByUser_Id(String user_id);

}
