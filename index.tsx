import * as b from "bobril";
import { model } from "./model/model";
import { Showcase } from "./showcase";
import { Rules } from "./rules";
import { Records } from "./records";
import { TransferRules } from "./transferRules";
import { Button } from "./components/button";
import { VerticalLayout } from "./components/verticalLayout";
import { LocalStorage } from "./storage";
import { Settings } from "./settings";

model.load(LocalStorage.get());
model.storage = LocalStorage;

b.injectCss("html, body { height: 100%; margin:0 }");

function main(data: b.IRouteHandlerData) {
  return (
    <VerticalLayout>
      <>
        <Button text={"Prohlizeni"} route="showcase" />
        <Button text={"Zaznamy"} route="records" />
        <Button text={"Pravidla"} route="rules" />
        <Button text={"Extra prevody (cash)"} route="transferRules" />
        <Button text={"Nastaveni"} route="settings" />
      </>
      <>{data.activeRouteHandler()}</>
    </VerticalLayout>
  );
}

b.routes(
  b.route({ handler: main }, [
    b.route({
      handler: () => <Showcase />,
      name: "showcase",
      url: "/showcase",
    }),
    b.route({ handler: () => <Records />, name: "records", url: "/records" }),
    b.route({
      handler: () => <TransferRules />,
      name: "transferRules",
      url: "/transferRules",
    }),
    b.route({ handler: () => <Rules />, name: "rules", url: "/rules" }),
    b.route({
      handler: () => <Settings />,
      name: "settings",
      url: "/settings",
    }),
    b.routeDefault({ handler: () => <Showcase /> }),
  ])
);
