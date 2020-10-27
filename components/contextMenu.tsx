import * as b from "bobril";

export interface IContextMenuRow {
  label: string;
  onClick: () => void;
}

export function ContextMenu(p: {
  pos: {
    x: number;
    y: number;
  };
  onHide: () => void;
  onCancel?: () => void;
  rows: IContextMenuRow[];
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
        onClick={() => {
          p.onCancel?.();
          p.onHide();
        }}
      />
      <div
        style={{
          position: "absolute",
          left: p.pos.x,
          top: p.pos.y,
          background: "white",
          padding: 10,
        }}
      >
        {p.rows.map((r) => (
          <div
            style={{ lineHeight: "20px", cursor: "pointer" }}
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
