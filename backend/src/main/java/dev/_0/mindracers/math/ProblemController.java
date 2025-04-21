package dev._0.mindracers.math;

import java.util.ArrayList;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev._0.mindracers.math.MathPromptingProgram.MathProblem;

@CrossOrigin
@RestController
@RequestMapping(path = "/game")
public class ProblemController {

  @GetMapping("/getProblems")
  public ArrayList<MathProblem> getProblems(
      @RequestParam(value = "difficulty", defaultValue = "1") int difficulty,
      @RequestParam(value = "count", defaultValue = "5") int count) {

    System.out.println("Requested difficulty: " + difficulty);
    System.out.println("Requested count: " + count);

    ArrayList<MathProblem> questionList = new ArrayList<>();

    for (int i = 0; i < count; i++) {
      MathProblem mathProblem = MathPromptingProgram.generateProblem(difficulty);
      questionList.add(mathProblem);
      System.out.println("Generated question " + (i + 1) + ": " + mathProblem.getProblemText());
    }

    System.out.println("Total questions generated: " + questionList.size());
    return questionList;
  }
}