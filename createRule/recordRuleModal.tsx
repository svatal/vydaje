import * as b from "bobril";
import { BasketPicker } from "../basketPicker";
import { Button } from "../components/button";
import { Modal } from "../components/modal";
import { model } from "../model/model";
import { IRecord } from "../model/record";
import { getTx } from "../model/rule";

export function RecordRuleModal(p: { onClose: () => void; record: IRecord }) {
  const [name, setName] = b.useState("");
  const [isBasketPickerOpen, setIsBasketPickerOpen] = b.useState(false);

  return (
    <>
      <Modal>
        <div>
          Kosik: <input type="text" value={name} onChange={setName}></input>
          <Button text="Vybrat" onClick={() => setIsBasketPickerOpen(true)} />
        </div>
        <Button
          text="Ok"
          onClick={() => {
            model.rules.push({
              bskt: name.trim().split("/"),
              tx: getTx(p.record),
            });
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
    </>
  );
}
