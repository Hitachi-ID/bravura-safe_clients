import { TwoFactorProviderType } from '@bitwarden/common/enums/twoFactorProviderType';

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("img");
  const num : number = TwoFactorProviderType.OrganizationHypr;
  img.classList.add('mfaType' + num.toString());
  img.setAttribute('src', '../images/' + num.toString() + '.png');
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
