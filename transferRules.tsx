import * as b from "bobril";
import { model } from "./model/model";
import { Table } from "./components/table";
import { basketToString } from "./util";

export function TransferRules() {
  const rules = model.transferRules.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  return (
    <Table
      headers={["z kosiku", "do kosiku", "datum", "castka", "poznamka"]}
      data={rules.map((r) => ({
        columns: [
          basketToString(r.fromBasket),
          basketToString(r.toBasket),
          `${r.date.getFullYear()}/${
            r.date.getMonth() + 1
          }/${r.date.getDate()}`,
          r.amount,
          r.message,
        ],
      }))}
    />
  );
}
