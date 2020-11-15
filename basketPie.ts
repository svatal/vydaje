import * as b from "bobril";
import * as rule from "./model/rule";
import { getColor, formatCurrency } from "./util";

export function renderBasket(
  basket: rule.IBasketWithRecords,
  index: number,
  path: string[],
  updatePathComponent: (name: string, index: number) => b.IBobrilComponent,
  displayCoef: number
) {
  const baskets = basket.baskets;
  const names: string[] = [];
  return b.styledDiv(
    [
      pie(baskets, index, names, updatePathComponent, displayCoef),

      names /*.slice(0, 20)*/
        .map((n) => [
          { tag: "br" },
          {
            tag: "span",
            component: updatePathComponent(n, index),
            style:
              path[index] === n ? { backgroundColor: "lightgrey" } : undefined,
            children: [
              b.styledDiv(undefined, {
                height: 20,
                width: 20,
                display: "inline-block",
                backgroundColor: getColor(n, names),
              }),
              ` ${n}  (${formatCurrency(
                displayCoef * getBalance(baskets[n])
              )})`,
            ],
          },
        ]),
    ],
    { float: "left", marginRight: 20 }
  );
}

function pie(
  baskets: { [basket: string]: rule.IBasketWithRecords },
  index: number,
  colors: string[],
  updatePathComponent: (name: string, index: number) => b.IBobrilComponent,
  displayCoef: number
) {
  const names = Object.keys(baskets);
  const sumOfMaluses = names.reduce(
    (sum, name) => sum + getMalus(baskets[name]),
    0
  );
  const useMalus = sumOfMaluses != 0;
  const sum = useMalus
    ? sumOfMaluses
    : names.reduce((sum, name) => sum + getBonus(baskets[name]), 0);
  names.sort(
    (a, b) =>
      (useMalus ? 1 : -1) * (getBalance(baskets[a]) - getBalance(baskets[b]))
  );
  let currentSum = 0;
  return [
    `sum: ${formatCurrency(sum * displayCoef)}`,
    { tag: "br" },
    {
      tag: "svg",
      attrs: { width: 200, height: 200, viewBox: "-1 -1 2 2" },
      children: names.map((name) => {
        const oldSum = currentSum;
        const current = useMalus
          ? getMalus(baskets[name])
          : getBonus(baskets[name]);
        currentSum += current;
        return {
          tag: "path",
          component: updatePathComponent(name, index),
          attrs: {
            d: b.svgPie(
              0,
              0,
              1,
              0,
              (oldSum / sum) * 360,
              (currentSum / sum) * 360
            ),
            fill: getColor(name, colors),
          },
          children: {
            tag: "title",
            children: `${name} - ${formatCurrency(displayCoef * current)}`,
          },
        };
      }),
    },
  ];
}

function getMalus(basket: rule.IBasketWithRecords) {
  return -Math.min(0, basket.plus + basket.minus);
}

function getBonus(basket: rule.IBasketWithRecords) {
  return Math.max(0, basket.plus + basket.minus);
}

function getBalance(basket: rule.IBasketWithRecords) {
  return basket.plus + basket.minus;
}
