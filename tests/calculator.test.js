import test from "node:test";
import assert from "node:assert/strict";
import {
  createCalculator,
  formatForDisplay,
  evaluateExpression,
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
