import * as b from "bobril";
import { model } from "./model/model";
import { IRecord } from "./model/record";
import { Table } from "./components/table";
import { basketToString } from "./util";
import { HeaderWithContent } from "./components/headerWithContent";
import { Button } from "./components/button";
import { formatDate } from "./util";
import { ContextMenu } from "./components/contextMenu";
import { RecordRuleModal } from "./createRule/recordRuleModal";

enum Filter {
  All,
  NoRule,
  MultipleRules,
  Search,
}

enum CreateRuleType {
  Record,
}

export function Records(p?: {
  records?: IRecord[];
  hideBasketColumn?: boolean;
}) {
  const [filter, setFilter] = b.useState(Filter.NoRule);
  const [searchString, setSearchString] = b.useState("");
  const [selectedRecord, setSelectedRecord] = b.useState<IRecord | undefined>(
    undefined
  );
  const [contextMenu, setContextMenu] = b.useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [createRuleType, setCreateRuleType] = b.useState<
    CreateRuleType | undefined
  >(undefined);

  const allRecords =
    p?.records ?? model.records.filter(getFilter(filter, searchString));
  const records = allRecords.slice(0, 200);
  const hideBasketColumn = !!p?.hideBasketColumn || filter === Filter.NoRule;
  return (
    <>
      <HeaderWithContent>
        {p?.records ? (
          <></>
        ) : (
          <>
            <Button
              text={"Vsechny"}
              selected={filter === Filter.All}
              onClick={() => setFilter(Filter.All)}
            />
            <Button
              text={"Neprirazene"}
              selected={filter === Filter.NoRule}
              onClick={() => setFilter(Filter.NoRule)}
            />
            <Button
              text={"S vice pravidly"}
              selected={filter === Filter.MultipleRules}
              onClick={() => setFilter(Filter.MultipleRules)}
            />
            <Button
              text={"Podretezec"}
              selected={filter === Filter.Search}
              onClick={() => setFilter(Filter.Search)}
            />
            {filter === Filter.Search && (
              <input
                type="text"
                onChange={(newValue) => setSearchString(newValue)}
              ></input>
            )}
            ({records.length} / {allRecords.length})
          </>
        )}
        <Table
          headers={[
            "account",
            "datum",
            "castka",
            "zprava pro prijemce",
            "poznamka",
            ...(hideBasketColumn ? [] : ["cilovy kosik"]),
          ]}
          data={records.map((r) => ({
            onContextMenu: (pos) => {
              setSelectedRecord(r);
              setContextMenu(pos);
            },
            isSelected: r === selectedRecord,
            columns: [
              `${r.targetAccount}/${r.targetBank}`,
              formatDate(r.date),
              r.amount,
              r.recieversMessage,
              r.note,
              ...(hideBasketColumn
                ? []
                : [
                    getMatchingRules(r).map((rule) => (
                      <div>{basketToString(rule.bskt)}</div>
                    )),
                  ]),
            ],
          }))}
        />
      </HeaderWithContent>
      {contextMenu && (
        <ContextMenu
          pos={contextMenu}
          onHide={() => setContextMenu(undefined)}
          onCancel={() => setSelectedRecord(undefined)}
          rows={[
            {
              label: "Pravidlo pro tento zaznam",
              onClick: () => setCreateRuleType(CreateRuleType.Record),
            },
          ]}
        />
      )}
      {createRuleType === CreateRuleType.Record && (
        <RecordRuleModal
          record={selectedRecord!}
          onClose={() => {
            setSelectedRecord(undefined);
            setCreateRuleType(undefined);
          }}
        />
      )}
    </>
  );
}

function getMatchingRules(record: IRecord) {
  return model.getRulesForRecord(record);
}

function getFilter(f: Filter, search: string): (r: IRecord) => boolean {
  switch (f) {
    case Filter.All:
      return () => true;
    case Filter.NoRule:
      return (r) => getMatchingRules(r).length === 0;
    case Filter.MultipleRules:
      return (r) => getMatchingRules(r).length > 1;
    case Filter.Search:
      return (r) =>
        r.note.includes(search) || r.recieversMessage.includes(search);
  }
}
