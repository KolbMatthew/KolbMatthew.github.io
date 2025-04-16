package dev._0.mindracers.game;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dev._0.mindracers.user.User;
import dev._0.mindracers.user.UserRepository;

@CrossOrigin
@RestController
@RequestMapping(path = "/scores")
public class GameScoreController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    // TODO setup timed answers
    @PostMapping(path = "/save-score")
    public @ResponseBody ResponseEntity<String> storeNewScore(@RequestParam int score,
            @RequestParam int userID, @RequestParam String gameDate) {

        // Define the formatter to make it work with LocalDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime dateTime = LocalDateTime.parse(gameDate, formatter);

        Optional<User> user = userRepository.findById(userID);

        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found!");
        }

        User userResult = user.get();

        Game newGame = new Game();
        newGame.setScore(score);
        newGame.setUser(userResult);
        newGame.setTime(dateTime);

        gameRepository.save(newGame);
        return ResponseEntity.ok("Game saved successfully!");
    }

    @GetMapping("/scores") // Specify a clear endpoint
    public ResponseEntity<Iterable<Game>> viewAllScores() {
        ArrayList<Game> games = (ArrayList<Game>) gameRepository.findAll();

        if (!games.iterator().hasNext()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(games);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Iterable<Game>> viewUserScores(@PathVariable int id) {

        Optional<User> user = userRepository.findById(id);

        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(user.get().getGames());
    }
}
