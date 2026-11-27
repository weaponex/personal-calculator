# Implementation Plan: Scientific Calculator

**Branch**: `002-scientific-calculator` | **Date**: 2026-11-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-scientific-calculator/spec.md`

## Summary

Extend the existing browser calculator with a safe expression parser and scientific
functions. Retain the keypad-style equation display and basic operations while
adding typed expressions, parentheses, exponentiation, roots, logarithms,
trigonometry, factorial, reciprocal, and constants. Typed expressions use
right-associative powers, a square-root function, case-insensitive scientific
function names with inverse-trig aliases, and explicit reciprocal grouping.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript, modern evergreen browsers

**Primary Dependencies**: None; browser-native APIs and JavaScript math functions

**Storage**: None; angle mode and active expression exist only in memory

**Testing**: Node.js built-in test runner

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-project static web application

**Performance Goals**: Display a result or error within 100 ms after equals or
Enter on project-supported browsers.

**Constraints**: No external service, backend, persistence, or unsafe expression
execution

**Scale/Scope**: One active expression, common scientific functions, degrees
default with radians selectable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Calculation correctness: PASS - the parser and all domain restrictions require
  unit tests against independent expected values, including the specified power
  associativity and unary-minus behavior.
- Test-first development: PASS - scientific behavior will be tested before parser
  or UI implementation.
- Small, maintainable changes: PASS - one dependency-free parser module replaces
  the existing expression array engine.
- Accessible user experience: PASS - typed input and visible controls preserve
  mouse, touch, and keyboard access; typed function aliases and keypad actions
  are documented consistently.
- Reliable state handling: PASS - expression parsing, angle mode, result, and
  error states remain isolated and testable.
- Technology constraints: PASS - browser-native implementation requires no
  server or third-party dependency.

No constitution violations require complexity justification.

## Project Structure

### Documentation (this feature)

```text
specs/002-scientific-calculator/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── scientific-calculator-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── index.html
├── styles.css
├── calculator.js
└── app.js

tests/
└── calculator.test.js
```

**Structure Decision**: Keep the static single-project structure. Replace the
limited expression array engine in `src/calculator.js` with a tokenizer, parser,
and evaluator; retain `src/app.js` as the DOM and keyboard adapter.

## Complexity Tracking

No constitution violations require justified complexity.
