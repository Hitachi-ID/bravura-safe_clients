/* eslint-disable @typescript-eslint/no-var-requires, no-console */
require("dotenv").config();
const path = require("path");

const { notarize } = require("@electron/notarize");
const { deepAssign } = require("builder-util");
const fse = require("fs-extra");

exports.default = run;

async function run(context) {
  console.log("## After sign");
  // console.log(context);

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${context.appOutDir}/${appName}.app`;
  const macBuild = context.electronPlatformName === "darwin";
  const copyPlugIn = ["darwin", "mas"].includes(context.electronPlatformName);

  console.log("### Copy safari plugin value: " + copyPlugIn);

  if (copyPlugIn) {
    // Copy Safari plugin to work-around https://github.com/electron-userland/electron-builder/issues/5552
    let plugIn = path.join(__dirname, "../PlugIns");
    if (context.electronPlatformName === "mas") {
      plugIn = path.join(__dirname, "../PlugIns_mas");
    }

    console.log("### Copy safari plugin " + plugIn);
    if (fse.existsSync(plugIn)) {
      fse.mkdirSync(path.join(appPath, "Contents/PlugIns"));
      fse.copySync(
        path.join(plugIn, "safari.appex"),
        path.join(appPath, "Contents/PlugIns/safari.appex")
      );

      console.log("### Finished: Copy safari plugin " + plugIn);

      // Resign to sign safari extension
      if (context.electronPlatformName === "mas") {
        console.log("// Resign to sign safari extension")
        const masBuildOptions = deepAssign(
          {},
          context.packager.platformSpecificBuildOptions,
          context.packager.config.mas
        );
        if (context.targets.some((e) => e.name === "mas-dev")) {
          deepAssign(masBuildOptions, {
            type: "development",
          });
        }
        if (context.packager.packagerOptions.prepackaged == null) {
          await context.packager.sign(appPath, context.appOutDir, masBuildOptions, context.arch);
        }
      } else {
        await context.packager.signApp(context, true);
      }
    }
  }

  const appleId = process.env.APPLE_ID_USERNAME || process.env.APPLEID;
  if (macBuild && appleId) {
    console.log("### Notarizing " + appPath);
    // const appleId = process.env.APPLE_ID_USERNAME || process.env.APPLEID;
    const appleIdPassword = process.env.APPLE_ID_PASSWORD || `@keychain:AC_PASSWORD`;

    console.log("### Notarizing *** *** apple ID *** " + appleId);
    console.log("### Notarizing *** remember to use app specific password for this apple ID **** ");
    return await notarize({
      appBundleId: "com.hitachiid.desktop",
      appPath: appPath,
      appleId: appleId,
      appleIdPassword: appleIdPassword,
    });
  }
  else {
    console.log("__**__");
    console.log("__**__ Notarizing skipped ***  not a macbuild or env vars ( APPLE_ID_USERNAME or APPLEID ) not set *** *** ");
    console.log("__**__");
  }
}
