"use client";

const COLS = "calc(2 * var(--at-column) + 1 * var(--at-gutter)) calc(2 * var(--at-column) + 2 * var(--at-gutter)) calc(3 * var(--at-column) + 3 * var(--at-gutter)) calc(2 * var(--at-column) + 2 * var(--at-gutter)) calc(3 * var(--at-column) + 3 * var(--at-gutter))";
const ROWS = "30% 40% 30%";
const GRID = [
  [false, false, false, true, false],
  [true, false, true, false, true],
  [false, true, false, false, false],
];

export default function PatternDivider() {
  return (
    <div className="at-pattern-divider" aria-hidden="true">
      <div className="at-pattern-grid" style={{ gridTemplateColumns: COLS, gridTemplateRows: ROWS }}>
        {GRID.flatMap((row, r) =>
          row.map((on, c) =>
            on ? (
              <div
                key={`${r}-${c}`}
                className="at-pattern-cell at-pattern-cell-static"
                style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
              />
            ) : null,
          ),
        )}
      </div>
    </div>
  );
}
