import * as b from "bobril";

export function Modal(p: { children: b.IBobrilChildren }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0,0,0,0.2)",
        display: "grid",
      }}
    >
      <div style={{ margin: "auto", background: "white", padding: "10px" }}>
        {p.children}
      </div>
    </div>
  );
}
