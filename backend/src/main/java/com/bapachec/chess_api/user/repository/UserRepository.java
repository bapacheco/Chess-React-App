package com.bapachec.chess_api.user.repository;

import com.bapachec.chess_api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(" SELECT u FROM User u WHERE u.user_id = :user_id ")
    Optional<User> findUserByUser_id(String user_id);

}
