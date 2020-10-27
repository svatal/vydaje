import * as b from "bobril";
import { IRecord } from "../model/record";
import { getTx } from "../model/rule";
import { RuleModalBase } from "./ruleModalBase";

export function RecordRuleModal(p: { onClose: () => void; record: IRecord }) {
  return (
    <RuleModalBase
      title="Tento zaznam"
      onClose={p.onClose}
      createRule={(basket) => ({ bskt: basket, tx: getTx(p.record) })}
    />
  );
}
