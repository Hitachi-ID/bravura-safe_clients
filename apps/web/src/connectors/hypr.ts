import { TwoFactorProviderType } from '@bitwarden/common/enums/twoFactorProviderType';
//import { HyprAuthenticationRequestModel } from '@bitwarden/common/models/request/hyprAuthenticationRequestModel';

//import { b64Decode, getQsParam } from "./common";

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", async () => {
  const img = document.getElementById("img");
  const num : number = TwoFactorProviderType.OrganizationHypr;
  img.classList.add('mfaType' + num.toString());
  img.setAttribute('src', '../images/' + num.toString() + '.png');

  /*
  const data = getQsParam("data");
  const jsonData = JSON.parse(b64Decode(data));
  // console.log(jsonData['Signature']);
  // console.log(jsonData['Team']);
  const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
    Signature: jsonData['Signature'],
    Team: jsonData['Team']
  };
  */
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
