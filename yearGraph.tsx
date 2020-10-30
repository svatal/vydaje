import * as b from "bobril";
import { IBasketWithRecords } from "./model/rule";
import { getColor, formatCurrency } from "./util";

export function renderTimeGraph(
  allbaskets: IBasketWithRecords,
  timeBaskets: { [id: string]: IBasketWithRecords },
  path: string[]
) {
  allbaskets = getBasket(path, allbaskets);
  const ids = Object.keys(timeBaskets).sort();
  timeBaskets = ids.reduce((c, y) => {
    c[y] = getBasket(path, timeBaskets[y]);
    return c;
  }, {} as { [id: string]: IBasketWithRecords });
  const names = Object.keys(allbaskets.baskets).sort(
    (a, b) =>
      getBalance(allbaskets.baskets[a]) - getBalance(allbaskets.baskets[b])
  );
  const values = ids.map((id) =>
    names.reduce(
      (c, n) => {
        c.push(
          c[c.length - 1] + Math.round(getMalus(timeBaskets[id].baskets[n]))
        );
        return c;
      },
      [0]
    )
  );
  const maxVal = Math.max(0, ...values.map((v) => v[names.length]));

  return (
    <>
      <svg
        width="100%"
        height="200px"
        viewBox={`0 0 ${(ids.length + 1) * xStep} ${maxVal}`}
        preserveAspectRatio="none"
      >
        {names.map((n, i) => (
          <path fill={getColor(n, names)} d={getPath(i, values)}>
            <title>{`${n}\n${ids
              .map(
                (y) =>
                  `${y} - ${formatCurrency(
                    -getBalance(timeBaskets[y].baskets[n])
                  )}`
              )
              .join("\n")}`}</title>
          </path>
        ))}
      </svg>
      <svg width="100%" height="40px">
        {ids.map((id, i) => (
          <text
            x={`${(100 / (ids.length + 1)) * (i + 1)}%`}
            y={20 + (i % 2 === 0 || ids.length <= 20 ? 0 : 20)}
            style={{ textAnchor: "middle" }}
          >
            {id}
          </text>
        ))}
      </svg>
    </>
  );
}

function getBasket(path: string[], root: IBasketWithRecords): IBasketWithRecords {
  if (path.length === 0) return root;
  const basket = root.baskets[path[0]];
  if (basket === undefined)
    return { baskets: {}, records: [], plus: 0, minus: 0 };
  return getBasket(path.slice(1), basket);
}

function getBalance(basket: IBasketWithRecords | undefined) {
  if (!basket) return 0;
  return basket.plus + basket.minus;
}
function getMalus(basket: IBasketWithRecords | undefined) {
  return Math.max(0, -getBalance(basket));
}

const xStep = 100;
function getPath(i: number, values: number[][]) {
  const lower = values.map((vs) => vs[i]);
  const upper = values.map((vs) => vs[i + 1]);
  return (
    `M ${xStep},${lower[0]}` +
    lower
      .slice(1)
      .map((v, i) => ` L ${(i + 2) * xStep},${v}`)
      .join(" ") +
    upper
      .reverse()
      .map((v, i) => ` L ${(upper.length - i) * xStep},${v}`)
      .join(" ") +
    ` Z`
  );
}
