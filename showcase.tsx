import * as b from "bobril";
import { model } from "./model/model";
import { renderBasket } from "./basketPie";
import { renderRecordsTable } from "./recordsTable";
import { renderTimeGraph } from "./yearGraph";
import { safeGet } from "./util";
import { DateRangePicker } from "./components/dateRangePicker";
import { useDelayed } from "./hooks";

enum DisplaySum {
  absolute = 0,
  monthly = 30 * 24 * 60 * 60 * 1000,
  yearly = 365 * 24 * 60 * 60 * 1000,
}

const displaySum = DisplaySum.monthly;
let path: string[] = [];

export function Showcase() {
  const baseDate = safeGet(model.records, 0)?.date;
  const lastDate = safeGet(model.records, model.records.length - 1)?.date;
  const [
    { from, to },
    setTimeRange,
    { from: earlyFrom, to: earlyTo },
  ] = useDelayed({ from: baseDate, to: lastDate });
  const allBaskets = model.getAllBaskets(from, to);
  const baskets = [allBaskets];
  path.forEach(p => {
    const nextBasket = baskets[baskets.length - 1].baskets[p];
    if (nextBasket !== undefined) {
      baskets.push(nextBasket);
    }
  });
  if (baskets.length <= path.length) {
    path = path.slice(0, baskets.length - 1);
  }
  const displayCoef = getSumCoef(displaySum, from, to);
  return (
    <div>
      {baseDate && lastDate && earlyFrom && earlyTo && (
        <DateRangePicker
          min={baseDate}
          max={lastDate}
          from={earlyFrom}
          to={earlyTo}
          onChange={(from, to) => setTimeRange({ from, to })}
        />
      )}
      {baskets.map((b, i) =>
        renderBasket(b, i, path, updatePathComponent, displayCoef)
      )}
      {from &&
        to &&
        to.getTime() - from.getTime() >= 1000 * 60 * 60 * 24 * 365 * 2 &&
        renderTimeGraph(allBaskets, model.getYearBaskets(from, to), path)}
      {renderTimeGraph(allBaskets, model.getMonthBaskets(from, to), path)}
      {renderRecordsTable(baskets[baskets.length - 1])}
    </div>
  );
}

function updatePathComponent(basketName: string, level: number) {
  return {
    onClick: () => {
      if (level + 1 === path.length && path[path.length - 1] == basketName) {
        path = [...path.slice(0, level)];
      } else {
        path = [...path.slice(0, level), basketName];
      }
      b.invalidate();
      return true;
    },
  };
}

function getSumCoef(
  ds: DisplaySum,
  from: Date | undefined,
  to: Date | undefined
) {
  switch (ds) {
    case DisplaySum.absolute:
      return 1;
    default:
      return ds / model.getOverTimeInMs(from, to);
  }
}
