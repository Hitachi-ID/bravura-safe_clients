/* eslint-disable @typescript-eslint/no-var-requires, no-console */

exports.default = async function (configuration) {
  if (parseInt(process.env.ELECTRON_BUILDER_SIGN) === 1 && configuration.path.slice(-4) == ".exe") {
    console.log(`[*] Signing file: ${configuration.path}`);
    require("child_process").execSync(
      `signtool sign /q ` +
        `/f ${process.env.CERT_KEYPATH} ` +
        `/p ${process.env.CERT_KEYPASS} ` +
        `/fd ${configuration.hash} ` +
        `/td ${configuration.hash} ` +
        `-du ${configuration.site} ` +
        `-tr http://timestamp.digicert.com ` +
        `"${configuration.path}"`,
      {
        stdio: "inherit",
      }
    );
  }
};
