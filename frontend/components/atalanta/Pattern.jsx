const COLS = "calc(2 * var(--at-column) + 1 * var(--at-gutter)) calc(2 * var(--at-column) + 2 * var(--at-gutter)) calc(3 * var(--at-column) + 3 * var(--at-gutter)) calc(4 * var(--at-column) + 3 * var(--at-gutter)) calc(1 * var(--at-column) + 1 * var(--at-gutter))";
const ROWS = "10% 15% 30% 10% 15% 20%";
const CELLS = [
  [0, 1], [0, 3],
  [1, 0], [1, 2], [1, 4],
  [2, 1], [2, 3],
  [3, 0], [3, 2], [3, 4],
  [4, 1], [4, 3],
  [5, 0], [5, 2], [5, 4],
];

export default function Pattern() {
  return (
    <div className="at-pattern" aria-hidden="true">
      <div className="at-pattern-grid" style={{ gridTemplateColumns: COLS, gridTemplateRows: ROWS }}>
        {CELLS.map(([row, col]) => (
          <div
            key={`${row}-${col}`}
            className="at-pattern-cell"
            style={{ gridRowStart: row + 1, gridColumnStart: col + 1 }}
          />
        ))}
      </div>
    </div>
  );
}
