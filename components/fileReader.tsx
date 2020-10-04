import * as b from "bobril";

export function FileUpload(p: { onUpload: (content: string) => void }) {
  return (
    <input
      type="file"
      onInput={(event) => {
        const target = event.target.element as HTMLInputElement;
        const fileList = target.files;
        if (fileList && fileList.length) {
          const file = fileList[0];
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            const content = event.target!.result as string;
            p.onUpload(content);
          });
          reader.readAsText(file);
        }
      }}
    />
  );
}
