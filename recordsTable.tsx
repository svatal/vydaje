import * as b from "bobril";
import { IRecord } from "./model/record";
import { IBasket } from "./model/rule";
import { Table } from "./components/table";

export function renderRecordsTable(basket: IBasket) {
  // const records = getRecords(basket)
  //   .sort((a, b) => a.amount - b.amount)
  //   .slice(0, 50);
  const records = getRecords(basket)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    // .filter(r => r.note.indexOf("Výběr z bankomatu:") !== 0)
    .slice(0, 200);
  return (
    <Table
      headers={[
        "account",
        "datum",
        "castka",
        "zprava pro prijemce",
        "poznamka",
      ]}
      data={records.map((r) => ({
        columns: [
          `${r.targetAccount}/${r.targetBank}`,
          `${r.date.getFullYear()}/${
            r.date.getMonth() + 1
          }/${r.date.getDate()}`,
          r.amount,
          r.recieversMessage,
          r.note,
        ],
      }))}
    />
  );
}

function getRecords(basket: IBasket): IRecord[] {
  const baskets = basket.baskets;
  return [
    ...Object.keys(baskets).reduce(
      (c, n) => [...c, ...getRecords(baskets[n])],
      [] as IRecord[]
    ),
    ...basket.records,
  ];
}
