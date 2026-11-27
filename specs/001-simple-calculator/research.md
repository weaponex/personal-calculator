# Research

## Decision: Browser-native implementation

**Rationale**: The project is a simple, personal web calculator with no existing
stack or external integration. HTML, CSS, and JavaScript minimize setup and
dependencies while supporting mouse, touch, and keyboard requirements.

**Alternatives considered**:
- React or another UI framework: unnecessary for one screen and adds setup,
  dependencies, and maintenance.
- A backend API: unnecessary because all calculations are local and persistent
  state is out of scope.

## Decision: A controlled decimal state model

**Rationale**: The model should accept decimal entry as text until calculation
so it can preserve the entered value and enforce one decimal separator.

**Alternatives considered**:
- Third-party arbitrary-precision library: rejected until requirements demonstrate
  need beyond 12-significant-digit display.
- JavaScript `eval` or expression parsing: rejected because it is unsafe and makes
  testable behavior harder to control.

## Decision: Standard precedence with explicit state transitions

**Rationale**: A maintained expression supports standard precedence and predictable
operator replacement. Operators, equals, correction, sign toggling, and clear are
explicit transitions.

**Alternatives considered**:
- Left-to-right evaluation: rejected because standard precedence is required.
- Immediate execution after every operator: rejected because it produces incorrect
  precedence for expressions such as `2 + 3 × 4`.

## Decision: Display rounding to 12 significant digits

**Rationale**: Results should remain finite numbers internally and be formatted
to 12 significant digits for display, avoiding common floating-point artifacts.

**Alternatives considered**:
- Fixed two-decimal display: rejected because general arithmetic and decimal
  values are supported.
- Raw floating-point display: rejected because values can expose artifacts such
  as `0.30000000000000004`.

## Decision: Node.js built-in test runner

**Rationale**: Node.js can run isolated unit tests without introducing a test
framework dependency.

**Alternatives considered**:
- Browser-only manual testing: insufficient for repeatable correctness.
- Jest or Vitest: unnecessary for a small dependency-free implementation.
