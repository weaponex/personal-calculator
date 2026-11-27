# Data Model

## ScientificExpression

The active expression is an in-memory string with no persistence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Full equation shown before evaluation |
| `angleMode` | enum | Yes | `degrees` or `radians` |
| `status` | enum | Yes | `ready`, `editing`, `result`, or `error` |
| `result` | number or null | Yes | Finite numeric result or null for error |
| `error` | string or null | Yes | Operation-specific error message |

## ScientificResult

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | number or null | Yes | Evaluated finite value or null |
| `displayValue` | string | Yes | 12-significant-digit value in ordinary or scientific notation, or error text |
| `status` | enum | Yes | `valid` or `error` |

## Validation Rules

- The expression is parsed into numbers, operators, named functions, constants,
  parentheses, and postfix factorial.
- Function names are case-insensitive.
- Unmatched parentheses, unsupported tokens, and incomplete expressions are
  malformed-expression errors.
- `sqrt(x)` requires `x >= 0`.
- `log(x)` requires `x > 0`.
- `ln(x)` requires `x > 0`.
- `tan(x)` is invalid at undefined tangent angles.
- `asin(x)`/`arcsin(x)` and `acos(x)`/`arccos(x)` require `-1 <= x <= 1`.
- `atan(x)` and `arctan(x)` accept all finite real inputs.
- A typed reciprocal is written as `1/(x)`; the keypad wraps the active value
  or expression as `1/(...)`.
- Factorial requires a non-negative integer and a representable finite result.
- Division by zero, overflow, and non-finite results produce operation-specific
  or general calculation errors.
- Display formatting preserves 12 significant digits in ordinary and scientific
  notation.

## Supported Functions

- Trigonometric: `sin`, `cos`, `tan`
- Inverse trigonometric: `asin`/`arcsin`, `acos`/`arccos`, `atan`/`arctan`
- Logarithmic: `log`, `ln`
- Roots: `sqrt`
- Power: `^`
- Factorial: postfix `!`
- Reciprocal: `1/(x)`
- Constants: `pi`, `e`

Function names are case-insensitive.

## State Transitions

1. `ready` → typed or keypad input → `editing`
2. `editing` → equals or Enter → `result` or `error`
3. `result` → digit or function input → `editing`
4. `result` or `editing` → clear → `ready`
5. `editing` or `result` → angle-mode switch → recalculation only for a future
   trigonometric evaluation
6. `error` → clear or replacement input → `ready` or `editing`
