import * as b from "bobril";
import { Button } from "./components/button";
import { Modal } from "./components/modal";
import { IBasket, model } from "./model/model";

export function BasketPicker(p: {
  onSubmit: (basket: string[]) => void;
  onCancel: () => void;
}) {
  const [selectedBasket, selectBasket] = b.useState<string[] | undefined>(
    undefined
  );
  return (
    <Modal>
      Vyber kosik
      <div>
        {renderTree(model.basketTree, selectedBasket || [], [], selectBasket)}
      </div>
      <Button
        disabled={!selectedBasket}
        text="OK"
        onClick={() => selectedBasket && p.onSubmit(selectedBasket)}
      />
      <Button text="Cancel" onClick={() => p.onCancel()} />
    </Modal>
  );
}

function renderTree(
  basket: IBasket,
  selectedBasket: string[],
  currentBasket: string[],
  selectBasket: (basket: string[]) => void
) {
  if (
    selectedBasket.length < currentBasket.length ||
    (currentBasket.length &&
      currentBasket[currentBasket.length - 1] !=
        selectedBasket[currentBasket.length - 1])
  )
    return undefined;
  const childrenNames = Object.keys(basket.children);
  return (
    <ul>
      {childrenNames.map((name) => (
        <li>
          <span
            style={{
              cursor: "pointer",
              background:
                selectedBasket.length === currentBasket.length + 1 &&
                selectedBasket[currentBasket.length] === name
                  ? "lightgray"
                  : undefined,
            }}
            onClick={() => selectBasket([...currentBasket, name])}
          >
            {name}
          </span>
          {renderTree(
            basket.children[name],
            selectedBasket,
            [...currentBasket, name],
            selectBasket
          )}
        </li>
      ))}
    </ul>
  );
}
