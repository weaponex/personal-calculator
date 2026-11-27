# Quickstart

## Prerequisites

- A modern desktop or mobile browser
- Node.js for automated parser tests

## Run Validation Tests

```text
npm test
```

## Manual Validation

1. Enter `(2 + 3) * 4` and verify `20`.
2. Enter `2^3^2` and verify `512`.
3. Enter `-2^2` and verify `-4`.
4. Verify `sin(30)` equals `0.5` in degrees mode.
5. Switch to radians and verify `sin(pi/2)` equals `1`.
6. Enter `sqrt(16)`, `ln(e)`, `log(100)`, `asin(1)`, `arcsin(1)`, `1/(2 + 3)`,
   and `5!`; verify expected results and case-insensitive function names.
7. Enter `sqrt(-1)`, `log(0)`, `asin(2)`, `(-3)!`, and `5/0`.
8. Verify each invalid expression displays a specific error.
9. Use scientific buttons for sine, square root, reciprocal, pi, and angle mode.
10. Use Backspace and Escape for correction and clear.
11. Verify the full expression remains visible until Enter or equals.
12. On project-supported browsers, measure from equals/Enter to the displayed
    result or error and verify it is within 100 ms.

## Acceptance Links

- User flows: [spec.md](spec.md)
- State and entities: [data-model.md](data-model.md)
- Observable interface: [contracts/scientific-calculator-ui.md](contracts/scientific-calculator-ui.md)
