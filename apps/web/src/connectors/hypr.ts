import { TwoFactorProviderType } from '@bitwarden/common/enums/twoFactorProviderType';

require("./hypr.scss");

document.addEventListener("DOMContentLoaded", () => {
});

function invokeCSCode(data: string) {
  try {
    (window as any).invokeCSharpAction(data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
