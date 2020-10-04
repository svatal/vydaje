import * as b from "bobril";

export function ContextMenu(p: {
  pos: {
    x: number;
    y: number;
  };
  onHide: () => void;
  rows: {
    label: string;
    onClick: () => void;
  }[];
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: "rgba(0,0,0,0.2)",
        }}
        onClick={p.onHide}
      />
      <div
        style={{
          position: "absolute",
          left: p.pos.x,
          top: p.pos.y,
          width: 300,
          height: p.rows.length * 20,
          background: "white",
          padding: 10,
        }}
      >
        {p.rows.map((r) => (
          <div
            style={{ height: 20, lineHeight: "20px", cursor: "pointer" }}
            onClick={() => {
              r.onClick();
              p.onHide();
              return true;
            }}
          >
            {r.label}
          </div>
        ))}
      </div>
    </>
  );
}
