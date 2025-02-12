package com.bapachec.chess_api.user.entity;

import com.bapachec.chess_api.chess_game.entity.LocalGameEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String user_id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<LocalGameEntity> localGame;

    /*
    @Column(unique = true, nullable = false)
    private String email;
     */

    public User() {}

    public User(Role role) {
        this.role = role;
    }

    public User(String user_id, Role role) {
        this.user_id = user_id;
        this.role = role;
    }

    //orphanRemoval makes it so that deleting objects in User collection will also delete the entries
    //in respective tables instead of unlinking. orphan makes sense for oneToOne or oneToMany

    //these set up foreign key
    //mappedby should be variable in Token named user
    /*
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.EAGER)
    private Token token;

     */
    // fetch will determine if associated objects will get queried immediately (eager)
    // or not but still have query statement ready(lazy)

    //if one to many, Need have a list

    /*

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Token generateNewToken() {
        Token newToken = new Token(this).createToken();
        this.token = newToken;
        return newToken;
    }

    */



}
