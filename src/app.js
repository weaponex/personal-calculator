import { createCalculator, handleKeyboardInput } from "./calculator.js";

let calculator = createCalculator();
const display = document.querySelector("#display");
const angleModeControl = document.querySelector("#angle-mode");

function render() {
  if (display.value !== calculator.displayValue) {
    display.value = calculator.displayValue;
  }
  display.classList.toggle("error", Boolean(calculator.error));
  display.setAttribute("aria-invalid", calculator.error ? "true" : "false");
  display.setAttribute(
    "aria-label",
    calculator.error
      ? `Calculator error: ${calculator.error}`
      : calculator.status === "result"
        ? `Calculator result: ${calculator.displayValue}`
        : "Calculator expression"
  );
  angleModeControl.textContent = calculator.angleMode === "degrees" ? "DEG" : "RAD";
  angleModeControl.setAttribute(
    "aria-label",
    `Angle mode ${calculator.angleMode}; activate to switch`
  );
}

function activeExpression() {
  if (calculator.expressionText !== null) return calculator.expressionText;
  if (calculator.error) return "";
  return calculator.displayValue === "0" ? "" : calculator.displayValue;
}

function setExpression(text, focus = false) {
  calculator = calculator.setExpression(text);
  render();
  if (focus) {
    display.focus();
    display.setSelectionRange(text.length, text.length);
  }
}

function focusExpression() {
  display.focus();
  display.setSelectionRange(display.value.length, display.value.length);
}

document.querySelector(".calculator").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, value } = button.dataset;
  if (action === "digit") {
    calculator = calculator.inputDigit(value);
  } else if (action === "decimal") {
    calculator = calculator.inputDecimal();
  } else if (action === "sign") {
    calculator = calculator.toggleSign();
  } else if (action === "correct") {
    calculator = calculator.correct();
  } else if (action === "clear") {
    calculator = calculator.clear();
  } else if (action === "operator") {
    if (value === "^" && calculator.expressionText === null) {
      setExpression(`${activeExpression() || "0"}^`, true);
      return;
    }
    calculator = calculator.inputOperator(value);
  } else if (action === "equals") {
    calculator = calculator.equals();
  } else if (action === "function") {
    calculator = calculator.wrapFunction(value);
    render();
    focusExpression();
    return;
  } else if (action === "factorial") {
    calculator = calculator.insertFactorial();
    render();
    focusExpression();
    return;
  } else if (action === "reciprocal") {
    calculator = calculator.insertReciprocal();
    render();
    focusExpression();
    return;
  } else if (action === "constant") {
    calculator = calculator.insertConstant(value);
    render();
    focusExpression();
    return;
  } else if (action === "parenthesis") {
    calculator = calculator.insertParenthesis(value);
    render();
    focusExpression();
    return;
  } else if (action === "angle-mode") {
    calculator = calculator.setAngleMode(
      calculator.angleMode === "degrees" ? "radians" : "degrees"
    );
  } else {
    return;
  }
  render();
});

display.addEventListener("input", () => {
  calculator = calculator.setExpression(display.value);
  render();
});

display.addEventListener("focus", () => {
  if (calculator.status !== "editing") {
    display.select();
  }
});

display.addEventListener("click", () => {
  if (calculator.status !== "editing") {
    display.select();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target === display && !["Enter", "=", "Escape"].includes(event.key)) return;
  const nextCalculator = handleKeyboardInput(calculator, event.key);
  if (nextCalculator === calculator) return;
  event.preventDefault();
  calculator = nextCalculator;
  render();
});

render();
