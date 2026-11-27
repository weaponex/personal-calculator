export function formatForDisplay(value) {
  if (!Number.isFinite(value)) return "Cannot calculate";
  if (Object.is(value, -0) || value === 0) return "0";

  const rounded = Number(value.toPrecision(12));
  const magnitude = Math.abs(rounded);
  if (magnitude >= 1e12 || magnitude < 1e-6) {
    const [rawMantissa, rawExponent] = rounded.toExponential(11).split("e");
    const mantissa = rawMantissa
      .replace(/(\.\d*?[1-9])0+$/, "$1")
      .replace(/\.0+$/, "");
    return `${mantissa}e${Number(rawExponent)}`;
  }
  return rounded.toString();
}

function validResult(value) {
  if (!Number.isFinite(value)) {
    return {
      status: "error",
      value: null,
      displayValue: "Result is outside the supported finite range",
    };
  }
  return { status: "valid", value, displayValue: formatForDisplay(value) };
}

function errorResult(message) {
  return { status: "error", value: null, displayValue: message };
}

class CalculationError extends Error {}

function evaluateLegacyExpression(expression) {
  if (expression.length === 0) {
    return { status: "valid", value: null, displayValue: "0" };
  }

  if (expression.length === 1) {
    const value = Number(expression[0]);
    return Number.isFinite(value) ? validResult(value) : errorResult("Cannot calculate");
  }

  if (expression.length % 2 === 0) return errorResult("Incomplete expression");

  const tokens = expression.map((token, index) =>
    index % 2 === 0 ? Number(token) : token
  );
  if (tokens.some((token, index) =>
    index % 2 === 0
      ? !Number.isFinite(token)
      : !["+", "-", "*", "/"].includes(token)
  )) {
    return errorResult("Invalid expression");
  }

  for (let index = 1; index < tokens.length - 1; index += 2) {
    const operator = tokens[index];
    if (operator !== "*" && operator !== "/") continue;

    const left = tokens[index - 1];
    const right = tokens[index + 1];
    if (operator === "/" && right === 0) {
      return errorResult("Cannot divide by zero");
    }

    const value = operator === "*" ? left * right : left / right;
    if (!Number.isFinite(value)) return errorResult("Cannot calculate");
    tokens.splice(index - 1, 3, value);
    index -= 2;
  }

  let value = tokens[0];
  for (let index = 1; index < tokens.length; index += 2) {
    value = tokens[index] === "+" ? value + tokens[index + 1] : value - tokens[index + 1];
    if (!Number.isFinite(value)) return errorResult("Cannot calculate");
  }
  return validResult(value);
}

class ExpressionParser {
  constructor(source, angleMode) {
    this.source = source;
    this.angleMode = angleMode;
    this.tokens = this.tokenize(source);
    this.position = 0;
  }

  tokenize(source) {
    const tokens = [];
    let offset = 0;

    while (offset < source.length) {
      const remainder = source.slice(offset);
      if (/^\s+/.test(remainder)) {
        offset += remainder.match(/^\s+/)[0].length;
        continue;
      }

      const number = remainder.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
      if (number) {
        const value = Number(number[0]);
        if (!Number.isFinite(value)) {
          throw new CalculationError("Number is outside the supported finite range");
        }
        tokens.push({ type: "number", value });
        offset += number[0].length;
        continue;
      }

      const name = remainder.match(/^[A-Za-z]+/);
      if (name) {
        tokens.push({ type: "name", value: name[0].toLowerCase() });
        offset += name[0].length;
        continue;
      }

      const character = source[offset];
      const operator = character === "×" ? "*" : character === "÷" ? "/" : character;
      if ("+-*/^!()".includes(operator)) {
        tokens.push({ type: operator, value: operator });
        offset += 1;
        continue;
      }

      throw new CalculationError(`Unsupported character: ${character}`);
    }

    if (tokens.length === 0) throw new CalculationError("Enter an expression");
    return tokens;
  }

  peek() {
    return this.tokens[this.position];
  }

  match(type) {
    if (this.peek()?.type !== type) return false;
    this.position += 1;
    return true;
  }

  expect(type, message = "Malformed expression") {
    if (!this.match(type)) throw new CalculationError(message);
  }

  parse() {
    const value = this.parseAdditive();
    if (this.peek()) throw new CalculationError("Unexpected token");
    return value;
  }

  parseAdditive() {
    let value = this.parseMultiplicative();
    while (this.peek()?.type === "+" || this.peek()?.type === "-") {
      const operator = this.peek().type;
      this.position += 1;
      const right = this.parseMultiplicative();
      value = operator === "+" ? value + right : value - right;
      this.requireFinite(value);
    }
    return value;
  }

  parseMultiplicative() {
    let value = this.parseUnary();
    while (this.peek()?.type === "*" || this.peek()?.type === "/") {
      const operator = this.peek().type;
      this.position += 1;
      const right = this.parseUnary();
      if (operator === "/" && right === 0) {
        throw new CalculationError("Cannot divide by zero");
      }
      value = operator === "*" ? value * right : value / right;
      this.requireFinite(value);
    }
    return value;
  }

  parseUnary() {
    if (this.match("+")) return this.parseUnary();
    if (this.match("-")) return -this.parseUnary();
    return this.parsePower();
  }

  parsePower() {
    const value = this.parsePostfix();
    if (!this.match("^")) return value;
    const exponent = this.parseUnary();
    const result = value ** exponent;
    this.requireFinite(result);
    return result;
  }

  parsePostfix() {
    let value = this.parsePrimary();
    while (this.match("!")) {
      if (!Number.isInteger(value) || value < 0) {
        throw new CalculationError("Factorial requires a non-negative integer");
      }
      if (value > 170) {
        throw new CalculationError("Factorial result is outside the supported finite range");
      }
      let result = 1;
      for (let factor = 2; factor <= value; factor += 1) result *= factor;
      value = result;
    }
    return value;
  }

  parsePrimary() {
    const token = this.peek();
    if (!token) throw new CalculationError("Incomplete expression");

    if (this.match("number")) return token.value;

    if (this.match("(")) {
      const value = this.parseAdditive();
      this.expect(")", "Missing closing parenthesis");
      return value;
    }

    if (this.match("name")) {
      if (token.value === "pi") return Math.PI;
      if (token.value === "e") return Math.E;
      if (!this.match("(")) {
        throw new CalculationError(`Unknown name: ${token.value}`);
      }
      const argument = this.parseAdditive();
      this.expect(")", `Missing closing parenthesis for ${token.value}`);
      return this.applyFunction(token.value, argument);
    }

    throw new CalculationError("Expected a number, constant, or function");
  }

  applyFunction(name, value) {
    let result;
    switch (name) {
      case "sqrt":
        if (value < 0) throw new CalculationError("Square root requires a non-negative value");
        result = Math.sqrt(value);
        break;
      case "log":
        if (value <= 0) throw new CalculationError("Common logarithm requires a positive value");
        result = Math.log10(value);
        break;
      case "ln":
        if (value <= 0) throw new CalculationError("Natural logarithm requires a positive value");
        result = Math.log(value);
        break;
      case "sin":
        result = Math.sin(this.toRadians(value));
        break;
      case "cos":
        result = Math.cos(this.toRadians(value));
        break;
      case "tan": {
        const radians = this.toRadians(value);
        if (Math.abs(Math.cos(radians)) < 1e-12) {
          throw new CalculationError("Tangent is undefined for this angle");
        }
        result = Math.tan(radians);
        break;
      }
      case "asin":
      case "arcsin":
        if (value < -1 || value > 1) {
          throw new CalculationError("Inverse sine requires a value from -1 to 1");
        }
        result = this.fromRadians(Math.asin(value));
        break;
      case "acos":
      case "arccos":
        if (value < -1 || value > 1) {
          throw new CalculationError("Inverse cosine requires a value from -1 to 1");
        }
        result = this.fromRadians(Math.acos(value));
        break;
      case "atan":
      case "arctan":
        result = this.fromRadians(Math.atan(value));
        break;
      default:
        throw new CalculationError(`Unsupported function: ${name}`);
    }
    this.requireFinite(result);
    return result;
  }

  toRadians(value) {
    return this.angleMode === "degrees" ? value * Math.PI / 180 : value;
  }

  fromRadians(value) {
    return this.angleMode === "degrees" ? value * 180 / Math.PI : value;
  }

  requireFinite(value) {
    if (!Number.isFinite(value)) {
      throw new CalculationError("Result is outside the supported finite range");
    }
  }
}

export function evaluateExpression(expression, options = {}) {
  if (Array.isArray(expression)) return evaluateLegacyExpression(expression);
  if (typeof expression !== "string") return errorResult("Invalid expression");

  const angleMode = options.angleMode ?? "degrees";
  if (!["degrees", "radians"].includes(angleMode)) {
    throw new RangeError("Angle mode must be degrees or radians");
  }

  try {
    return validResult(new ExpressionParser(expression, angleMode).parse());
  } catch (error) {
    if (error instanceof CalculationError) return errorResult(error.message);
    throw error;
  }
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

export class Calculator {
  constructor(state = {}) {
    this.displayValue = state.displayValue ?? "0";
    this.accumulator = state.accumulator ?? null;
    this.pendingOperator = state.pendingOperator ?? null;
    this.currentEntry = state.currentEntry ?? "0";
    this.waitingForOperand = state.waitingForOperand ?? false;
    this.error = state.error ?? null;
    this.expression = state.expression ?? [];
    this.expressionText = state.expressionText ?? null;
    this.angleMode = state.angleMode ?? "degrees";
    this.status = state.status ?? (this.error ? "error" : "ready");
    this.result = state.result ?? null;
  }

  copy(overrides = {}) {
    return new Calculator({
      displayValue: this.displayValue,
      accumulator: this.accumulator,
      pendingOperator: this.pendingOperator,
      currentEntry: this.currentEntry,
      waitingForOperand: this.waitingForOperand,
      error: this.error,
      expression: [...this.expression],
      expressionText: this.expressionText,
      angleMode: this.angleMode,
      status: this.status,
      result: this.result,
      ...overrides,
    });
  }

  clear() {
    return new Calculator({ angleMode: this.angleMode });
  }

  setExpression(text) {
    if (typeof text !== "string") throw new TypeError("Expression must be text");
    return this.copy({
      displayValue: text,
      accumulator: null,
      pendingOperator: null,
      currentEntry: text,
      waitingForOperand: false,
      error: null,
      expression: [],
      expressionText: text,
      status: "editing",
      result: null,
    });
  }

  setAngleMode(angleMode) {
    if (!["degrees", "radians"].includes(angleMode)) {
      throw new RangeError("Angle mode must be degrees or radians");
    }
    return this.copy({ angleMode });
  }

  activeExpressionForInsertion() {
    if (this.expressionText !== null) return this.expressionText;
    if (this.error || (this.status === "ready" && this.displayValue === "0")) return "";
    return this.displayValue;
  }

  wrapFunction(name) {
    const supportedNames = [
      "sin", "cos", "tan", "asin", "acos", "atan", "arcsin", "arccos",
      "arctan", "sqrt", "log", "ln",
    ];
    if (!supportedNames.includes(name)) throw new RangeError("Unsupported scientific function");

    const expression = this.activeExpressionForInsertion();
    const trailingOperator = expression.match(/^(.*)([+\-*/^])\s*$/);
    if (trailingOperator) {
      return this.setExpression(`${trailingOperator[1]}${trailingOperator[2]}${name}(`);
    }
    return this.setExpression(expression ? `${name}(${expression})` : `${name}(`);
  }

  insertReciprocal() {
    return this.setExpression(`1/(${this.activeExpressionForInsertion()})`);
  }

  insertConstant(name) {
    if (!["pi", "e"].includes(name)) throw new RangeError("Unsupported scientific constant");
    const expression = this.activeExpressionForInsertion();
    const needsMultiplication = /(?:\d|[A-Za-z]+|\)|!)$/.test(expression);
    return this.setExpression(`${expression}${needsMultiplication ? "*" : ""}${name}`);
  }

  insertFactorial() {
    return this.setExpression(`${this.activeExpressionForInsertion()}!`);
  }

  insertParenthesis(value) {
    if (value !== "(" && value !== ")") throw new RangeError("Invalid parenthesis");
    return this.setExpression(`${this.activeExpressionForInsertion()}${value}`);
  }

  inputDigit(digit) {
    if (!/^\d$/.test(digit)) return this;
    if (this.expressionText !== null) return this.setExpression(`${this.expressionText}${digit}`);
    if (this.status === "result") return this.clear().inputDigit(digit);
    if (this.error) return this.clear().inputDigit(digit);

    const entry = this.waitingForOperand || this.currentEntry === "0"
      ? digit
      : `${this.currentEntry}${digit}`;
    const expression = [...this.expression];
    return this.copy({
      displayValue: formatEquation(expression, entry, false),
      currentEntry: entry,
      waitingForOperand: false,
      status: "editing",
      result: null,
    });
  }

  inputDecimal() {
    if (this.expressionText !== null) {
      const trailingNumber = this.expressionText.match(/(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d*)?$/)?.[0];
      if (trailingNumber?.includes(".")) return this;
      const suffix = /[\d.]$/.test(this.expressionText) ? "." : "0.";
      return this.setExpression(`${this.expressionText}${suffix}`);
    }
    if (this.status === "result") return this.clear().inputDecimal();
    if (this.error) return this.clear().inputDecimal();
    if (this.waitingForOperand) {
      return this.copy({
        displayValue: formatEquation(this.expression, "0.", false),
        currentEntry: "0.",
        waitingForOperand: false,
        status: "editing",
      });
    }
    if (this.currentEntry.includes(".")) return this;
    const entry = `${this.currentEntry}.`;
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
      status: "editing",
    });
  }

  toggleSign() {
    if (this.error) return this.clear();
    if (this.expressionText !== null) {
      const match = this.expressionText.match(/(-?)(\d+(?:\.\d*)?|\.\d+)([eE][+-]?\d+)?$/);
      if (match) {
        const sign = match[1] ? "" : "-";
        const entry = `${sign}${match[2]}${match[3] ?? ""}`;
        return this.setExpression(`${this.expressionText.slice(0, match.index)}${entry}`);
      }
      return this.setExpression(this.expressionText.startsWith("-(")
        && this.expressionText.endsWith(")")
        ? this.expressionText.slice(2, -1)
        : `-(${this.expressionText})`);
    }
    const entry = this.currentEntry === "0"
      ? "0"
      : this.currentEntry.startsWith("-")
        ? this.currentEntry.slice(1)
        : `-${this.currentEntry}`;
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry,
      waitingForOperand: false,
      status: "editing",
    });
  }

  correct() {
    if (this.error) return this.clear();
    if (this.expressionText !== null) {
      return this.setExpression(this.expressionText.slice(0, -1));
    }
    const entry = this.currentEntry.length > 1
      ? this.currentEntry.slice(0, -1)
      : "0";
    return this.copy({
      displayValue: formatEquation(this.expression, entry, false),
      currentEntry: entry === "-" ? "0" : entry,
      waitingForOperand: false,
      status: "editing",
    });
  }

  inputOperator(operator) {
    if (!["+", "-", "*", "/", "^"].includes(operator)) return this;
    if (this.error) return this;
    if (operator === "^" && this.expressionText === null) {
      return this.setExpression(`${this.displayValue}^`);
    }
    if (this.expressionText !== null) {
      const expression = this.expressionText;
      if (!expression && operator !== "-") return this;
      if (/[+*/^]$/.test(expression) || /-$/.test(expression.trim())) {
        return this.setExpression(`${expression.slice(0, -1)}${operator}`);
      }
      return this.setExpression(`${expression}${operator}`);
    }
    if (!["+", "-", "*", "/"].includes(operator)) return this;
    if (this.waitingForOperand && this.pendingOperator) {
      const expression = [...this.expression];
      if (expression.length >= 2) expression[expression.length - 1] = operator;
      return this.copy({
        pendingOperator: operator,
        expression,
        displayValue: formatEquation(expression, this.currentEntry, true),
        status: "editing",
      });
    }

    const value = Number(this.currentEntry);
    const expression = [...this.expression];
    if (expression.length === 0) {
      expression.push(value, operator);
    } else {
      expression.push(value, operator);
    }
    return this.copy({
      accumulator: value,
      pendingOperator: operator,
      waitingForOperand: true,
      expression,
      displayValue: formatEquation(expression, this.currentEntry, true),
      status: "editing",
      result: null,
    });
  }

  equals() {
    if (this.error) return this;

    if (this.expressionText !== null) {
      const result = evaluateExpression(this.expressionText, { angleMode: this.angleMode });
      return this.copy({
        displayValue: result.displayValue,
        accumulator: result.value,
        pendingOperator: null,
        currentEntry: result.value === null ? this.currentEntry : result.displayValue,
        waitingForOperand: false,
        error: result.status === "error" ? result.displayValue : null,
        expression: [],
        expressionText: null,
        status: result.status === "error" ? "error" : "result",
        result: result.value,
      });
    }

    if (this.expression.length === 0) {
      const value = Number(this.currentEntry);
      if (!Number.isFinite(value)) {
        return this.copy({ error: "Cannot calculate", status: "error", result: null });
      }
      return this.copy({
        displayValue: formatForDisplay(value),
        accumulator: value,
        result: value,
        status: "result",
      });
    }

    const expression = [...this.expression];
    if (typeof expression[expression.length - 1] === "string") {
      if (expression.length === 2) expression.push(Number(this.currentEntry));
      else expression.pop();
    } else {
      expression.push(Number(this.currentEntry));
    }

    const result = evaluateLegacyExpression(expression);
    if (result.status === "error") {
      return this.copy({
        displayValue: result.displayValue,
        error: result.displayValue,
        waitingForOperand: false,
        expression: [],
        accumulator: null,
        status: "error",
        result: null,
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
      status: "result",
      result: result.value,
    });
  }
}

export function createCalculator() {
  return new Calculator();
}

export function handleKeyboardInput(calculator, key) {
  if (/^\d$/.test(key)) return calculator.inputDigit(key);
  if (key === ".") return calculator.inputDecimal();
  if (["+", "-", "*", "/", "^"].includes(key)) return calculator.inputOperator(key);
  if (key === "Enter" || key === "=") return calculator.equals();
  if (key === "Backspace") return calculator.correct();
  if (key === "Escape") return calculator.clear();
  return calculator;
}
