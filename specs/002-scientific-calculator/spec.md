# Feature Specification: Scientific Calculator

**Feature Branch**: `002-scientific-calculator`

**Created**: 2026-11-27

**Status**: Draft

**Input**: User description: "I want to make this a scientific calculator"

## Clarifications

### Session 2026-11-27

- Q: Which angle mode should scientific trigonometry use by default? → A: Degrees
- Q: How should users enter scientific expressions and function names? → A: Typed expressions plus scientific buttons
- Q: How should users enter factorials in typed expressions? → A: Postfix exclamation mark
- Q: For powers and unary minus, which calculator convention should the parser use? → A: Exponentiation is right-associative and binds more tightly than unary minus.
- Q: Which typed names and meanings should the calculator use for common and natural logarithms? → A: `log(x)` is base 10, `ln(x)` is natural log, and function names are case-insensitive.
- Q: How should users enter a reciprocal in a typed expression and through the keypad? → A: Type `1/(x)`; the reciprocal button wraps the active value or expression as `1/(...)`.
- Q: How should the calculator apply its 12-significant-digit display precision when a result uses scientific notation? → A: Always use 12 significant digits; scientific notation changes format, not precision.
- Q: Should the scientific calculator have a 100 ms response-time target for evaluating a supported expression and updating the display? → A: Yes; display the result or error within 100 ms after equals or Enter.
- Q: Which typed function names should the calculator accept for square root and inverse trigonometric functions? → A: Accept `sqrt`, `asin`/`acos`/`atan`, and `arcsin`/`arccos`/`arctan`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Evaluate Scientific Expressions (Priority: P1)

A student or technical user enters a scientific expression containing
parentheses, powers, roots, logarithms, or trigonometry and receives a clearly
displayed result. The display continues to show the entered equation until the
person presses equals or Enter.

**Why this priority**: Scientific expression evaluation is the core feature
that distinguishes this calculator from the existing basic calculator.

**Independent Test**: Enter `sin(30)`, press equals, and receive the result
for the selected angle mode.

**Acceptance Scenarios**:

1. **Given** the calculator is ready, **When** the person enters a grouped
   expression such as `(2 + 3) × 4`, **Then** the result is `20`.
2. **Given** a numeric value is active, **When** the person selects a power or
   square-root function, **Then** the displayed result follows standard
   scientific-notation behavior.
3. **Given** an expression contains scientific functions and basic arithmetic,
   **When** equals or Enter is pressed, **Then** standard precedence and function
   application determine the result.
4. **Given** an expression contains chained powers or a leading negative sign,
   **When** it is evaluated, **Then** `2^3^2` equals `512` and `-2^2` equals `-4`.

---

### User Story 2 - Select Scientific Functions and Modes (Priority: P2)

A person can access common scientific functions and choose the angle mode used
by trigonometry.

**Why this priority**: Discoverable functions and explicit modes reduce input
errors and make repeated scientific work practical.

**Independent Test**: Switch angle mode, evaluate a trigonometric function, and
verify the displayed result matches the selected mode.

**Acceptance Scenarios**:

1. **Given** the scientific keypad is visible, **When** the person selects sine,
   cosine, tangent, or their inverse, **Then** the function is entered around
   the active expression or entered value.
2. **Given** degree and radian modes are available, **When** the person changes
   the angle mode, **Then** subsequent trigonometric results use that mode.
3. **Given** a scientific constant control is available, **When** the person
   selects pi or Euler's number, **Then** the corresponding constant is inserted
   into the active expression.

---

### User Story 3 - Recover From Scientific Input Errors (Priority: P3)

A person receives clear feedback for invalid scientific operations and can
recover without corrupting the prior entry.

**Why this priority**: Domain restrictions such as negative even roots and
logarithms of zero are common and must not appear as valid results.

**Independent Test**: Enter `log(0)`, press equals, and verify a clear error
instead of a numeric value.

**Acceptance Scenarios**:

1. **Given** an unsupported or undefined scientific operation is evaluated,
   **When** equals or Enter is pressed, **Then** the calculator shows a specific
   understandable error.
2. **Given** a domain error is shown, **When** the person activates clear,
   **Then** the calculator resets to a valid ready state.

---

### Edge Cases

- Parentheses are missing, unmatched, or nested.
- A result is too large or too small to display in ordinary decimal notation.
- Logarithms receive zero or negative inputs.
- Square roots or inverse trigonometric functions receive domain-invalid values.
- Factorial receives a negative or non-integer value.
- Division by zero or overflow occurs during a scientific expression.
- Trigonometric angle mode is changed before or after an existing result.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The calculator MUST retain all basic-calculator capabilities,
  including arithmetic, decimals, sign toggle, clear, correction, standard
  precedence, keyboard input, and keypad-style equation display.
- **FR-002**: The calculator MUST support grouped expressions using parentheses.
- **FR-003**: The calculator MUST support exponentiation and square roots using
  the typed form `sqrt(x)`. Exponentiation MUST be right-associative and bind
  more tightly than unary minus.
- **FR-004**: The calculator MUST support common logarithm as `log(x)` with
  base 10 and natural logarithm as `ln(x)`.
- **FR-005**: The calculator MUST support `sin(x)`, `cos(x)`, `tan(x)`, and
  inverse sine, cosine, and tangent using `asin(x)`/`arcsin(x)`,
  `acos(x)`/`arccos(x)`, and `atan(x)`/`arctan(x)`, respectively.
- **FR-006**: The calculator MUST support factorial and reciprocal functions.
  Typed reciprocals use `1/(x)`; the reciprocal keypad control MUST wrap the
  active value or expression as `1/(...)`.
- **FR-007**: The calculator MUST allow insertion of pi and Euler's number.
- **FR-008**: The calculator MUST evaluate angles in degrees by default and
  allow the person to switch to radians.
- **FR-009**: The calculator MUST show the full entered equation before equals or
  Enter and replace it with a single result or error after evaluation.
- **FR-010**: The calculator MUST display finite scientific results using 12
  significant digits. It MUST use scientific notation when needed to display
  the value clearly without changing that precision.
- **FR-011**: The calculator MUST display a clear, operation-specific error for
  undefined or out-of-domain scientific operations.
- **FR-012**: The calculator MUST preserve a usable state after a scientific
  error until the person clears or replaces the expression.
- **FR-013**: The calculator MUST accept typed scientific expressions containing
  function names and support the same functions through visible keypad controls.
  Function names MUST be case-insensitive.
- **FR-014**: The calculator MUST prevent the interface from accepting or
  evaluating malformed expressions as valid numeric results.
- **FR-015**: The calculator MUST accept factorial in postfix form using `!`,
  such as `5!`.

### Key Entities *(include if feature involves data)*

- **Scientific Expression**: The ordered equation, including numbers, operators,
  parentheses, functions, constants, and active angle mode.
- **Scientific Result**: A valid calculated value or an operation-specific error
  produced for a scientific expression.
- **Angle Mode**: The unit used to interpret trigonometric input and output,
  with degrees as the default and radians as the selectable alternative.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of first-time users can complete one grouped
  arithmetic expression and one scientific function task without assistance.
- **SC-002**: 95% of valid calculations involving supported scientific functions
  return results matching an independent reference to 12 significant digits.
- **SC-003**: 100% of logarithms of zero or negative numbers, invalid square
  roots, division by zero, and negative factorial attempts display an error
  rather than a numeric result.
- **SC-004**: A person can enter and evaluate a common scientific expression
  in under 45 seconds in a usability test.
- **SC-005**: The full equation remains visible until equals or Enter is pressed
  in 100% of supported expression-entry sequences.
- **SC-006**: At least 90% of users can switch trigonometric angle mode and
  obtain the expected result on their first attempt.
- **SC-007**: The calculator MUST display the result or error for a supported
  expression within 100 ms after equals or Enter on project-supported browsers.

## Assumptions

- The existing four basic operations, keypad display, keyboard support, and
  mobile-friendly web presentation remain in scope.
- The initial scientific feature includes parentheses, powers, roots,
  logarithms, common trigonometry, inverse trigonometry, factorial, reciprocal,
  pi, and Euler's number.
- Typed expressions use postfix `!` for factorial, and scientific functions
  remain available through visible keypad controls.
- Hyperbolic functions, complex numbers, statistics, matrices, programming
  bases, symbolic algebra, and graphing are out of scope for the first version.
- Trigonometric input and inverse-trigonometric output use the same selected
  angle mode.
- Degrees are the initial angle mode; radians are an alternative selectable mode.
- Results use finite numeric evaluation and do not persist calculation history.
