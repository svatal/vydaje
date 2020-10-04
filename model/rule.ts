import { formatDate } from "../util";
import * as r from "./record";

export interface INormalizedRule {
  tx?: string;
  acc?: string;
  srcAcc?: string;
  subStr?: string;
  regEx?: string;
  type?: string;
  bskt: string[] | null;
}

export interface IBasket {
  plus: number;
  minus: number;
  records: r.IRecord[];
  baskets: { [basket: string]: IBasket };
}

function createEmptyBasket(): IBasket {
  return {
    plus: 0,
    minus: 0,
    records: [],
    baskets: {},
  };
}

export interface ITransferRule {
  fromBasket: string[];
  toBasket: string[];
  date: Date;
  amount: number;
  message?: string;
}

export function sort(
  records: r.IRecord[],
  rules: INormalizedRule[],
  transferRules: ITransferRule[]
) {
  const root = createEmptyBasket();
  // console.log("---------------------");
  records.forEach((r) => {
    const rulePath = getBasketPath(r, rules);
    if (rulePath === null) {
      return;
    }
    // if (
    //   r.recieversMessage.indexOf("Výběr z bankomatu") >= 0 &&
    //   r.note.indexOf("Výběr z bankomatu") !== 0 &&
    //   rulePath[0] === "Výběr z bankomatu"
    // )
    //   console.log("missing rule", rulePath, r.note);
    const basketPath = [...rulePath, `${r.targetAccount}/${r.targetBank}`];
    addToBasket(root, basketPath, r);
  });
  transferRules!.forEach((r) => {
    const minusRecord: r.IRecord = {
      amount: -r.amount,
      date: r.date,
      note: r.message || "",
      recieversMessage: r.message || "",
      sourceAccount: "cash",
      targetAccount: "cash",
      targetBank: "cash",
      type: "cash",
    };
    const plusRecord = { ...minusRecord, amount: r.amount };
    addToBasket(root, r.fromBasket, plusRecord);
    addToBasket(root, r.toBasket, minusRecord);
  });
  return root;
}

function addToBasket(root: IBasket, path: string[], record: r.IRecord) {
  const baskets = getOrCreateBaskets(root, path);
  baskets.forEach((b) =>
    record.amount > 0 ? (b.plus += record.amount) : (b.minus += record.amount)
  );
  baskets[baskets.length - 1].records.push(record);
}

function getBasketPath(record: r.IRecord, rules: INormalizedRule[]) {
  for (let i = 0; i < rules.length; i++) {
    if (isMatch(record, rules[i])) {
      return rules[i].bskt;
    }
  }
  return ["ostatni"];
}

export function isMatch(record: r.IRecord, rule: INormalizedRule) {
  if (rule.acc && rule.acc !== `${record.targetAccount}/${record.targetBank}`)
    return false;
  if (rule.srcAcc && rule.srcAcc !== record.sourceAccount) return false;
  if (rule.tx && rule.tx !== getTx(record)) return false;
  if (
    rule.subStr &&
    record.note.indexOf(rule.subStr) === -1 &&
    record.recieversMessage.indexOf(rule.subStr) === -1
  )
    return false;
  if (
    rule.regEx &&
    record.note.search(rule.regEx) === -1 &&
    record.recieversMessage.search(rule.regEx) === -1
  )
    return false;
  if (rule.type && rule.type !== record.type) return false;
  return true;
}

export function getTx(record: r.IRecord) {
  return `${record.targetAccount}/${record.sourceAccount}/${
    record.amount
  }/${formatDate(record.date)}`;
}

function getOrCreateBaskets(root: IBasket, path: string[]): IBasket[] {
  if (!path.length) return [root];
  const basket =
    root.baskets[path[0]] || (root.baskets[path[0]] = createEmptyBasket());
  return [root, ...getOrCreateBaskets(basket, path.slice(1))];
}
