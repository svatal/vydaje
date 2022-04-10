import * as b from "bobril";
import { model } from "./model/model";
import { IRecord } from "./model/record";
import { HeaderWithContent } from "./components/headerWithContent";
import { Button } from "./components/button";
import { ContextMenu } from "./components/contextMenu";
import { RecordRuleModal } from "./createRule/recordRuleModal";
import { TextSelectionRuleModal } from "./createRule/textSelectionRuleModal";
import { RecordsTable, recordsTableMaxLimit } from "./recordsTable";
import { TargetAccountRuleModal } from "./createRule/targetAccountRuleModal";

enum Filter {
  All,
  NoRule,
  MultipleRules,
  Search,
}

enum CreateRuleType {
  Record,
  SelectionText,
  TargetAccount,
}

export function Records() {
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
  const [selection, setTextSelection] = b.useState<string | undefined>(
    undefined
  );

  const allRecords = model.records.filter(getFilter(filter, searchString));
  const hideBasketColumn = filter === Filter.NoRule;
  return (
    <>
      <HeaderWithContent>
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
          )}{" "}
          ({Math.min(allRecords.length, recordsTableMaxLimit)} /{" "}
          {allRecords.length}), castka: +
          {Math.round(
            allRecords.reduce((r, c) => r + Math.max(0, c.amount), 0)
          )}{" "}
          / -
          {Math.round(
            allRecords.reduce((r, c) => r + Math.max(0, -c.amount), 0)
          )}
        </>
        <RecordsTable
          records={allRecords}
          showBasketsColumn={!hideBasketColumn}
          onContextMenu={(r, pos) => {
            setSelectedRecord(r);
            setContextMenu(pos);
            setTextSelection(getSelectionMatchingRecord(r));
          }}
          isSelected={(r) => r === selectedRecord}
        />
      </HeaderWithContent>
      {contextMenu && selectedRecord && (
        <ContextMenu
          pos={contextMenu}
          onHide={() => setContextMenu(undefined)}
          onCancel={() => setSelectedRecord(undefined)}
          rows={[
            {
              label: "Pravidlo pro tento zaznam",
              onClick: () => setCreateRuleType(CreateRuleType.Record),
            },
            ...(selection
              ? [
                  {
                    label: `Pravidlo pro zaznamy obsahujici '${selection}'`,
                    onClick: () =>
                      setCreateRuleType(CreateRuleType.SelectionText),
                  },
                ]
              : []),
            ...(selectedRecord.targetAccount
              ? [
                  {
                    label: `Pravidlo pro zaznamy s protiuctem ${selectedRecord.targetAccount}/${selectedRecord.targetBank}`,
                    onClick: () =>
                      setCreateRuleType(CreateRuleType.TargetAccount),
                  },
                ]
              : []),
          ]}
        />
      )}
      {createRuleType === CreateRuleType.Record && selectedRecord && (
        <RecordRuleModal
          record={selectedRecord}
          onClose={() => {
            setSelectedRecord(undefined);
            setCreateRuleType(undefined);
          }}
        />
      )}
      {createRuleType === CreateRuleType.SelectionText &&
        selectedRecord &&
        selection && (
          <TextSelectionRuleModal
            record={selectedRecord}
            textSelection={selection}
            onClose={() => {
              setSelectedRecord(undefined);
              setCreateRuleType(undefined);
            }}
          />
        )}
      {createRuleType === CreateRuleType.TargetAccount && selectedRecord && (
        <TargetAccountRuleModal
          record={selectedRecord}
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

function getSelectionMatchingRecord(record: IRecord): string | undefined {
  const selection = document.getSelection()?.toString();
  if (!selection) return undefined;
  if (
    record.note.indexOf(selection) >= 0 ||
    record.recieversMessage.indexOf(selection) >= 0
  )
    return selection;
  return undefined;
}
