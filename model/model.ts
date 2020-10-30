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
  @computed get overTimeInMs() {
    return this.records.length
      ? this.records[this.records.length - 1].date.getTime() -
          this.records[0].date.getTime()
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
  @computed get allBaskets() {
    return rule.sort(this.records, this.rules, this.transferRules);
  }
  @computed get yearBaskets() {
    return this.splitIntoBaskets(getYear);
  }
  @computed get monthBaskets() {
    return this.splitIntoBaskets(getMonth);
  }

  @computed getRulesForRecord(record: r.IRecord) {
    return this.rules.filter((r) => rule.isMatch(record, r));
  }

  @computed getBasketForRecord(record: r.IRecord) {
    const [rule] = this.getRulesForRecord(record);
    const basket = !rule ? ["ostatni"] : rule.bskt;
    if (!basket) return null;
    return [...basket, `${record.targetAccount}/${record.targetBank}`];
  }

  splitIntoBaskets(splitter: (d: Date) => string) {
    const splitRecords = this.splitRecordsBy(splitter);
    return Object.keys(splitRecords).reduce((c, id) => {
      c[id] = rule.sort(
        splitRecords[id],
        this.rules,
        this.transferRules.filter((r) => splitter(r.date) === id)
      );
      return c;
    }, {} as { [id: string]: rule.IBasketWithRecords });
  }

  splitRecordsBy(splitter: (d: Date) => string) {
    let basket: { [id: string]: r.IRecord[] } = {};
    this.records.forEach((record) => {
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
