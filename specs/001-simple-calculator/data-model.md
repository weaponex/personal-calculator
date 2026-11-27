# Data Model

## Calculation

The active calculation is an in-memory value with no persistence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayValue` | string | Yes | Text shown in the calculator |
| `accumulator` | number or null | Yes | First operand or prior result |
| `pendingOperator` | string or null | Yes | `+`, `-`, `*`, or `/` |
| `currentEntry` | string | Yes | Decimal text for the active operand |
| `waitingForOperand` | boolean | Yes | Whether digit entry starts a new operand |
| `error` | string or null | Yes | User-visible invalid-operation state |
| `expression` | ordered entries | Yes | Ordered operands and operators |

## Result

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | number or null | Yes | Calculated value, or null for an error |
| `displayValue` | string | Yes | Rounded display text or error message |
| `status` | enum | Yes | `valid` or `error` |

## Validation Rules

- A number entry cannot contain more than one decimal separator.
- Division by zero produces `Cannot divide by zero`.
- Unsupported or non-finite results produce an error.
- A sign toggle changes the sign of the active entry or result.
- Correction removes the last character of the active entry and leaves `0`
  when no character remains.
- Clear resets every field to the initial ready state.

## State Transitions

1. `ready` → digit entry → `enteringOperand`
2. `enteringOperand` → operator → `awaitingOperand`
3. `awaitingOperand` → digit entry → `enteringOperand`
4. `awaitingOperand` or `enteringOperand` → equals → `validResult` or `error`
5. `validResult` → digit entry → `enteringOperand`
6. `validResult` or `enteringOperand` → clear → `ready`
7. `enteringOperand` → correction → `enteringOperand` or `ready`
8. Any state → sign toggle → signed entry or result
