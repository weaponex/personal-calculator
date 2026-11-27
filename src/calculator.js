export function formatForDisplay(value) {
  if (!Number.isFinite(value)) {
    return "Cannot calculate";
  }

  if (Object.is(value, -0) || value === 0) {
    return "0";
  }

  const magnitude = Math.abs(value);
  if (magnitude >= 1e12 || magnitude < 1e-6) {
    return Number(value.toPrecision(12)).toString();
  }

  return Number(value.toPrecision(12)).toString();
}

function formatOperator(operator) {
  return operator === "*" ? "×" : operator === "/" ? "÷" : operator;
}

function formatEquation(expression, currentEntry, waitingForOperand) {
  if (expression.length === 0) return currentEntry;

  const parts = expression.map((token, index) =>
    index % 2 === 1 ? formatOperator(token) : formatForDisplay(Number(token))
  );

  if (waitingForOperand) return parts.join(" ");
  return `${parts.join(" ")} ${currentEntry}`;
}

export function evaluateExpression(expression) {
  if (!Array.isArray(expression) || expression.length === 0) {
    return { status: "valid", value: null, displayValue: "0" };
  }

  if (expression.length === 1) {
    const value = Number(expression[0]);
    return Number.isFinite(value)
      ? { status: "valid", value, displayValue: formatForDisplay(value) }
      : { status: "error", value: null, displayValue: "Cannot calculate" };
  }

  const tokens = expression.map((token, index) =>
    index % 2 === 0 ? Number(token) : token
  );

  for (let index = 1; index < tokens.length - 1; index += 2) {
    const operator = tokens[index];
    if (operator !== "*" && operator !== "/") continue;

    const left = tokens[index - 1];
    const right = tokens[index + 1];
    if (operator === "/" && right === 0) {
      return { status: "error", value: null, displayValue: "Cannot divide by zero" };
    }

    const value = operator === "*" ? left * right : left / right;
    if (!Number.isFinite(value)) {
      return { status: "error", value: null, displayValue: "Cannot calculate" };
    }

    tokens.splice(index - 1, 3, value);
    index -= 2;
  }

  let value = tokens[0];
  for (let index = 1; index < tokens.length; index += 2) {
    const operator = tokens[index];
    const right = tokens[index + 1];
    value = operator === "+" ? value + right : value - right;
    if (!Number.isFinite(value)) {
      return { status: "error", value: null, displayValue: "Cannot calculate" };
    }
  }

  return {
    status: "valid",
    value,
    displayValue: formatForDisplay(value),
  };
}

export class Calculator {
  constructor(state = {}) {
    this.displayValue = state.displayValue ?? "0";
    this.accumulator = state.accumulator ?? null;
    this.pendingOperator = state.pendingOperator ?? null;
    this.currentEntry = state.currentEntry ?? "0";
    this.waitingForOperand = state.waitingForOperand ?? false;
    this.error = state.error ?? null;
    this.expression = state.expression ?? [];
  }

  copy(overrides) {
    return new Calculator({
      displayValue: this.displayValue,
      accumulator: this.accumulator,
      pendingOperator: this.pendingOperator,
      currentEntry: this.currentEntry,
      waitingForOperand: this.waitingForOperand,
      error: this.error,
      expression: [...this.expression],
      ...overrides,
    });
  }

  clear() {
    return new Calculator();
  }

  inputDigit(digit) {
    if (!/^\d$/.test(digit)) return this;
    if (this.error) return this;

    let entry = this.waitingForOperand || this.currentEntry === "0"
      ? digit
      : `${this.currentEntry}${digit}`;

    if (this.expression.length > 0 && this.waitingForOperand) {
      entry = digit;
    }

    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
      waitingForOperand: false,
    });
  }

  inputDecimal() {
    if (this.error) return this;
    if (this.waitingForOperand) {
      return this.copy({
        displayValue: formatEquation(this.expression, "0.", false),
        currentEntry: "0.",
        waitingForOperand: false,
      });
    }
    if (this.currentEntry.includes(".")) return this;
    const entry = `${this.currentEntry}.`;
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
    });
  }

  toggleSign() {
    if (this.error) return this.clear();
    const entry = this.currentEntry === "0"
      ? "0"
      : this.currentEntry.startsWith("-")
        ? this.currentEntry.slice(1)
        : `-${this.currentEntry}`;
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
      waitingForOperand: false,
    });
  }

  correct() {
    if (this.error) return this.clear();
    let entry = this.currentEntry.length > 1
      ? this.currentEntry.slice(0, -1)
      : "0";
    if (entry === "-") entry = "0";
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
      waitingForOperand: false,
    });
  }

  inputOperator(operator) {
    if (!["+", "-", "*", "/"].includes(operator)) return this;
    if (this.error) return this;

    if (this.waitingForOperand && this.pendingOperator) {
      const expression = [...this.expression];
      if (expression.length >= 2) expression[expression.length - 1] = operator;
      return this.copy({
        pendingOperator: operator,
        expression,
        displayValue: formatEquation(expression, this.currentEntry, true),
      });
    }

    const value = Number(this.currentEntry);
    let expression = [...this.expression];

    if (expression.length === 0) {
      expression = [value, operator];
      return this.copy({
        accumulator: value,
        pendingOperator: operator,
        waitingForOperand: true,
        expression,
        displayValue: formatEquation(expression, this.currentEntry, true),
      });
    }

    expression.push(value, operator);
    return this.copy({
      accumulator: value,
      pendingOperator: operator,
      waitingForOperand: true,
      expression,
      displayValue: formatEquation(expression, this.currentEntry, true),
    });
  }

  equals() {
    if (this.error) return this;
    if (this.expression.length === 0) {
      return this.copy({
        displayValue: formatForDisplay(Number(this.currentEntry)),
        accumulator: Number(this.currentEntry),
      });
    }

    const expression = [...this.expression];
    if (expression.length > 0 && typeof expression[expression.length - 1] === "string") {
      if (expression.length === 2) {
        expression.push(Number(this.currentEntry));
      } else {
        expression.pop();
      }
    } else {
      expression.push(Number(this.currentEntry));
    }

    const result = evaluateExpression(expression);
    if (result.status === "error") {
      return this.copy({
        displayValue: result.displayValue,
        error: result.displayValue,
        waitingForOperand: false,
        expression: [],
        accumulator: null,
      });
    }

    return this.copy({
      displayValue: result.displayValue,
      accumulator: result.value,
      pendingOperator: null,
      currentEntry: result.displayValue,
      waitingForOperand: false,
      error: null,
      expression: [],
    });
  }
}

export function createCalculator() {
  return new Calculator();
}
