import * as b from "bobril";

export interface IIconDef {
  svg: b.IBobrilChildren;
  size: number;
}

export function Icon(p: {
  icon: IIconDef;
  x?: number | string;
  y?: number | string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <svg
      x={p.x}
      y={p.y}
      width={p.size}
      height={p.size}
      viewBox={`0 0 ${p.icon.size} ${p.icon.size}`}
      onClick={p.onClick}
      style={{ cursor: p.onClick ? "pointer" : "default" }}
    >
      <rect width="100%" height="100%" fill="transparent" />
      {p.icon.svg}
    </svg>
  );
}
