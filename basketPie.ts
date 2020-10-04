import * as b from "bobril";
import * as rule from "./model/rule";
import { getColor, formatCurrency } from "./util";

export function renderBasket(
  basket: rule.IBasket,
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
  baskets: { [basket: string]: rule.IBasket },
  index: number,
  colors: string[],
  updatePathComponent: (name: string, index: number) => b.IBobrilComponent,
  displayCoef: number
) {
  const names = Object.keys(baskets);
  const sum = names.reduce((sum, name) => sum + getMalus(baskets[name]), 0);
  names.sort((a, b) => getBalance(baskets[a]) - getBalance(baskets[b]));
  let currentSum = 0;
  return [
    `sum: ${formatCurrency(sum * displayCoef)}`,
    { tag: "br" },
    {
      tag: "svg",
      attrs: { width: 200, height: 200, viewBox: "-1 -1 2 2" },
      children: names.map((name) => {
        const oldSum = currentSum;
        const malus = getMalus(baskets[name]);
        currentSum += malus;
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
            children: `${name} - ${formatCurrency(displayCoef * malus)}`,
          },
        };
      }),
    },
  ];
}

export function getMalus(basket: rule.IBasket) {
  return -Math.min(0, basket.plus + basket.minus);
}

function getBalance(basket: rule.IBasket) {
  return basket.plus + basket.minus;
}
