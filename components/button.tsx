import * as b from "bobril";

export function Button(
  p: { text: string, disabled?: boolean } & (
    | { route: string }
    | { onClick: () => void; selected?: boolean }
  )
) {
  const selected = hasOnClick(p) ? !!p.selected : b.isActive(p.route);
  return (
    <input
      type="button"
      style={selected ? { fontWeight: "bold" } : undefined}
      disabled={p.disabled ? "disabled" : undefined}
      value={p.text}
      onClick={
        hasOnClick(p)
          ? p.onClick
          : () => b.runTransition(b.createRedirectPush(p.route))
      }
    />
  );
}

function hasOnClick(o: object): o is { onClick: () => void } {
  return "onClick" in o;
}
