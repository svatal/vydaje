import * as b from "bobril";
import { FileUpload } from "./components/fileReader";
import { IData, model } from "./model/model";
import { parse } from "papaparse";
import * as r from "./model/record";
import { Button } from "./components/button";
import { leftPad2, parseAndFixDate } from "./util";

export function Settings() {
  return (
    <>
      <div>
        Nové záznamy (CSV): <FileUpload onUpload={replaceRecordsFromCSV} />
      </div>
      <div>
        Nahrát zálohu: <FileUpload onUpload={replaceAll} />
      </div>
      <div>
        Uložit zálohu: <Button text="Stáhnout" onClick={downloadAll}></Button>
      </div>
    </>
  );
}

function replaceRecordsFromCSV(input: string) {
  const parsed = parse<string[]>(input, {
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    alert(
      "Problém s CSV: \n" +
        parsed.errors.reduce((c, e) => `${c}${e.message}`, "")
    );
  }
  try {
    const rawData = parsed.data.slice(1);
    const records = r.toRecords(rawData);
    model.records = records;
    model.store();
  } catch (e) {
    console.error("Chyba při parsování csv", e);
    alert("Neočekávaný format.");
  }
}

function replaceAll(input: string): void {
  const data = parseAndFixDate<IData>(input);
  if (!data || !data.records || !data.rules || !data.transferRules) {
    console.log(data);
    alert("Neočekávaný format.");
    return;
  }
  model.load(data);
}

function downloadAll() {
  const data: IData = {
    records: model.records,
    rules: model.rules,
    transferRules: model.transferRules,
  };
  const strData = JSON.stringify(data);
  const date = new Date();
  const fileName = `vydaje-${date.getFullYear()}-${leftPad2(
    date.getMonth() + 1
  )}-${leftPad2(date.getDate())}`;
  const file = new File([strData], fileName, { type: "text/json" });
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.click();
}
