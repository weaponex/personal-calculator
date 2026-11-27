# Calculator UI Contract

## Controls

The interface MUST expose:

- Digit buttons `0` through `9`
- Decimal separator button
- Sign-toggle button
- Addition, subtraction, multiplication, and division buttons
- Equals, clear, and correction buttons

The interface MUST accept keyboard digits, decimal separator, operators, Enter
or `=`, Backspace, Escape, and sign toggle where a platform shortcut is available.

## Input Contract

| User action | Expected outcome |
|-------------|------------------|
| Press a digit | Active entry appends the digit |
| Press decimal | Active entry gains at most one decimal separator |
| Press sign toggle | Active entry or result changes sign |
| Press an operator | Pending expression is updated or replaced |
| Press equals | Expression is evaluated and a result or error is displayed |
| Press correction | Last character in the active entry is removed |
| Press clear | Display returns to `0` and pending state is reset |
| Press divide by zero | Error text is displayed; no numeric result is shown |

## Operator Replacement

If an operator is selected when no second operand is active, the new operator
replaces the previous pending operator.

## Arithmetic Contract

- Addition, subtraction, multiplication, and division are supported.
- Expressions use standard arithmetic precedence.
- The display is rounded to 12 significant digits.
- Very large and very small finite results may use scientific notation.
- Non-finite values and division by zero show a user-visible error.

## Accessibility Contract

- Every control has a visible label or recognizable symbol.
- Controls use native button semantics.
- The current result or error is exposed as a live status region.
- Keyboard focus is visible.
- Error text is not conveyed by color alone.
