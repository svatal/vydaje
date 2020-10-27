import * as b from "bobril";
import { IRecord } from "../model/record";
import { RuleModalBase } from "./ruleModalBase";

export function TargetAccountRuleModal(p: {
  onClose: () => void;
  record: IRecord;
}) {
  const acc = `${p.record.targetAccount}/${p.record.targetBank}`;
  return (
    <RuleModalBase
      title={`S protiuctem '${acc}'`}
      onClose={p.onClose}
      createRule={(basket) => ({ bskt: basket, acc: acc })}
    />
  );
}
