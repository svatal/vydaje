import { IData } from "./model/model";
import { parseArrayAndFixDate } from "./util";

export interface IStorage {
  store(data: IData): void;
  get(): IData;
}

export const LocalStorage: IStorage = {
  get() {
    return {
      records: parseArrayAndFixDate(localStorage.getItem("records")),
      rules: parseArrayAndFixDate(localStorage.getItem("rules")),
      transferRules: parseArrayAndFixDate(
        localStorage.getItem("transferRules")
      ),
    };
  },
  store(data) {
    localStorage.setItem("records", JSON.stringify(data.records));
    localStorage.setItem("rules", JSON.stringify(data.rules));
    localStorage.setItem("transferRules", JSON.stringify(data.transferRules));
  },
};
