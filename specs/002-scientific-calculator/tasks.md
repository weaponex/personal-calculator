# Tasks: Scientific Calculator

**Input**: Design documents from `/specs/002-scientific-calculator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are included because the project constitution requires
test-first development and calculation correctness.

**Organization**: Tasks are grouped by user story and ordered by priority.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks touching separate files and without unfinished prerequisites may
  run in parallel.
- **[Story]**: User-story label for story-phase tasks.
- Each task names the file or design document it changes or uses.

## Phase 1: Setup

**Purpose**: Confirm existing app and test entry points are ready for scientific work.

- [X] T001 [P] Confirm the Node test command and existing basic-calculator test entry
  point in `package.json` and `tests/calculator.test.js`
- [X] T002 [P] Confirm the current single-page app entry points and preserve their
  paths in `src/index.html` and `src/app.js`

---

## Phase 2: Foundational

**Purpose**: No new shared service or dependency is required; the scientific
expression parser is the first independently testable feature increment.

**Checkpoint**: Complete User Story 1 before starting later story phases because
the scientific controls and domain-error behavior depend on its expression parser.

---

## Phase 3: User Story 1 - Evaluate Scientific Expressions (Priority: P1) MVP

**Goal**: Accept typed scientific expressions with clarified function names,
precedence, and reciprocal syntax; preserve the full equation until evaluation
and return a finite result.

**Independent Test**: Enter `(2 + 3) * 4`, `2^3^2`, `-2^2`, `sin(30)`, and
`arcsin(1)` in degree mode; verify results of `20`, `512`, `-4`, `0.5`, and `90`,
with the full expression visible until equals or Enter.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementing the parser.

- [X] T003 [US1] Add tests for grouped arithmetic, unary signs, and precedence,
  asserting `2^3^2` is `512` and `-2^2` is `-4` in `tests/calculator.test.js`
- [X] T004 [US1] Add tests for case-insensitive function names, `sqrt`, `log`,
  `ln`, both inverse-trig name forms, constants, factorial syntax, and reciprocal
  syntax `1/(x)` in `tests/calculator.test.js`
- [X] T005 [US1] Add tests rejecting unsupported tokens, malformed expressions,
  incomplete input, and unmatched parentheses in `tests/calculator.test.js`
- [X] T006 [US1] Add regression tests for existing arithmetic, decimal entry,
  sign toggle, clear, correction, keyboard input, and live equation display in
  `tests/calculator.test.js`

### Implementation for User Story 1

- [X] T007 [US1] Implement tokenization for decimal/scientific numbers, operators,
  parentheses, case-insensitive function names, constants, and postfix `!` in
  `src/calculator.js`
- [X] T008 [US1] Implement recursive-descent parsing with right-associative
  exponentiation that binds more tightly than unary minus in
  `src/calculator.js`
- [X] T009 [US1] Implement basic arithmetic, `sqrt`, `log`, `ln`, power,
  factorial, grouped reciprocal expressions `1/(x)`, `pi`, and `e` evaluation in
  `src/calculator.js`
- [X] T010 [US1] Implement direct and inverse trigonometric evaluation, including
  both inverse-function name forms, with degrees as the default angle mode in
  `src/calculator.js`
- [X] T011 [US1] Add expression state fields using their canonical definitions:
  `ScientificExpression.text`, `ScientificExpression.angleMode`,
  `ScientificExpression.status`, `ScientificExpression.result`, and
  `ScientificExpression.error` in `data-model.md`, implemented in
  `src/calculator.js`
- [X] T012 [US1] Add result fields using their canonical definitions:
  `ScientificResult.value`, `ScientificResult.displayValue`, and
  `ScientificResult.status` in `data-model.md`, implemented in
  `src/calculator.js`
- [X] T013 [US1] Preserve the full typed expression until equals or Enter, then
  replace it with the formatted result in `src/app.js`
- [X] T014 [US1] Add an editable scientific-expression input while retaining the
  existing keypad and equation display in `src/index.html`
- [X] T015 [US1] Style the expression field, scientific-capable display, and
  keypad at desktop and mobile widths in `src/styles.css`

**Checkpoint**: Typed scientific expressions evaluate correctly without unsafe
expression execution, and existing basic operations remain available.

---

## Phase 4: User Story 2 - Select Scientific Functions and Modes (Priority: P2)

**Goal**: Provide visible scientific function/constant controls and an explicit
degree/radian selector.

**Independent Test**: Use visible controls to enter sine, square root, pi, and
Euler's number; switch DEG/RAD and verify `sin(30)` in DEG and `sin(pi/2)` in RAD.

### Tests for User Story 2

- [X] T016 [US2] Add tests for degree/radian direct and inverse trigonometric
  results in `tests/calculator.test.js`
- [X] T017 [US2] Add tests for visible scientific-control insertion behavior in
  `tests/calculator.test.js`

### Implementation for User Story 2

- [X] T018 [US2] Implement angle-mode selection and apply the selected mode to
  trigonometric evaluation in `src/calculator.js`
- [X] T019 [US2] Implement scientific control actions for functions, constants,
  powers, factorial, reciprocal wrapping as `1/(...)`, and parentheses in
  `src/app.js`
- [X] T020 [US2] Add labeled scientific function/constant controls and DEG/RAD
  selection in `src/index.html`
- [X] T021 [US2] Add responsive styling for the expanded scientific keypad and
  visible angle mode in `src/styles.css`

**Checkpoint**: Scientific functions are discoverable by keypad and use the
selected angle mode.

---

## Phase 5: User Story 3 - Recover From Scientific Input Errors (Priority: P3)

**Goal**: Report malformed, undefined, out-of-domain, and non-finite operations
clearly and allow recovery.

**Independent Test**: Evaluate `log(0)`, `sqrt(-1)`, `asin(2)`, `(-3)!`, and `5/0`;
each produces a clear error, and clear returns the app to a ready state.

### Tests for User Story 3

- [X] T022 [US3] Add domain-error tests for logarithms, roots, both inverse-trig
  name forms, undefined tangent angles, factorial, and division by zero in
  `tests/calculator.test.js`
- [X] T023 [US3] Add tests for overflow, non-finite values, clear, and replacement
  input after errors in `tests/calculator.test.js`

### Implementation for User Story 3

- [X] T024 [US3] Add operation-specific validation and error messages for
  scientific function domains in `src/calculator.js`
- [X] T025 [US3] Reject malformed/incomplete expressions and prevent non-finite
  numeric results in `src/calculator.js`
- [X] T026 [US3] Implement error recovery for clear and replacement expressions
  in `src/calculator.js`
- [X] T027 [US3] Connect parse and domain errors to accessible live feedback in
  `src/app.js`
- [X] T028 [US3] Add visible error styling and preserve readable scientific
  notation in `src/styles.css`

**Checkpoint**: Invalid expressions and scientific domains produce errors rather
than `NaN` or `Infinity`, and the user can recover.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify documentation scenarios and accessible, responsive behavior.

- [X] T029 [P] Review visible labels, keyboard focus, and status announcements in
  `src/index.html` and `src/styles.css`
- [X] T030 [P] Run the automated suite with `npm test` from `package.json`
- [X] T031 [P] Run each manual scientific scenario in
  `specs/002-scientific-calculator/quickstart.md`, including the 100 ms result
  or error response target on project-supported browsers
- [X] T032 [P] Review feature behavior against
  `specs/002-scientific-calculator/contracts/scientific-calculator-ui.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: No separate foundational code; the parser is
  implemented and tested within US1.
- **US1 (Phase 3)**: Depends on Setup and creates the expression parser needed by
  subsequent work.
- **US2 (Phase 4)**: Depends on US1 parser and expression state.
- **US3 (Phase 5)**: Depends on US1 parser and result model; can overlap with US2
  only after US1 is complete and when changes are isolated by file.
- **Polish (Phase 6)**: Depends on all selected stories.

### User Story Dependencies

- **US1**: First deliverable and MVP; builds the shared expression parser.
- **US2**: Depends on US1 expression parsing and trigonometric functions.
- **US3**: Depends on US1 parser and result model.

### Within Each User Story

- Tests are written first and observed failing before the related behavior is
  implemented.
- Parser and calculation logic tasks precede UI wiring.
- Tasks touching the same file are performed sequentially.

### Parallel Opportunities

- Setup checks T001 and T002 may run in parallel.
- US1 test tasks T003-T006 touch the same test file and should be coordinated
  sequentially or by a single worker; parser and UI work is not parallel until
  the shared model contract is established.
- US2 test tasks T016-T017 touch the same test file and should be coordinated.
- US3 test tasks T022-T023 touch the same test file and should be coordinated.
- During polish, the accessibility review, automated suite, quickstart scenarios,
  and contract review can run independently after implementation is complete.

## Parallel Example: Setup

```text
T001 Confirm the test entry point in package.json and tests/calculator.test.js
T002 Confirm the app entry points in src/index.html and src/app.js
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete setup checks.
2. Write parser and calculation tests, then implement the safe parser.
3. Validate grouped expressions, powers, core scientific functions, constants,
   factorial, precision, and full-expression display.
4. Demonstrate the P1 scientific-expression MVP before continuing.

### Incremental Delivery

1. Add US1 scientific expression evaluation.
2. Add US2 visible scientific controls and angle mode selection.
3. Add US3 specific domain errors and recovery.
4. Complete accessibility and quickstart validation.

## Notes

- Every task uses an unchecked checkbox, sequential ID, applicable parallel and
  story labels, and a concrete file or documentation path.
- Exact constrained-field citations point to `data-model.md` and the canonical
  `ScientificExpression.field` or `ScientificResult.field` identities.
