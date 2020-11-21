import * as b from "bobril";
import { formatDate, getDateFromDay, getDayFromDate } from "../util";
import { MinMaxSlider } from "./minMaxSlider";

export function DateRangePicker(p: {
  min: Date;
  max: Date;
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}) {
  const min = getDayFromDate(p.min);
  const max = getDayFromDate(p.max);
  const from = getDayFromDate(p.from);
  const to = getDayFromDate(p.to);
  return (
    <div>
      <MinMaxSlider
        min={min}
        max={max}
        lower={from}
        onLowerChange={(newFrom) => p.onChange(getDateFromDay(newFrom), p.to)}
        higher={to}
        onHigherChange={(newTo) => p.onChange(p.from, getDateFromDay(newTo))}
        width={500}
      />
      {formatDate(getDateFromDay(from))} - {formatDate(getDateFromDay(to))}
    </div>
  );
}
