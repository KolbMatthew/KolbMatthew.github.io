package dev._0.mindracers;

import dev._0.mindracers.math.MathPromptingProgram;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.time.Duration;

public class MathPromptingProgramTest {

    // Test calculatePoints method for different response times
    @Test
    public void testCalculatePoints() {
        assertEquals(10, MathPromptingProgram.calculatePoints(Duration.ofSeconds(3)),
                "Points for <5 seconds should be 10");
        assertEquals(7, MathPromptingProgram.calculatePoints(Duration.ofSeconds(8)),
                "Points for <10 seconds should be 7");
        assertEquals(5, MathPromptingProgram.calculatePoints(Duration.ofSeconds(12)),
                "Points for <15 seconds should be 5");
        assertEquals(3, MathPromptingProgram.calculatePoints(Duration.ofSeconds(18)),
                "Points for <20 seconds should be 3");
        assertEquals(0, MathPromptingProgram.calculatePoints(Duration.ofSeconds(25)),
                "Points for >=20 seconds should be 0");
    }

    // Test checkAnswer method to ensure it returns true for correct answers
    @Test
    public void testCheckAnswerCorrect() {
        MathPromptingProgram.MathProblem problem = new MathPromptingProgram.MathProblem(5, 3, 0, 8,
                new int[] { 8, 9, 10 });
        assertTrue(MathPromptingProgram.checkAnswer(8, problem), "CheckAnswer should return true for correct answer");
    }

    // Test checkAnswer method to ensure it returns false for incorrect answers
    @Test
    public void testCheckAnswerIncorrect() {
        MathPromptingProgram.MathProblem problem = new MathPromptingProgram.MathProblem(5, 3, 0, 8,
                new int[] { 8, 9, 10 });
        assertFalse(MathPromptingProgram.checkAnswer(9, problem),
                "CheckAnswer should return false for incorrect answer");
    }
}
