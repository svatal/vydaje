import * as b from "bobril";

export function FullScreenModal(p: { children: b.IBobrilChildren }) {
  return (
    <b.Portal>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: "white",
          padding: "10px",
        }}
      >
        {p.children}
      </div>
    </b.Portal>
  );
}
