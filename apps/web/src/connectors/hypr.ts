import { TwoFactorProviderType } from '@bitwarden/common/enums/twoFactorProviderType';
import { HyprAuthenticationRequestModel } from '@bitwarden/common/models/request/hyprAuthenticationRequestModel';
import { TwoFactorHyprAuthResponse } from '@bitwarden/common/models/response/twoFactorHyprAuthResponse';

import { getQsParam } from "./common";
import { HttpClient, HttpXhrBackend } from '@angular/common/http';

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", async () => {
  const img = document.getElementById("img");
  const num : number = TwoFactorProviderType.OrganizationHypr;
  img.classList.add('mfaType' + num.toString());
  img.setAttribute('src', '../images/' + num.toString() + '.png');

  const team = getQsParam("team");
  const sig = getQsParam("signature");
  // default to true if not provided
  const mobile = getQsParam("mobile") === "false" ? false : true;

  const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
    Signature: sig,
    Team: team,
    MobileBrowser: mobile
  };

  const origin = window.document.location.origin;

  const http: HttpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest()
  }));
  http.post(
    origin + "/api/two-factor/hypr/push-authentication",
    hyprAuthenticationRequestModel
  )
  .subscribe(
    {
      next: (response: TwoFactorHyprAuthResponse) => {
        //console.log(response);
        const concatenatedAuthTx = response.signature + ":" + hyprAuthenticationRequestModel.Signature;
        //console.log("concatenatedAuthTx ", concatenatedAuthTx);
        window.document.getElementById('messagePlaceHolder').innerHTML = "Login succesful<br />Loading...";
        invokeCSCode(concatenatedAuthTx);
      },
      error: (response) => {
        //console.log(response);
        let m: string;
        switch (response.status) {
          case 401:
            m = "Authentication denied";
            break;
          case 400:
          default:
            m = "Failed to authenticate via HYPR";
            break;
        }
        window.document.getElementById('messagePlaceHolder').innerHTML = `${m}<br />[${response.error.message}]`;
        return;
      }
    }
  );
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
