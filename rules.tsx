import * as b from "bobril";
import { model } from "./model/model";
import { Table } from "./components/table";
import { basketToString } from "./util";
import { INormalizedRule } from "./model/rule";
import { HeaderWithContent } from "./components/headerWithContent";
import { Button } from "./components/button";
import { ContextMenu } from "./components/contextMenu";
import { RecordsTable } from "./recordsTable";

enum RecordFilter {
  Winner,
  Other,
}

export function Rules() {
  const recordsWithRules = model.records.map((r) => ({
    record: r,
    rules: model.getRulesForRecord(r),
  }));
  const [selectedRule, setSelectedRule] = b.useState<INormalizedRule | null>(
    null
  );
  const [recordFilter, setRecordFilter] = b.useState(RecordFilter.Winner);
  const [contextMenu, setContextMenu] = b.useState<
    { pos: { x: number; y: number }; rule: INormalizedRule } | undefined
  >(undefined);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        height: "100%",
      }}
    >
      <div style={{ overflowY: "auto" }}>
        <Table
          headers={["kosik", "pravidlo", "#", "suma"]}
          data={model.rules.map((r) => ({
            onClick: () => setSelectedRule(r),
            onContextMenu: (pos) => setContextMenu({ pos, rule: r }),
            isSelected: r === selectedRule,
            columns: [
              basketToString(r.bskt),
              RuleDescription(r),
              `${recordsWithRules.filter((rr) => rr.rules[0] === r).length} / ${
                recordsWithRules.filter((rr) => rr.rules.indexOf(r) >= 0).length
              }`,
              Math.round(
                recordsWithRules
                  .filter((rr) => rr.rules[0] === r)
                  .reduce((p, c) => p + c.record.amount, 0)
              ),
            ],
          }))}
        />
      </div>
      <div style={{ overflowY: "auto" }}>
        {selectedRule && (
          <HeaderWithContent>
            <>
              <Button
                text={"Vitez"}
                selected={recordFilter === RecordFilter.Winner}
                onClick={() => setRecordFilter(RecordFilter.Winner)}
              />
              <Button
                text={"Ostatni"}
                selected={recordFilter === RecordFilter.Other}
                onClick={() => setRecordFilter(RecordFilter.Other)}
              />
            </>
            {
              <RecordsTable
                showBasketsColumn={recordFilter !== RecordFilter.Winner}
                records={recordsWithRules
                  .filter((r) =>
                    recordFilter === RecordFilter.Winner
                      ? r.rules[0] === selectedRule
                      : r.rules.indexOf(selectedRule) > 0
                  )
                  .map((r) => r.record)}
              />
            }
          </HeaderWithContent>
        )}
      </div>
      {contextMenu && (
        <ContextMenu
          pos={contextMenu.pos}
          onHide={() => setContextMenu(undefined)}
          rows={[
            {
              label: "Smazat",
              onClick: () => {
                model.rules.splice(model.rules.indexOf(contextMenu.rule), 1);
                if (selectedRule === contextMenu.rule) setSelectedRule(null);
                model.store();
              },
            },
          ]}
        />
      )}
    </div>
  );
}

export function RuleDescription(r: INormalizedRule) {
  return [
    rule("Typ", r.type),
    rule("cilovy ucet", r.acc),
    rule("zdrojovy ucet", r.srcAcc),
    rule("podretezec", r.subStr),
    rule("transakce", r.tx),
    rule("regEx", r.regEx),
  ].filter(isNotUndefined);
}

function rule(label: string, value: string | undefined) {
  if (value === undefined || value === "") return undefined;
  return (
    <div>
      <b>{label}:</b> {value}
    </div>
  );
}

function isNotUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
