package dev._0.mindracers.auth.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import dev._0.mindracers.user.UserRepository;
import dev._0.mindracers.user.User;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(path = "/auth")

public class LoginController {

  @Autowired
  private UserRepository userRepository;

  @PostMapping(path = "/login")
  public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String password) {
    User user = userRepository.findByEmail(email);

    // Successful login
    if (user != null && user.getPassword().equals(password)) {
      // return instance of a user
      return ResponseEntity.ok(user);
    }

    // Failed login
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body("{\\\"success\\\":0, \\\"message\\\":\\\"Invalid email or password\\\"}");

  }

  @PostMapping(path = "/update-profile")
  public ResponseEntity<String> updateProfile(
      @RequestParam int userID,
      @RequestParam(required = false) String username,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String password) {

      Optional<User> userOptional = userRepository.findById(userID);

      if (!userOptional.isPresent()) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found!");
      }

      User user = userOptional.get();

      if (username != null && !username.isEmpty()) {
          user.setUsername(username);
      }
      if (email != null && !email.isEmpty()) {
          user.setEmail(email);
      }
      if (password != null && !password.isEmpty()) {
          user.setPassword(password);
      }

      userRepository.save(user);
      return ResponseEntity.ok("Profile updated successfully!");
  }

}
