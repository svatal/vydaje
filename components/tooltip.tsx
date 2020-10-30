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
  const orientation = p.orientation || Orientation.Top;
  return (
    <div style={wrapperStyle}>
      {p.children}
      <div
        style={[
          tooltipStyle,
          orientation === Orientation.Top ? tooltipTopStyle : tooltipLeftStyle,
        ]}
      >
        {p.tooltip}
      </div>
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
        borderWidth: 5,
        borderStyle: "solid",
      },
    }
  ),
  b.styleDefEx(wrapperStyle + ":hover>", { visibility: "visible" }),
];

const tooltipTopStyle = b.styleDef(
  {
    minWidth: 120,
    bottom: "125%",
    left: "50%",
    marginLeft: -60,
  },
  {
    after: {
      top: "100%",
      left: 50,
      marginLeft: -5,
      borderColor: "#555 transparent transparent transparent",
    },
  }
);

const tooltipLeftStyle = b.styleDef(
  {
    minHeight: 40,
    right: "125%",
    top: "50%",
    marginTop: -20,
  },
  {
    after: {
      left: "100%",
      top: 20,
      marginTop: -5,
      borderColor: "transparent transparent transparent #555",
    },
  }
);
