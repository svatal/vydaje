import * as b from "bobril";

export enum Orientation {
  Top,
  Left,
}

export function TooltipWrapper(p: {
  children: b.IBobrilChildren;
  tooltip: b.IBobrilChildren;
  orientation?: Orientation;
}) {
  return (
    <div style={wrapperStyle}>
      {p.children}
      <div style={[tooltipStyle, tooltipTopStyle]}>{p.tooltip}</div>
    </div>
  );
}

const wrapperStyle = b.styleDef({
  position: "relative",
  display: "inline-block",
});

const tooltipStyle = [
  b.styleDef(
    {
      visibility: "hidden",
      backgroundColor: "#555",
      color: "#fff",
      textAlign: "center",
      padding: 5,
      borderRadius: 6,
      position: "absolute",
      zIndex: 1,
    },
    {
      after: {
        content: "",
        position: "absolute",
        top: "100%",
        left: 50,
        marginLeft: -5,
        borderWidth: 5,
        borderStyle: "solid",
        borderColor: "#555 transparent transparent transparent",
      },
    }
  ),
  b.styleDefEx(wrapperStyle + ":hover>", { visibility: "visible" }),
];

const tooltipTopStyle = b.styleDef({
  minWidth: 120,
  bottom: "125%",
  left: "50%",
  marginLeft: -60,
});
