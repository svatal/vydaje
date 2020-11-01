export function getColor(basketName: string, names: string[]) {
  const idx = names.findIndex((n) => n === basketName) + 1 || names.length + 1;
  if (idx == names.length + 1) names.push(basketName);
  const dividers = idx.toString(8);
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < dividers.length; i++) {
    const num = parseInt(dividers[dividers.length - 1 - i]);
    if (num % 2) r += Math.pow(2, 7 - i);
    if ((num >> 1) % 2) g += Math.pow(2, 7 - i);
    if ((num >> 2) % 2) b += Math.pow(2, 7 - i);
  }
  return `#${(r < 16 ? "0" : "") + r.toString(16)}${
    (g < 16 ? "0" : "") + g.toString(16)
  }${(b < 16 ? "0" : "") + b.toString(16)}`;
}

export function formatCurrency(val: number) {
  return `${Math.floor(val)
    .toString()
    .split("")
    .reverse()
    .join("")
    .match(/.{1,3}/g)!
    .reverse()
    .map((x) => x.split("").reverse().join(""))
    .join(" ")} Kc`;
}

export function leftPad2(x: number) {
  return x > 9 ? x.toString() : "0" + x;
}

export function basketToString(basket: string[] | null): string {
  return basket?.join("/") || "<odstranit>";
}

export function parseArrayAndFixDate(content: string | null): any[] {
  return content
    ? JSON.parse(content, (key, value) =>
        key === "date" ? new Date(value) : value
      )
    : [];
}

export function parseAndFixDate<T>(content: string | null): T | null {
  return content
    ? JSON.parse(content, (key, value) =>
        key === "date" ? new Date(value) : value
      )
    : null;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function safeGet<T>(array: T[], index: number): T | undefined {
  return array[index];
}

export function getDayFromDate(date: Date | undefined): number {
  if (!date) return 0;
  return Math.trunc(date.getTime() / 1000 / 60 / 60 / 24);
}

export function getDateFromDay(day: number): Date {
  return new Date(day * 1000 * 60 * 60 * 24);
}
