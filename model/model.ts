import { observable, computed } from "bobx";
import * as r from "./record";
import * as rule from "./rule";
import { leftPad2 } from "../util";
import { IStorage } from "../storage";

export interface IData {
  records: r.IRecord[];
  rules: rule.INormalizedRule[];
  transferRules: rule.ITransferRule[];
}

class Model {
  storage: IStorage | undefined;
  load(data: IData) {
    this.records = data.records;
    this.rules = data.rules;
    this.transferRules = data.transferRules;
  }
  store() {
    if (!this.storage) throw "Storage not set!";
    this.storage.store(this);
  }
  @observable records: r.IRecord[] = [];
  @observable rules: rule.INormalizedRule[] = [];
  @observable transferRules: rule.ITransferRule[] = [];
  @computed getOverTimeInMs(from: Date | undefined, to: Date | undefined) {
    const records = this.getRecords(from, to);
    return records.length
      ? records[records.length - 1].date.getTime() - records[0].date.getTime()
      : 1;
  }
  @computed get basketTree() {
    const baskets = [
      ...this.rules.map((r) => r.bskt),
      ...this.transferRules.map((r) => r.toBasket),
      ...this.transferRules.map((r) => r.fromBasket),
    ];
    const basketTree = <IBasket>{ children: {} };
    baskets.forEach((basket) => appendBasket(basket, basketTree));
    return basketTree;
  }
  @computed getAllBaskets(from: Date | undefined, to: Date | undefined) {
    return rule.sort(
      this.getRecords(from, to),
      this.rules,
      filter(this.transferRules, from, to)
    );
  }
  @computed getYearBaskets(from: Date | undefined, to: Date | undefined) {
    return this.splitIntoBaskets(getYear, from, to);
  }
  @computed getMonthBaskets(from: Date | undefined, to: Date | undefined) {
    return this.splitIntoBaskets(getMonth, from, to);
  }

  @computed getRulesForRecord(record: r.IRecord) {
    return this.rules.filter((r) => rule.isMatch(record, r));
  }

  @computed private getRecords(from: Date | undefined, to: Date | undefined) {
    return filter(this.records, from, to);
  }

  private splitIntoBaskets(
    splitter: (d: Date) => string,
    from: Date | undefined,
    to: Date | undefined
  ) {
    const splitRecords = this.splitRecordsBy(splitter, from, to);
    return Object.keys(splitRecords).reduce((c, id) => {
      c[id] = rule.sort(
        splitRecords[id],
        this.rules,
        this.transferRules.filter((r) => splitter(r.date) === id)
      );
      return c;
    }, {} as { [id: string]: rule.IBasketWithRecords });
  }

  private splitRecordsBy(
    splitter: (d: Date) => string,
    from: Date | undefined,
    to: Date | undefined
  ) {
    let basket: { [id: string]: r.IRecord[] } = {};
    this.getRecords(from, to).forEach((record) => {
      let id = splitter(record.date);
      if (!basket[id]) basket[id] = [];
      basket[id].push(record);
    });
    return basket;
  }
}

export const model = new Model();

function getYear(date: Date) {
  return date.getFullYear().toString();
}

function getMonth(date: Date) {
  return (
    date.getFullYear() +
    "/" +
    leftPad2(Math.floor(date.getMonth() / 2) * 2 + 1) +
    "-" +
    leftPad2(Math.floor(date.getMonth() / 2) * 2 + 2)
  );
}

export interface IBasket {
  children: { [name: string]: IBasket };
}

function appendBasket(basket: string[] | null, node: IBasket) {
  if (!basket || !basket.length) return;
  const [current, ...rest] = basket;
  if (!node.children[current]) {
    node.children[current] = { children: {} };
  }
  appendBasket(rest, node.children[current]);
}

function filter<T extends { date: Date }>(
  items: T[],
  from: Date | undefined,
  to: Date | undefined
) {
  return items.filter(
    (i) => (!from || i.date >= from) && (!to || i.date <= to)
  );
}
