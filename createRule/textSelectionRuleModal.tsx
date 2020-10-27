import * as b from "bobril";
import { IRecord } from "../model/record";
import { RuleModalBase } from "./ruleModalBase";

export function TextSelectionRuleModal(p: {
  onClose: () => void;
  record: IRecord;
  textSelection: string;
}) {
  return (
    <RuleModalBase
      title={`Text obsahujici '${p.textSelection}'`}
      onClose={p.onClose}
      createRule={(basket) => ({ bskt: basket, subStr: p.textSelection })}
    />
  );
}
