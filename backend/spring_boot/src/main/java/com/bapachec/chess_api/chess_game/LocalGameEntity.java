package com.bapachec.chess_api.chess_game;
import com.bapachec.chess_api.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "localgame")
@Setter
@Getter
public class LocalGameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(name = "fen", nullable = false)
    private String fen;

    /*
    @Column(name = "game_number", nullable = false)
    private int gameNumber;

     */
    //game status

    public LocalGameEntity() {this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";}

    public LocalGameEntity(String fen) { this.fen = fen; }

}
