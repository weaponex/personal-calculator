# Scientific Calculator UI Contract

## Expression Input

The interface MUST accept:

- Digits and decimal separators
- `+`, `-`, `*`, `/`, `^`, parentheses, and postfix `!`
- Typed function names and constants
- Visible scientific controls for functions and constants

Typed expression examples:

```text
(2 + 3) * 4
sin(30)
sqrt(16)
log(100)
ln(e)
asin(1)
arcsin(1)
1/(2 + 3)
5!
pi
2^3^2
-2^2
```

- Function names are case-insensitive.
- Inverse trig accepts both `asin`/`acos`/`atan` and
  `arcsin`/`arccos`/`arctan`.
- Powers are right-associative and bind more tightly than unary minus:
  `2^3^2` evaluates to `512`, and `-2^2` evaluates to `-4`.
- The reciprocal control wraps the active value or expression as `1/(...)`.

## Angle Mode

- The initial angle mode is `DEG`.
- A visible mode control MUST switch between `DEG` and `RAD`.
- Subsequent trigonometric evaluation uses the selected mode.
- Inverse trigonometric results are expressed in the selected mode.

## Keyboard Contract

- Printable expression characters append or insert into the active expression.
- Enter or `=` evaluates.
- Backspace corrects the last character.
- Escape clears.
- A visible Enter control evaluates.

## Result and Error Contract

- The display shows the complete expression before evaluation.
- A valid result replaces the expression with one result.
- A domain error identifies the operation and problem.
- The calculator does not expose `NaN`, `Infinity`, or unhandled parser values.
- The display retains 12 significant digits for ordinary and scientific notation.
- The result or error appears within 100 ms after equals or Enter on
  project-supported browsers.

## Accessibility Contract

- Scientific controls retain native button semantics and visible labels.
- The angle mode is exposed in text and not color alone.
- The expression and errors use a live status region.
- Keyboard focus remains visible at every viewport size.
