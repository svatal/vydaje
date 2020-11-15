import * as b from "bobril";
import { BasketPicker } from "../basketPicker";
import { Button } from "../components/button";
import { Modal } from "../components/modal";
import { model } from "../model/model";
import { INormalizedRule } from "../model/rule";
import { RuleDescription } from "../rules";

export function ChangeBasketModal(p: {
  onClose: () => void;
  rule: INormalizedRule;
}) {
  const [name, setName] = b.useState(p.rule.bskt!.join("/"));
  const basket = name.trim().split("/");
  const [isBasketPickerOpen, setIsBasketPickerOpen] = b.useState(false);

  return (
    <>
      <Modal>
        <b>Pravidlo:</b>
        <div>{RuleDescription(p.rule)}</div>
        <div>
          Presunout do kosiku:{" "}
          <input type="text" value={name} onChange={setName}></input>
          <Button text="Vybrat" onClick={() => setIsBasketPickerOpen(true)} />
        </div>
        <Button
          text="Ok"
          disabled={!name}
          onClick={() => {
            p.rule.bskt = basket;
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
