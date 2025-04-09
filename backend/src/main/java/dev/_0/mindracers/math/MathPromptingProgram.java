package dev._0.mindracers.math;


import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;
import com.google.gson.Gson;

public class MathPromptingProgram {

    // Class to encapsulate a math problem
    public static class MathProblem {
        private int num1;
        private int num2;
        private int operation;  // 0 for addition, 1 for subtraction, 2 for multiplication, 3 for division
        private int correctAnswer;
        private int[] options;

        // Constructor
        public MathProblem(int num1, int num2, int operation, int correctAnswer, int[] options) {
            this.num1 = num1;
            this.num2 = num2;
            this.operation = operation;
            this.correctAnswer = correctAnswer;
            this.options = options;
        }

        // Getters for the encapsulated fields
        public int getNum1() { return num1; }
        public int getNum2() { return num2; }
        public int getOperation() { return operation; }
        public int getCorrectAnswer() { return correctAnswer; }
        public int[] getOptions() { return options; }

        // String representation of the problem
        public String getProblemText() {
            switch (operation) {
                case 0: return num1 + " + " + num2;
                case 1: return num1 + " - " + num2;
                case 2: return num1 + " * " + num2;
                case 3: return num1 + " / " + num2;
                default: return "";
            }
        }
    }

    // Method for Difficulty Selection
    public static int selectDifficulty(Scanner scanner) {
        System.out.println("Select difficulty:");
        System.out.println("1. Easy Addition and Subtraction");
        System.out.println("2. Easy Multiplication");
        System.out.println("3. Hard Addition and Subtraction");
        System.out.println("4. Hard Multiplication and Division)");
        System.out.print("Your choice: ");
        return scanner.nextInt();
    }

    // Method to generate a random math problem based on difficulty
    public static MathProblem generateProblem(int difficulty) {

        difficulty --; // TEMPORARY FIX UNTIL DIFF SELECTION IS FIXED

        Random random = new Random();
        int num1 = 0;
        int num2 = 0;
        int operation = 0;

        if (difficulty == 0){
            operation = random.nextInt(2); 
            if (operation == 0){ // Addition
                num1 = random.nextInt(12) + 1;
                num2 = random.nextInt(12) + 1;
            } else if (operation == 1){ // Subtraction
                num1 = random.nextInt(12) + 1;
                num2 = random.nextInt(num1) + 1;
            }
        } else if (difficulty == 1){
            operation = random.nextInt(4); 
            if (operation == 0){ // Addition
                num1 = random.nextInt(25) + 1;
                num2 = random.nextInt(25) + 1;
            } else if (operation == 1){ // Subtraction
                num1 = random.nextInt(25) + 1;
                num2 = random.nextInt(num1) + 1;
            } else if (operation == 2){ // Multiplication
                num1 = random.nextInt(6) + 1;
                num2 = random.nextInt(6) + 1;
            } else if (operation == 3){ // Division
                num1 = random.nextInt(6) + 1;
                num2 = random.nextInt(6) + 1;
                num1 = num1 * num2;
            }
        } else if (difficulty == 2){
            operation = random.nextInt(4); 
            if (operation == 0){ // Addition
                num1 = random.nextInt(50) + 1;
                num2 = random.nextInt(50) + 1;
            } else if (operation == 1){ // Subtraction
                num1 = random.nextInt(50) + 1;
                num2 = random.nextInt(num1) + 1;
            } else if (operation == 2){ // Multiplication
                num1 = random.nextInt(12) + 1;
                num2 = random.nextInt(12) + 1;
            } else if (operation == 3){ // Division
                num1 = random.nextInt(12) + 1;
                num2 = random.nextInt(12) + 1;
                num1 = num1 * num2;
            }
        }

        int correctAnswer;
        if (operation == 0) {
            correctAnswer = num1 + num2;
        } else if (operation == 1) {
            correctAnswer = num1 - num2;
        } else if (operation == 2) {
            correctAnswer = num1 * num2;
        } else {
            // while (num1 % num2 != 0) {
            //     num1 = random.nextInt(90) + 11; // Avoid easy division
            //     num2 = random.nextInt(90) + 11; // Avoid easy division
            // }
            correctAnswer = num1 / num2;
        }

        int wrongAnswer1 = correctAnswer + random.nextInt(10) + 1;
        int wrongAnswer2 = correctAnswer - (random.nextInt(10) + 1);
        int wrongAnswer3 = correctAnswer - (random.nextInt(10) + 1);

        while (wrongAnswer1 == correctAnswer || wrongAnswer1 == wrongAnswer2 || wrongAnswer1 == wrongAnswer3) {
            wrongAnswer1 = correctAnswer + random.nextInt(10) + 1;
        }
        while (wrongAnswer2 == correctAnswer || wrongAnswer2 == wrongAnswer1 || wrongAnswer3 == wrongAnswer2) {
            wrongAnswer2 = correctAnswer - (random.nextInt(10) + 1);
        }
        while (wrongAnswer3 == correctAnswer || wrongAnswer2 == wrongAnswer3 || wrongAnswer3 == wrongAnswer1) {
            wrongAnswer3 = correctAnswer - (random.nextInt(10) + 1);
        }

        int correctPosition = random.nextInt(4);
        int[] options = new int[4];
        options[correctPosition] = correctAnswer;
        options[(correctPosition + 1) % 4] = wrongAnswer1;
        options[(correctPosition + 2) % 4] = wrongAnswer2;
        options[(correctPosition + 3) % 4] = wrongAnswer3;

        return new MathProblem(num1, num2, operation, correctAnswer, options);
    }

    // Main method
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int difficulty = selectDifficulty(scanner);

        List<MathProblem> problems = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            MathProblem problem = generateProblem(difficulty);
            problems.add(problem);
        }

        Gson gson = new Gson();
        String json = gson.toJson(problems);
        System.out.println("Generated Problems:");
        System.out.println(json);

        scanner.close();
    }

    // Method to check the answer
    public static boolean checkAnswer(int userAnswer, MathProblem problem) {
        return userAnswer == problem.getCorrectAnswer();
    }
}
