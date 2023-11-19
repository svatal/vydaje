import * as b from "bobril";
import { IBasketWithRecords } from "./model/rule";
import { getColor, formatCurrency } from "./util";
import { ExpandIcon } from "./icons/expand";
import { Icon } from "./icons/icon";
import { FullScreenModal } from "./components/fullScreenModal";
import { CloseIcon } from "./icons/close";

export function TimeGraph(p: {
  allBaskets: IBasketWithRecords;
  timeBaskets: { [id: string]: IBasketWithRecords };
  path: string[];
}) {
  let { allBaskets: allbaskets, timeBaskets, path } = p;
  const inModal = b.useState(false);
  allbaskets = getBasket(path, allbaskets);
  const ids = Object.keys(timeBaskets).sort();
  timeBaskets = ids.reduce(
    (c, y) => {
      c[y] = getBasket(path, timeBaskets[y]);
      return c;
    },
    {} as { [id: string]: IBasketWithRecords }
  );
  const malusNames = sortBasketNamesBy(allbaskets, getMalus).reverse();
  const bonusNames = sortBasketNamesBy(allbaskets, getBonus);
  const colorNames = sortBasketNamesBy(allbaskets, getBalance).reverse();

  function getValues(
    names: string[],
    fn: (basket: IBasketWithRecords | undefined) => number
  ) {
    return ids.map((id) =>
      names.reduce(
        (c, n) => {
          c.push(c[c.length - 1] + Math.round(fn(timeBaskets[id].baskets[n])));
          return c;
        },
        [0]
      )
    );
  }
  const malusValues = getValues(malusNames, getMalus);
  const maxMalusVal = Math.min(
    0,
    ...malusValues.map((v) => v[malusNames.length])
  );
  const bonusValues = getValues(bonusNames, getBonus);
  const maxBonusVal = Math.max(
    0,
    ...bonusValues.map((v) => v[bonusNames.length])
  );
  const niceVals = getYLegendValues(maxBonusVal, maxMalusVal);
  const valRange = maxBonusVal - maxMalusVal;

  const content = (
    <>
      <svg style={{ width: "100%", height: "calc(100% - 40px)" }}>
        {niceVals
          .map((v) => ({ v, y: `${((maxBonusVal - v) / valRange) * 100}%` }))
          .map(({ v, y }) => (
            <>
              <line y1={y} x2="100%" y2={y} stroke="black" />
              <text x={5} y={y} style={{ textAnchor: "left" }}>
                {v}
              </text>
            </>
          ))}
        <svg
          x="0"
          y="0"
          width="100%"
          height="100%"
          viewBox={`0 ${-maxBonusVal} ${(ids.length + 1) * xStep} ${valRange}`}
          preserveAspectRatio="none"
        >
          {bonusNames.map((n, i) => (
            <path fill={getColor(n, colorNames)} d={getPath(i, bonusValues)}>
              <title>{`${n}\n${ids
                .map(
                  (y) =>
                    `${y} - ${formatCurrency(
                      getBalance(timeBaskets[y].baskets[n])
                    )}`
                )
                .join("\n")}`}</title>
            </path>
          ))}
          {malusNames.map((n, i) => (
            <path fill={getColor(n, colorNames)} d={getPath(i, malusValues)}>
              <title>{`${n}\n${ids
                .map(
                  (y) =>
                    `${y} - ${formatCurrency(
                      getBalance(timeBaskets[y].baskets[n])
                    )}`
                )
                .join("\n")}`}</title>
            </path>
          ))}
        </svg>
        <g style={{ transform: "translateX(100%)" }}>
          <Icon
            x="-20"
            y="0"
            size={20}
            icon={inModal() ? CloseIcon : ExpandIcon}
            onClick={() => inModal(!inModal())}
          />
        </g>
      </svg>
      <svg style={{ width: "100%", height: "40px" }}>
        {ids.map((id, i) => (
          <text
            x={`${(100 / (ids.length + 1)) * (i + 1)}%`}
            y={20 + (i % 2 === 0 || ids.length <= 20 ? 0 : 20)}
            style={{ textAnchor: "middle" }}
          >
            {id}
            <title>
              {[
                ...bonusNames
                  .map((name) => ({
                    name,
                    balance: getBalance(timeBaskets[id].baskets[name]),
                  }))
                  .filter(({ balance }) => balance > 0)
                  .reverse(),
                ...malusNames
                  .map((name) => ({
                    name,
                    balance: getBalance(timeBaskets[id].baskets[name]),
                  }))
                  .filter(({ balance }) => balance < 0),
              ]
                .map(
                  ({ name, balance }) => `${name}: ${formatCurrency(balance)}`
                )
                .join("\n")}
            </title>
          </text>
        ))}
      </svg>
    </>
  );
  return inModal() ? (
    <FullScreenModal>{content}</FullScreenModal>
  ) : (
    <div style={{ height: 240 }}>{content}</div>
  );
}

function getBasket(
  path: string[],
  root: IBasketWithRecords
): IBasketWithRecords {
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
  return Math.min(0, getBalance(basket));
}

function getBonus(basket: IBasketWithRecords | undefined) {
  return Math.max(0, getBalance(basket));
}

const xStep = 100;
function getPath(i: number, values: number[][]) {
  const lower = values.map((vs) => -vs[i]);
  const upper = values.map((vs) => -vs[i + 1]);
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

function getYLegendValues(maxBonusVal: number, maxMalusVal: number) {
  const range = maxBonusVal - maxMalusVal;
  const log = Math.floor(Math.log10(range));
  const baseStep = Math.pow(10, log - 1);
  let step = baseStep;
  for (const m of [1, 2, 5, 10, 20, 50]) {
    step = m * baseStep;
    if (range / step < 15) break;
  }
  const niceVals: number[] = [];
  let c = 0;
  while (c >= maxMalusVal) {
    niceVals.push(c);
    c -= step;
  }
  c = 0;
  while ((c += step) < maxBonusVal) {
    niceVals.unshift(c);
  }
  return niceVals;
}

function sortBasketNamesBy(
  allbaskets: IBasketWithRecords,
  fn: (basket: IBasketWithRecords | undefined) => number
) {
  return Object.keys(allbaskets.baskets).sort(
    (a, b) => fn(allbaskets.baskets[b]) - fn(allbaskets.baskets[a])
  );
}
