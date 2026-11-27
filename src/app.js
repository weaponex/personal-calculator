import { createCalculator } from "./calculator.js";

let calculator = createCalculator();
const display = document.querySelector("#display");

function render() {
  display.textContent = calculator.displayValue;
  display.classList.toggle("error", Boolean(calculator.error));
  display.setAttribute("aria-label", calculator.error
    ? `Calculator error: ${calculator.error}`
    : `Calculator result: ${calculator.displayValue}`);
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "digit") calculator = calculator.inputDigit(button.dataset.value);
  if (action === "decimal") calculator = calculator.inputDecimal();
  if (action === "sign") calculator = calculator.toggleSign();
  if (action === "correct") calculator = calculator.correct();
  if (action === "clear") calculator = calculator.clear();
  if (action === "operator") calculator = calculator.inputOperator(button.dataset.value);
  if (action === "equals") calculator = calculator.equals();
  render();
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    calculator = calculator.inputDigit(event.key);
  } else if (event.key === ".") {
    calculator = calculator.inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    calculator = calculator.inputOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    calculator = calculator.equals();
  } else if (event.key === "Backspace") {
    calculator = calculator.correct();
  } else if (event.key === "Escape") {
    calculator = calculator.clear();
  } else {
    return;
  }

  event.preventDefault();
  render();
});

render();
