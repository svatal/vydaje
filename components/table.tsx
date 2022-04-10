import * as b from "bobril";

export interface IPosition {
  x: number;
  y: number;
}

export interface IRow {
  columns: b.IBobrilChildren[];
  onClick?: () => void;
  onContextMenu?: (pos: IPosition) => void;
  isSelected?: boolean;
}

export function Table(p: {
  headers: string[];
  data: IRow[];
  rowLimit?: number;
}) {
  const [sorting, setSorting] = b.useState<{
    column: number;
    ascending: boolean;
  } | null>(null);
  let data = p.data;
  if (sorting) {
    data = data.sort((a, b) => {
      const ac = a.columns[sorting.column];
      const bc = b.columns[sorting.column];
      return isBigger(ac, bc) * (sorting.ascending ? 1 : -1);
    });
  }
  if (p.rowLimit) {
    data = data.slice(0, p.rowLimit);
  }
  return (
    <table cellspacing="15px" style={{ width: "100%" }}>
      <tr>
        {p.headers.map((h, i) => (
          <th
            style={{ position: "sticky", top: 0, background: "white" }}
            onClick={() =>
              isSortable(i, p.data) &&
              setSorting({
                column: i,
                ascending: sorting?.column === i ? !sorting.ascending : true,
              })
            }
          >
            {h}
          </th>
        ))}
      </tr>
      {p.data.map((row) => (
        <tr
          onClick={row.onClick}
          onContextMenu={
            !row.onContextMenu
              ? undefined
              : (pos) => {
                  row.onContextMenu!(pos);
                  return true;
                }
          }
          style={row.isSelected ? { background: "lightgray" } : {}}
        >
          {row.columns.map((d) => (
            <td>{d}</td>
          ))}
        </tr>
      ))}
    </table>
  );
}

function isSortable(idx: number, rows: IRow[]): boolean {
  return rows.every((r) => {
    const o = r.columns[idx];
    const to = typeof o;
    return to === "string" || to === "number" || o === null || o === undefined;
  });
}

function isBigger(a: unknown, b: unknown): number {
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return 0;
}
