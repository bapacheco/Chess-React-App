package com.bapachec.chess_api.chess_game.entity;
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

    //completed column, true or false
    @Column(name = "is_game_complete", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isGameComplete;

    @Enumerated(EnumType.STRING)
    @Column
    private GameResult gameResult;
    /*
    @Column(name = "game_number", nullable = false)
    private int gameNumber;

     */
    //game status

    public LocalGameEntity() {this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";}

    public LocalGameEntity(String fen) { this.fen = fen; }

    public void resetGame() {
        this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
        this.isGameComplete = false;
        this.gameResult = null;
    }

    public void drawGame() {
        this.isGameComplete = true;
        this.gameResult = GameResult.DRAW;
    }

    public void gameWon(GameResult result) {
        this.isGameComplete = true;
        this.gameResult = result;
    }

}
