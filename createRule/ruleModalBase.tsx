import * as b from "bobril";
import { BasketPicker } from "../basketPicker";
import { Button } from "../components/button";
import { Modal } from "../components/modal";
import { model } from "../model/model";
import { INormalizedRule, isMatch } from "../model/rule";
import { RecordsTable, recordsTableMaxLimit } from "../recordsTable";

export function RuleModalBase(p: {
  title: string;
  onClose: () => void;
  children?: b.IBobrilChildren;
  createRule: (basket: string[] | null) => INormalizedRule;
}) {
  const [name, setName] = b.useState<string | null>("");
  const basket = name === null ? null : name.trim().split("/");
  const [isBasketPickerOpen, setIsBasketPickerOpen] = b.useState(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = b.useState(false);
  const rule = p.createRule(basket);
  const matchingRecords = model.records.filter((record) =>
    isMatch(record, rule)
  );
  const existingMatches = matchingRecords.filter(
    (record) => model.getRulesForRecord(record).length > 0
  );
  return (
    <>
      <Modal>
        {p.children}
        <b>{p.title}</b>
        <div>Ovlivni {matchingRecords.length} zaznam(y/u)</div>
        {existingMatches.length > 0 && (
          <div style={{ color: "red" }}>
            Z toho {existingMatches.length} uz je v nejakem kosiku!
          </div>
        )}
        <div>
          <Button
            text={
              matchingRecords.length > recordsTableMaxLimit
                ? `Ukaz prvnich ${recordsTableMaxLimit}!`
                : "Ukaz!"
            }
            onClick={() => setIsRecordsModalOpen(true)}
          />
        </div>
        <div>
          Do kosiku: <input type="text" value={name} onChange={setName}></input>
          <Button text="Vybrat" onClick={() => setIsBasketPickerOpen(true)} />
          {name === null ? (
            <span style={{ color: "red" }}>Ignorovano</span>
          ) : (
            <Button text="Ignorovat" onClick={() => setName(null)} />
          )}
        </div>
        <Button
          text="Ok"
          disabled={name?.trim() === ""}
          onClick={() => {
            model.rules.push(rule);
            model.store();
            p.onClose();
          }}
        />
        <Button
          text="Cancel"
          onClick={() => {
            p.onClose();
          }}
        />
      </Modal>
      {isBasketPickerOpen && (
        <BasketPicker
          onCancel={() => setIsBasketPickerOpen(false)}
          onSubmit={(basket) => {
            setIsBasketPickerOpen(false);
            setName(basket.join("/"));
          }}
        />
      )}
      {isRecordsModalOpen && (
        <Modal>
          <RecordsTable
            records={matchingRecords}
            showBasketsColumn={existingMatches.length > 0}
          />
          <Button text="Zavrit" onClick={() => setIsRecordsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
}
