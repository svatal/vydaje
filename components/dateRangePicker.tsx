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
  const pFrom = getDayFromDate(p.from);
  const pTo = getDayFromDate(p.to);
  const [from, setFrom] = b.useState(pFrom);
  const [to, setTo] = b.useState(pTo);
  const timeoutId = b.useRef<ReturnType<typeof setTimeout>>();
  function scheduleUpdate(newFrom: number, newTo: number) {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(
      () => p.onChange(getDateFromDay(newFrom), getDateFromDay(newTo)),
      1000
    );
  }
  return (
    <div>
      <MinMaxSlider
        min={min}
        max={max}
        lower={from}
        onLowerChange={(newFrom) => {
          setFrom(newFrom);
          scheduleUpdate(newFrom, to);
        }}
        higher={to}
        onHigherChange={(newTo) => {
          setTo(newTo);
          scheduleUpdate(from, newTo);
        }}
        width={500}
      />
      {formatDate(getDateFromDay(from))} - {formatDate(getDateFromDay(to))}
    </div>
  );
}
