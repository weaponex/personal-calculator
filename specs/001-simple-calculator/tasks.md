# Tasks: Simple Calculator App

**Input**: Design documents from `/specs/001-simple-calculator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Automated tests are included because the constitution requires test-first
development and calculation correctness.

**Organization**: Tasks are grouped by user story so each story can be implemented
and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase
- **[Story]**: Which user story this task belongs to
- Include the exact file path in every implementation task

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the static web project structure.

- [X] T001 Create the project directories `src/` and `tests/`
- [X] T002 Create the browser entry page with a calculator display and control
  region in `src/index.html`
- [X] T003 [P] Create the responsive visual foundation in `src/styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the test and state infrastructure required by every story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Add Node.js test setup and calculator test entry point in
  `tests/calculator.test.js`
- [X] T005 Implement the initial in-memory `Calculation` state fields
  `displayValue`, `accumulator`, `pendingOperator`, `currentEntry`,
  `waitingForOperand`, `error`, and `expression` from `data-model.md`
- [X] T006 Implement finite-number validation and 12-significant-digit formatting
  for `Result.value` and `Result.displayValue` in `src/calculator.js`
- [X] T007 [P] Add native keyboard event mapping for digits, operators, Enter,
  decimal, Backspace, Escape, and sign toggle in `src/app.js`
- [X] T008 [P] Add accessible status and focus structure for live result and error
  announcements in `src/index.html`

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Perform Basic Calculations (Priority: P1) MVP

**Goal**: Enter four basic operations, evaluate standard precedence, and display
rounded results.

**Independent Test**: Start clear, calculate `12 + 7 =` as `19`, calculate
`2 + 3 * 4 =` as `14`, toggle a sign, and calculate a decimal result.

### Tests for User Story 1

> **NOTE: Write these tests first and verify that they fail before implementation**

- [X] T009 [P] [US1] Add addition, subtraction, multiplication, and division
  behavior tests in `tests/calculator.test.js`
- [X] T010 [P] [US1] Add standard arithmetic-precedence and 12-significant-digit
  display tests in `tests/calculator.test.js`
- [X] T011 [P] [US1] Add sign-toggle and operator-replacement state tests in
  `tests/calculator.test.js`

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement digit and decimal entry for `Calculation.currentEntry`
  and `Calculation.displayValue` in `src/calculator.js` per `data-model.md`
- [X] T013 [P] [US1] Implement the sign-toggle behavior for
  `Calculation.currentEntry` in `src/calculator.js` per `data-model.md`
- [X] T014 [US1] Implement operator selection and replacement for
  `Calculation.pendingOperator` in `src/calculator.js` per `data-model.md`
- [X] T015 [US1] Implement expression evaluation with standard precedence and
  create `Result.value`, `Result.displayValue`, and `Result.status` in
  `src/calculator.js`
- [X] T016 [US1] Render digits, decimal, sign, operators, equals, and live result
  actions in `src/app.js`
- [X] T017 [US1] Add the calculator keypad controls and result status region from
  the UI contract in `src/index.html`
- [X] T018 [US1] Style the keypad and responsive result display in `src/styles.css`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Correct and Reset Entries (Priority: P2)

**Goal**: Remove a mistaken digit or reset the entire active calculation safely.

**Independent Test**: Enter `25`, activate correction to leave `2`, then clear
and verify `0` with no pending operation.

### Tests for User Story 2

- [X] T019 [P] [US2] Add correction and clear state-transition tests in
  `tests/calculator.test.js`
- [X] T020 [P] [US2] Add decimal-entry rejection tests for a repeated separator
  in `tests/calculator.test.js`

### Implementation for User Story 2

- [X] T021 [US2] Implement correction for `Calculation.currentEntry`, including
  the reset-to-`0` rule in `src/calculator.js` per `data-model.md`
- [X] T022 [US2] Implement clear for all `Calculation` fields in
  `src/calculator.js` per `data-model.md`
- [X] T023 [P] [US2] Wire correction and clear controls to the state model in
  `src/app.js`
- [X] T024 [P] [US2] Add correction and clear buttons to `src/index.html`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Handle Invalid Operations (Priority: P3)

**Goal**: Report division by zero and unsupported values without corrupting state.

**Independent Test**: Calculate `5 / 0 =` and verify an error is shown, no numeric
result is shown, and clear restores the ready state.

### Tests for User Story 3

- [X] T025 [P] [US3] Add division-by-zero tests expecting `Cannot divide by zero`
  in `tests/calculator.test.js`
- [X] T026 [P] [US3] Add non-finite-result and usable-recovery tests in
  `tests/calculator.test.js`

### Implementation for User Story 3

- [X] T027 [US3] Implement division-by-zero and non-finite `Result.status = error`
  handling in `src/calculator.js` per `data-model.md`
- [X] T028 [US3] Preserve the in-memory error state until clear or replacement
  by implementing recovery transitions in `src/calculator.js` per `data-model.md`
- [X] T029 [P] [US3] Render the error through the live status region in
  `src/app.js`
- [X] T030 [P] [US3] Style error text as visible text with no color-only meaning
  in `src/styles.css`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish accessibility, validation, and documentation checks.

- [X] T031 [P] Verify native control semantics and visible keyboard focus across
  `src/index.html` and `src/styles.css`
- [X] T032 [P] Verify mouse, touch, and keyboard behavior against
  `specs/001-simple-calculator/contracts/calculator-ui.md`
- [X] T033 Run the automated suite with
  `node --test tests/calculator.test.js`
- [X] T034 Run the manual validation scenarios in
  `specs/001-simple-calculator/quickstart.md`
- [X] T035 [P] Review responsive presentation at small and desktop viewport sizes
  in `src/styles.css`

---

## Dependencies & Execution Order

- **Phase 1**: No dependencies; can start immediately.
- **Phase 2**: Depends on setup and blocks all user stories.
- **User Stories**: Depend on Phase 2 and may proceed in parallel after foundation
  is complete. The recommended order is P1, P2, P3.
- **Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: No dependency on US2 or US3.
- **US2**: Uses the shared `Calculation` foundation but is independently testable.
- **US3**: Uses the shared calculation and result model but is independently testable.

### Parallel Opportunities

- T003, T007, and T008 may run in parallel after setup.
- US1 tests T009-T011 may run in parallel.
- US1 model/UI tasks T012-T13 and T016-T018 have limited file separation but
  should respect their dependencies.
- US2 tests T019-T020 and implementation UI tasks T023-T024 may run in parallel.
- US3 tests T025-T026 and UI tasks T029-T030 may run in parallel.

## Parallel Example: User Story 1

```text
T009-T011: Run operation, precedence, rounding, sign, and operator tests together.
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete setup and foundational phases.
2. Implement and validate US1.
3. Stop and demonstrate basic calculations as the MVP.

### Incremental Delivery

1. Add US1 basic calculations.
2. Add US2 correction and clear.
3. Add US3 error handling.
4. Complete polish and validation.

## Notes

- All task IDs are sequential and use the required checkbox format.
- User story tasks are labeled [US1], [US2], or [US3].
- All tasks include exact file paths or design-document paths.
