import { TwoFactorProviderType } from '@bitwarden/common/enums/twoFactorProviderType';
import { HyprAuthenticationRequestModel } from '@bitwarden/common/models/request/hyprAuthenticationRequestModel';
import { TwoFactorHyprAuthResponse } from '@bitwarden/common/models/response/two-factor-hypr-auth.response';

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
        let gotError: boolean = true;
        let m: string;
        switch (response.status) {
          case 200:
            if (!response.signature) {
              m = "Failed to authenticate [no token]";
              break;
            }
            // no errors, break to continue with the login sequence
            gotError = false
            break;
          case 401:
            m = "Authentication denied";
            break;
          case 400:
            if (response.errorCode &&
              (response.errorCode === 1202024 || response.errorCode === 1202002)
            ) {
              m = "HYPR account not found and/or device needs to be registered";
              if (button) button.removeAttribute('hidden');
              break;
            }
          default:
            m = "Failed to authenticate via HYPR";
            break;
        }
        if (gotError) {
          window.document.getElementById('messagePlaceHolder').innerHTML = `${m}<br />[${response.message}]`;
          return;
        }
        const concatenatedAuthTx = response.signature + ":" + hyprAuthenticationRequestModel.Signature;
        //console.log("concatenatedAuthTx ", concatenatedAuthTx);
        window.document.getElementById('messagePlaceHolder').innerHTML = "Login succesful<br />Loading...";
        invokeCSCode(concatenatedAuthTx);
      },
      error: (response: any) => {
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

  const button = document.getElementById('hyprEmailRegistration');

  if (button) {
    button.addEventListener('click', async () => {/*
      const team = getQsParam("team");
      const sig = getQsParam("signature");
      const mobile = getQsParam("mobile") === "false" ? false : true;
      const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
        Signature: sig,
        Team: team,
        MobileBrowser: mobile
      };
      const origin = window.document.location.origin;
      const httpClient: HttpClient = new HttpClient(new HttpXhrBackend({ 
        build: () => new XMLHttpRequest()
      }));
      httpClient.post(
        origin + "/api/two-factor/hypr/mail-registration",
        hyprAuthenticationRequestModel
      )
      .subscribe(
        {
          next:(response: any) => {
            //console.log(response);
            const button = window.document.getElementById('hyprEmailRegistration');
            button.setAttribute('hidden', '');
            const p = window.document.createElement('p');
            p.innerText = 'Registration email sent';
            button.after(p);
          },
          error: (response: any) => {
            console.log(response);
          }
        }
      );*/
    });
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
