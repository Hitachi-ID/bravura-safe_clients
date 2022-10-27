//import * as HyprWebSDK from "hypr_web_sdk";

import { getQsParam } from "./common";

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", () => {
  const frameElement = document.createElement("iframe");
  frameElement.setAttribute("id", "hypr_iframe");
  setFrameHeight();
  document.body.appendChild(frameElement);

  const hostParam = getQsParam("host");
  const requestParam = getQsParam("request");

  const hostUrl = new URL("https://" + hostParam);
  if (
    !hostUrl.hostname.endsWith(".hypr.com")
  ) {
    return;
  }

  /*HyprWebSDK.init({
    iframe: "hypr_iframe",
    host: hostParam,
    sig_request: requestParam,
    submit_callback: (form: any) => {
      invokeCSCode(form.elements.sig_response.value);
    },
  });*/

  window.onresize = setFrameHeight;

  function setFrameHeight() {
    frameElement.style.height = window.innerHeight + "px";
  }
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
