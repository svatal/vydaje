import * as b from "bobril";

const thumbWidth = 16;
export function MinMaxSlider(p: {
  min: number;
  max: number;
  lower: number;
  onLowerChange: (value: number) => void;
  higher: number;
  onHigherChange: (value: number) => void;
  width?: number;
}) {
  const width = p.width ?? 200;
  const split = (p.lower + p.higher) / 2;
  const minMax = Math.floor(split);
  const maxMin = Math.ceil(split);
  const step = (width - 2 * thumbWidth) / (p.max - p.min);
  return (
    <>
      <input
        type="range"
        min={p.min}
        max={minMax}
        step="1"
        value={p.lower}
        onInput={(ev) => {
          const value = parseInt(ev.value as string);
          if (value === p.lower) return;
          p.onLowerChange(value);
        }}
        style={[sliderStyle, { width: step * (minMax - p.min) + thumbWidth }]}
      />
      <input
        type="range"
        min={maxMin}
        max={p.max}
        step="1"
        value={p.higher}
        onInput={(ev) => {
          const value = parseInt(ev.value as string);
          if (value === p.higher) return;
          p.onHigherChange(value);
        }}
        style={[
          sliderStyle,
          {
            paddingLeft: (maxMin - minMax) * step,
            width: step * (p.max - maxMin) + thumbWidth,
          },
        ]}
      />
    </>
  );
}

const sliderStyle = b.styleDef({
  margin: 0,
  "-webkit-appearance": "none",
  outline: "none !important",
  background: "transparent",
  backgroundImage:
    "linear-gradient(to bottom, transparent 0%, transparent 30%, silver 30%, silver 60%, transparent 60%, transparent 100%)",
});
