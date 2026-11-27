import test from "node:test";
import assert from "node:assert/strict";
import {
  createCalculator,
  formatForDisplay,
  evaluateExpression,
  handleKeyboardInput,
} from "../src/calculator.js";

test("four basic operations produce correct values", () => {
  assert.equal(evaluateExpression([12, "+", 7]).value, 19);
  assert.equal(evaluateExpression([12, "-", 7]).value, 5);
  assert.equal(evaluateExpression([12, "*", 7]).value, 84);
  assert.equal(evaluateExpression([12, "/", 4]).value, 3);
});

test("expressions use standard arithmetic precedence", () => {
  assert.equal(evaluateExpression([2, "+", 3, "*", 4]).value, 14);
  assert.equal(evaluateExpression([20, "-", 6, "/", 2]).value, 17);
});

test("division by zero returns an error", () => {
  assert.deepEqual(evaluateExpression([5, "/", 0]), {
    status: "error",
    value: null,
    displayValue: "Cannot divide by zero",
  });
});

test("non-finite values return an error", () => {
  assert.equal(evaluateExpression([1, "/", 0]).status, "error");
  assert.equal(evaluateExpression([1e308, "*", 1e308]).status, "error");
});

test("display formatting preserves 12 significant digits", () => {
  assert.equal(formatForDisplay(1 / 3), "0.333333333333");
  assert.equal(formatForDisplay(0.30000000000000004), "0.3");
});

test("digit, decimal, sign, and correction operations update state", () => {
  let calculator = createCalculator();
  for (const digit of ["1", "2"]) calculator = calculator.inputDigit(digit);
  calculator = calculator.inputDecimal();
  calculator = calculator.inputDigit("5");
  assert.equal(calculator.displayValue, "12.5");
  calculator = calculator.toggleSign();
  assert.equal(calculator.displayValue, "-12.5");
  calculator = calculator.correct();
  assert.equal(calculator.displayValue, "-12.");
});

test("operator replacement does not execute the first operator", () => {
  let calculator = createCalculator();
  calculator = calculator.inputDigit("2");
  calculator = calculator.inputOperator("+");
  calculator = calculator.inputOperator("*");
  assert.equal(calculator.pendingOperator, "*");
  calculator = calculator.inputDigit("3");
  calculator = calculator.inputOperator("-");
  assert.equal(calculator.pendingOperator, "-");
});

test("clear resets every calculation field", () => {
  let calculator = createCalculator();
  calculator = calculator.inputDigit("9")
    .inputOperator("/")
    .inputDigit("0")
    .equals();
  assert.equal(calculator.error, "Cannot divide by zero");
  calculator = calculator.clear();
  assert.equal(calculator.displayValue, "0");
  assert.equal(calculator.accumulator, null);
  assert.equal(calculator.pendingOperator, null);
  assert.equal(calculator.currentEntry, "0");
  assert.equal(calculator.waitingForOperand, false);
  assert.equal(calculator.error, null);
});

test("decimal entry rejects a repeated separator", () => {
  let calculator = createCalculator().inputDigit("1").inputDecimal();
  calculator = calculator.inputDecimal();
  assert.equal(calculator.displayValue, "1.");
});

test("display keeps the full equation until equals", () => {
  let calculator = createCalculator();
  calculator = calculator.inputDigit("1");
  calculator = calculator.inputDigit("2");
  calculator = calculator.inputOperator("+");
  assert.equal(calculator.displayValue, "12 +");
  calculator = calculator.inputDigit("7");
  assert.equal(calculator.displayValue, "12 + 7");
  calculator = calculator.equals();
  assert.equal(calculator.displayValue, "19");
});

test("scientific expressions support grouping and clarified precedence", () => {
  assert.equal(evaluateExpression("(2 + 3) * 4").value, 20);
  assert.equal(evaluateExpression("2^3^2").value, 512);
  assert.equal(evaluateExpression("-2^2").value, -4);
});

test("scientific functions and aliases are case-insensitive", () => {
  assert.equal(evaluateExpression("SQRT(16)").value, 4);
  assert.equal(evaluateExpression("LoG(100)").value, 2);
  assert.equal(evaluateExpression("LN(E)").value, 1);
  assert.equal(evaluateExpression("SIN(30)").displayValue, "0.5");
  assert.equal(evaluateExpression("cos(60)").displayValue, "0.5");
  assert.equal(evaluateExpression("tan(45)").displayValue, "1");
  assert.equal(evaluateExpression("asin(1)").value, 90);
  assert.equal(evaluateExpression("arcsin(1)").value, 90);
  assert.equal(evaluateExpression("atan(1)").value, 45);
  assert.equal(evaluateExpression("arctan(1)").value, 45);
});

test("scientific expressions support constants, reciprocal grouping, and factorial", () => {
  assert.equal(evaluateExpression("pi").value, Math.PI);
  assert.equal(evaluateExpression("e").value, Math.E);
  assert.equal(evaluateExpression("1/(2 + 3)").value, 0.2);
  assert.equal(evaluateExpression("5!").value, 120);
});

test("scientific display formatting preserves 12 significant digits", () => {
  assert.equal(formatForDisplay(1 / 3), "0.333333333333");
  assert.equal(formatForDisplay(1e12), "1e12");
  assert.equal(formatForDisplay(1e-7), "1e-7");
});

test("malformed scientific expressions return errors", () => {
  for (const expression of ["", "2 +", "(2 + 3", "2 @ 3", "sin()"]) {
    assert.equal(evaluateExpression(expression).status, "error", expression);
  }
});

test("keyboard input continues to drive the basic calculator", () => {
  let calculator = createCalculator();
  for (const key of ["1", "2", "+", "7", "Enter"]) {
    calculator = handleKeyboardInput(calculator, key);
  }
  assert.equal(calculator.displayValue, "19");
});

test("keyboard input supports scientific exponentiation", () => {
  let calculator = createCalculator();
  for (const key of ["2", "^", "3", "^", "2", "Enter"]) {
    calculator = handleKeyboardInput(calculator, key);
  }
  assert.equal(calculator.displayValue, "512");
});

test("typed equation remains visible until evaluation", () => {
  let calculator = createCalculator().setExpression("2^3^2");
  assert.equal(calculator.displayValue, "2^3^2");
  calculator = calculator.equals();
  assert.equal(calculator.displayValue, "512");
});

test("angle mode applies to direct and inverse trigonometry", () => {
  assert.equal(evaluateExpression("sin(30)").displayValue, "0.5");
  assert.equal(evaluateExpression("sin(pi/2)", { angleMode: "radians" }).displayValue, "1");
  assert.equal(evaluateExpression("arcsin(1)").value, 90);
  assert.equal(
    evaluateExpression("asin(1)", { angleMode: "radians" }).value,
    Math.PI / 2,
  );
});

test("scientific keypad actions wrap expressions and insert constants", () => {
  const expression = createCalculator().setExpression("2 + 3");
  assert.equal(expression.wrapFunction("sqrt").displayValue, "sqrt(2 + 3)");
  assert.equal(expression.insertReciprocal().displayValue, "1/(2 + 3)");
  assert.equal(createCalculator().inputDigit("2").insertConstant("pi").displayValue, "2*pi");
});

test("scientific domain errors identify invalid operations", () => {
  for (const expression of [
    "sqrt(-1)",
    "log(0)",
    "ln(-1)",
    "asin(2)",
    "arccos(-2)",
    "tan(90)",
    "(-3)!",
    "5/0",
    "2^1024",
  ]) {
    const result = evaluateExpression(expression);
    assert.equal(result.status, "error", expression);
    assert.ok(result.displayValue.length > 0, expression);
  }
});

test("calculator recovers from scientific errors and resets on clear", () => {
  let calculator = createCalculator()
    .setExpression("log(0)")
    .equals();
  assert.equal(calculator.status, "error");
  assert.match(calculator.error, /logarithm/i);

  calculator = calculator.setExpression("2 + 3").equals();
  assert.equal(calculator.status, "result");
  assert.equal(calculator.displayValue, "5");

  calculator = calculator.clear();
  assert.equal(calculator.status, "ready");
  assert.equal(calculator.displayValue, "0");
});

test("keypad digits replace a completed result", () => {
  const calculator = createCalculator()
    .inputDigit("5")
    .equals()
    .inputDigit("2");
  assert.equal(calculator.displayValue, "2");
});
