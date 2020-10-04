import * as b from "bobril";

export function VerticalLayout(p: {
  // topContent: b.IBobrilChildren;
  // children: b.IBobrilChildren;
  children: [b.IBobrilNode, b.IBobrilNode];
}) {
  const [topContent, mainContent] = p.children;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "max-content 1fr",
        height: "100%",
      }}
    >
      <div>{topContent}</div>
      <div style={{ overflow: "auto" }}>{mainContent}</div>
    </div>
  );
}
