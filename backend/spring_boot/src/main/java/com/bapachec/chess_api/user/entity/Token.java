package com.bapachec.chess_api.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.Instant;

@Entity
@Table(name = "Token")
@Getter
@Setter
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token_value;

    @Column(nullable = false)
    private Instant expiresAt;

    /*
    @Column(nullable = false)
    private String expire;
     */

    /*
    @Column(unique = true)
    private String refresh_token;
     */

    public Token() {}

    public Token(String token_value, Instant expiresAt) {
        this.token_value = token_value;
        this.expiresAt = expiresAt;
    }

    /*
    //todo implement all cookie details
    public Token(String token_value, String expire) {
        this.token_value = token_value;
        this.expire = expire;
    }

     */
    //these set up foreign key
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;



    /*
    //name (user_id) means a column will be created called user_id.


    static SecureRandom random = new SecureRandom();



    private static String generateToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

     */
}
