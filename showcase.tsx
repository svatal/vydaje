import * as b from "bobril";
import { model } from "./model/model";
import { renderBasket } from "./basketPie";
import { renderRecordsTable } from "./recordsTable";
import { renderTimeGraph } from "./yearGraph";
import { formatDate, safeGet } from "./util";
import { DateRangePicker } from "./components/dateRangePicker";

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
  const [from, setFrom] = b.useState(baseDate);
  const [to, setTo] = b.useState(lastDate);
  const baskets = [model.allBaskets];
  path.forEach((p) => baskets.push(baskets[baskets.length - 1].baskets[p]));
  const displayCoef = getSumCoef(displaySum);
  return (
    <div>
      {baseDate && lastDate && from && to && (
        <DateRangePicker
          min={baseDate}
          max={lastDate}
          from={from}
          to={to}
          onChange={(from, to) => {
            console.log("delayed update!", formatDate(from), formatDate(to));
            setFrom(from);
            setTo(to);
          }}
        />
      )}
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
