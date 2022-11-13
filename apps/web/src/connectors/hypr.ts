import { getQsParam } from "./common";

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", () => {
  // nothing needed yet
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
