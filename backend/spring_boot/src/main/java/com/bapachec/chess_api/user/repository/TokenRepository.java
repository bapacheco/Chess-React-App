package com.bapachec.chess_api.user.repository;

import com.bapachec.chess_api.user.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query(" SELECT t FROM Token t WHERE t.token_value = :Token_value ")
    Optional<Token> findTokenByToken_value(String Token_value);

}
