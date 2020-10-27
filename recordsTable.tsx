import * as b from "bobril";
import { IRecord } from "./model/record";
import { IBasketWithRecords } from "./model/rule";
import { IPosition, Table } from "./components/table";
import { basketToString, formatDate } from "./util";
import { model } from "./model/model";

export function renderRecordsTable(basket: IBasketWithRecords) {
  const records = getRecords(basket).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  return <RecordsTable records={records} showBasketsColumn={false} />;
}

function getRecords(basket: IBasketWithRecords): IRecord[] {
  const baskets = basket.baskets;
  return [
    ...Object.keys(baskets).reduce(
      (c, n) => [...c, ...getRecords(baskets[n])],
      [] as IRecord[]
    ),
    ...basket.records,
  ];
}

export const recordsTableMaxLimit = 200;

export function RecordsTable(p: {
  records: IRecord[];
  showBasketsColumn: boolean;
  onContextMenu?: (record: IRecord, pos: IPosition) => void;
  isSelected?: (record: IRecord) => boolean;
}) {
  const records = p.records.slice(0, recordsTableMaxLimit);
  return (
    <Table
      headers={[
        "account",
        "datum",
        "castka",
        "zprava pro prijemce",
        "poznamka",
        ...(p.showBasketsColumn ? ["cilovy kosik"] : []),
      ]}
      data={records.map((r) => ({
        onContextMenu: p.onContextMenu
          ? (pos) => p.onContextMenu!(r, pos)
          : undefined,
        isSelected: p.isSelected?.(r),
        columns: [
          `${r.targetAccount}/${r.targetBank}`,
          formatDate(r.date),
          r.amount,
          r.recieversMessage,
          r.note,
          ...(p.showBasketsColumn
            ? [
                model
                  .getRulesForRecord(r)
                  .map((rule) => <div>{basketToString(rule.bskt)}</div>),
              ]
            : []),
        ],
      }))}
    />
  );
}
