# Research

## Decision: Dependency-free recursive-descent expression parser

**Rationale**: A small parser can accept typed functions, parentheses, operators,
constants, factorial postfix syntax, and scientific notation without unsafe
expression evaluation or third-party dependencies.

**Alternatives considered**:
- JavaScript `eval`: rejected because it exposes arbitrary code execution.
- Third-party expression library: rejected because requirements are bounded and
  the dependency would add maintenance risk.
- Continued two-operand state array: rejected because it cannot represent
  parentheses or function precedence reliably.

## Decision: Operator and function precedence

**Rationale**: The parser will follow the clarified calculator behavior:
grouping and function calls, postfix factorial, exponentiation, unary signs,
multiplication and division, then addition and subtraction. Exponentiation is
right-associative and binds more tightly than unary minus, so `2^3^2` is `512`
and `-2^2` is `-4`.

**Alternatives considered**:
- Left-to-right exponentiation: rejected because scientific calculator convention
  treats `2^3^2` as `2^(3^2)`.
- Unary minus before exponentiation: rejected because it conflicts with the
  clarified expected result for `-2^2`.

## Decision: Case-insensitive scientific function names and aliases

**Rationale**: Function names are case-insensitive. Typed square root uses
`sqrt(x)`; inverse sine, cosine, and tangent accept both the `asin`/`acos`/`atan`
and `arcsin`/`arccos`/`arctan` spellings. This preserves a compact canonical
form while accepting familiar alternatives.

**Alternatives considered**:
- Accepting only one inverse-trig spelling: rejected because users commonly
  encounter both forms.
- Case-sensitive names: rejected because case differences should not change
  the meaning of a scientific expression.

## Decision: Explicit reciprocal grouping

**Rationale**: Typed reciprocals use `1/(x)`. The reciprocal keypad control
wraps the active value or expression as `1/(...)`, preserving its grouping.

**Alternatives considered**:
- Treating `1/x` as a special function token: rejected because reciprocal is
  ordinary arithmetic and parentheses make the intended grouping explicit.

## Decision: Degrees as initial angle mode

**Rationale**: Degrees match the selected product default and remain familiar to
general and classroom users. Radians are available as an explicit mode switch.

**Alternatives considered**:
- Radians only: rejected because degrees were explicitly selected.
- Persisting the last angle mode: not included because the feature specification
  does not require persistence.

## Decision: Finite numeric results with 12-significant-digit display

**Rationale**: The evaluator remains numeric and finite; display formatting uses
12 significant digits in either ordinary or scientific notation; changing
notation does not change precision.

**Alternatives considered**:
- Arbitrary-precision arithmetic: rejected as unnecessary for the stated numeric
  scope and beyond the existing browser implementation.
- Fixed decimal places: rejected because scientific and very small values need
  scientific notation.

## Decision: 100 ms result-display target

**Rationale**: The result or error must appear within 100 ms after equals or
Enter on project-supported browsers, keeping interaction responsive.

**Alternatives considered**:
- No measurable latency target: rejected because the specification includes a
  concrete response-time success criterion.

## Decision: Explicit domain-error messages

**Rationale**: Division by zero, negative square roots, invalid logarithms,
negative or non-integer factorials, invalid inverse trigonometry, and non-finite
values need specific validation rather than JavaScript `NaN` or `Infinity`.

**Alternatives considered**:
- Generic "error": rejected because it does not identify the operation problem.
- Deferring domain handling to JavaScript: rejected because browser behavior is
  inconsistent with clear scientific-calculator feedback.
