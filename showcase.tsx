import * as b from "bobril";
import { model } from "./model/model";
import { renderBasket } from "./basketPie";
import { renderRecordsTable } from "./recordsTable";
import { renderTimeGraph } from "./yearGraph";

enum DisplaySum {
  absolute = 0,
  monthly = 30 * 24 * 60 * 60 * 1000,
  yearly = 365 * 24 * 60 * 60 * 1000,
}

const displaySum = DisplaySum.monthly;
let path: string[] = [];

export function Showcase() {
  const baskets = [model.allBaskets];
  path.forEach((p) => baskets.push(baskets[baskets.length - 1].baskets[p]));
  const displayCoef = getSumCoef(displaySum);
  return (
    <div>
      {baskets.map((b, i) =>
        renderBasket(b, i, path, updatePathComponent, displayCoef)
      )}
      {renderTimeGraph(model.allBaskets, model.yearBaskets, path)}
      {renderTimeGraph(model.allBaskets, model.monthBaskets, path)}
      {renderRecordsTable(baskets[baskets.length - 1])}
    </div>
  );
}

function updatePathComponent(basketName: string, level: number) {
  return {
    onClick: () => {
      path = [...path.slice(0, level), basketName];
      b.invalidate();
      return true;
    },
  };
}

function getSumCoef(ds: DisplaySum) {
  switch (ds) {
    case DisplaySum.absolute:
      return 1;
    default:
      return ds / model.overTimeInMs;
  }
}
