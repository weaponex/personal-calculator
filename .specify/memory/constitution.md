<!--
Sync Impact Report:
- Version change: template placeholders -> 1.0.0
- Modified principles: none (initial constitution)
- Added sections: Core Principles; Technology and User Experience Constraints;
  Development Workflow and Quality Gates; Governance
- Removed sections: none
- Templates requiring follow-up: none
- Deferred items: none
-->

# Personal Calculator Constitution

## Core Principles

### I. Calculation Correctness (NON-NEGOTIABLE)

Every calculation MUST produce the correct result for supported inputs, preserve
appropriate decimal precision, and handle invalid or undefined operations
explicitly. Arithmetic behavior, order of operations, rounding, and edge cases
MUST be covered by automated tests. Silent incorrect results are prohibited.

### II. Test-First Development (NON-NEGOTIABLE)

For every behavioral change, tests for the intended behavior MUST be written
and observed failing before implementation. The implementation MUST then satisfy
those tests, and focused tests MUST pass before work is considered complete.
Tests MUST assert observable behavior rather than implementation details.

### III. Small, Maintainable Changes

Implementation SHOULD favor the smallest complete solution that satisfies the
requirements. Reusable logic MUST be isolated from presentation when practical;
duplicated logic MUST NOT be introduced when an existing clear abstraction can
be reused. Complexity MUST be justified in the change review.

### IV. Clear and Accessible User Experience

The calculator MUST present inputs and results clearly, use unambiguous controls,
and provide keyboard-operable interaction where keyboard input is available.
Error states MUST identify the problem and preserve or safely reset state. The
interface SHOULD remain usable across the project's supported viewport sizes.

### V. Reliable State and Input Handling

User input, calculation state, and history MUST be validated and updated
predictably. Invalid operations MUST not corrupt application state. Actions
must produce one consistent outcome for the same relevant input and state,
and state transitions SHOULD be isolated for straightforward testing.

## Technology and User Experience Constraints

- The implementation SHOULD use the simplest technologies already established by
  the project; dependencies are only justified when they provide needed behavior
  or materially reduce maintenance risk.
- Numeric handling MUST define supported ranges and precision; floating-point
  display artifacts MUST be rounded or formatted according to documented product
  behavior.
- Persistent user data, if introduced, MUST be validated before use and MUST not
  include unnecessary sensitive information.
- Security-sensitive input and data handling MUST follow the conventions of the
  project's runtime and MUST NOT rely on disabled validation or untrusted markup.

## Development Workflow and Quality Gates

- Changes MUST map requirements to executable checks or document why an automated
  check is impractical.
- Pull requests or equivalent change reviews MUST verify correctness, test
  coverage for changed behavior, accessibility impact, and unintended state
  changes.
- A change MUST NOT be considered complete while targeted tests fail or relevant
  build and validation commands report unresolved errors.
- Refactoring MUST preserve observable behavior and MUST include tests for any
  behavior that was previously untested and externally meaningful.

## Governance

This constitution defines the non-negotiable project standards and supersedes
conflicting informal practices. Any amendment MUST document the motivation,
affected principles or sections, migration impact, and version change.

Versioning follows semantic versioning:

- MAJOR: Removal or backward-incompatible redefinition of governance or principles.
- MINOR: Addition of a principle or section, or materially expanded guidance.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

At every specification, planning, implementation, or review phase, contributors
MUST verify changed requirements against these principles and record justified
exceptions. Amendments require repository-owner review and a corresponding update
to this constitution before the affected work is merged.

**Version**: 1.0.0 | **Ratified**: 2026-11-27 | **Last Amended**: 2026-11-27
