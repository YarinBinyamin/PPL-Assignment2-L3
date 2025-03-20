# PPL-Assignment2-L3
# Project: Assignment 2 - PPL242

## Overview
This project is an implementation of Assignment 2 for the PPL242 course. The assignment focuses on extending the L3 language by adding a `class` special form, implementing the parser and interpreter modifications for substitution and environment models, and transforming class expressions into procedural expressions.

## Project Structure
The project consists of the following main components:

- **Theoretical Questions**: Answers to theoretical questions related to functional programming and L3.
- **Code Implementation**:
  - Modifying the parser (`L3/L3-ast.ts`) to support class expressions.
  - Implementing class semantics in both substitutional (`L3/L3-eval-sub.ts`, `L3/L3-value.ts`) and environment models (`L3/L3-eval-env.ts`, `L3/L3-value.ts`).
  - Transforming `class` expressions into procedural expressions (`L3/LexicalTransformations.ts`).
- **Testing**:
  - `test/q2a.tests.ts`: Tests for parser modifications.
  - `test/q2b.sub.tests.ts`: Tests for substitution model.
  - `test/q2b.env.tests.ts`: Tests for environment model.
  - `test/q2c.tests.ts`: Tests for class to procedure transformation.

## Installation & Setup
1. Extract the provided ZIP file into a working directory.
2. Open a terminal and navigate to the project root directory.
3. Run the following command to install dependencies:
   ```sh
   npm install
   ```
4. To run tests, execute:
   ```sh
   npm test
   ```

## Usage
- Implemented `class` expressions can be used to define objects and call their methods, similar to Java-like OOP.
- Example usage:
  ```scheme
  (define pair 
      (class (a b) 
           ((first (lambda () a)) 
            (second (lambda () b))
            (sum (lambda () (+ a b)))
            (scale (lambda (k) (pair (* k a) (* k b))))
           )
      )
  )
  (define p34 (pair 3 4))
  (p34 'first)  ; Returns 3
  (p34 'sum)    ; Returns 7
  ```

## Contributors
- Yarin Binyamin
- Itai Vardi

## License
This project is intended for academic purposes and follows university guidelines for assignments.
