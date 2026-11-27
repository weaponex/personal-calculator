# Quickstart

## Prerequisites

- A modern desktop or mobile browser
- Node.js for automated calculation tests

## Run the Calculator

Open `src/index.html` directly in a browser, or serve the project root with any
static file server. No build step or external dependency is required.

## Run Validation Tests

From the repository root:

```text
node --test tests/calculator.test.js
```

## Manual Validation

1. Calculate `12 + 7 =` and verify `19`.
2. Calculate `2 + 3 * 4 =` and verify `14`.
3. Enter `1 ÷ 3 =` and verify 12-significant-digit rounding.
4. Enter `5 ÷ 0 =` and verify `Cannot divide by zero`.
5. Enter a decimal and verify only one decimal separator is accepted.
6. Enter `25`, press correction, and verify `2` remains.
7. Enter a value, press sign toggle, and verify the sign changes.
8. Select `+`, then `×`, and verify `×` replaces `+`.
9. Activate clear and verify the display resets to `0`.
10. Repeat primary operations using keyboard input.

## Acceptance Links

- User flows: [spec.md](spec.md)
- State and entities: [data-model.md](data-model.md)
- Observable interface: [contracts/calculator-ui.md](contracts/calculator-ui.md)
