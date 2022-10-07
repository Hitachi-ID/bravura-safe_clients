----------------------------------------------------------------

Bravura Safe is a modified version of Bitwarden®. It was developed using Bitwarden open source software. Bravura Security, Inc. and Bravura Safe are not affiliated with or endorsed by Bitwarden or Bitwarden, Inc. Bitwarden is a trademark or registered trademark of Bitwarden, Inc. in the United States and/or other countries. 

The original work is available at [https://github.com/bitwarden/server]. 
The original documentation is available at [https://bitwarden.com/help/].
A complete list of all changes is available in the git history of this project.

This project contains the APIs, database, and other core infrastructure items needed for all bitwarden client applications.


#  Browser Extension

<a href="https://chrome.google.com/webstore/detail/<replace me>/cjidmfgdjckibjdfnglfdgohkaballnn" target="_blank"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
<a href="https://addons.mozilla.org/firefox/addon/<replace me>/" target="_blank"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/<replace me>/jbkfoedolllekgbhcbcoahefnbanhhlh" target="_blank"><img src="https://imgur.com/vMcaXaw.png" width="64" height="64"></a>
<a href="https://addons.opera.com/extensions/details/<replace me>/" target="_blank"><img src="https://imgur.com/nSJ9htU.png" width="64" height="64"></a>
<a href="https://<replace me>/download/" target="_blank"><img src="https://imgur.com/ENbaWUu.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/<replace me>/cjidmfgdjckibjdfnglfdgohkaballnn" target="_blank"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/<replace me>/cjidmfgdjckibjdfnglfdgohkaballnn" target="_blank"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>
<a href="https://addons.mozilla.org/firefox/addon/<replace me>/" target="_blank"><img src="https://imgur.com/MQYBSrD.png" width="64" height="64"></a>

The browser extension is written using the Web Extension API and Angular.

# Build/Run

**Requirements**

- [Node.js](https://nodejs.org) v16.13.1 or greater
- NPM v8
- [Gulp](https://gulpjs.com/) (`npm install --global gulp-cli`)
- Chrome (preferred), Opera, or Firefox browser

**Run the app**

```
npm install
npm run build:watch
```

You can now load the extension into your browser through the browser's extension tools page:

- Chrome/Opera:
  1. Type `chrome://extensions` in your address bar to bring up the extensions page.
  2. Enable developer mode (toggle switch)
  3. Click the "Load unpacked extension" button, navigate to the `build` folder of your local extension instance, and click "Ok".
- Firefox
  1. Type `about:debugging` in your address bar to bring up the add-ons page.
  2. Click the `Load Temporary Add-on` button, navigate to the `build/manifest.json` file, and "Open".

**Desktop communication**

Native Messaging (communication between the desktop application and browser extension) works by having the browser start a lightweight proxy baked into our desktop application.

Out of the box, the desktop application can only communicate with the production browser extension. When you enable browser integration in the desktop application, the application generates manifests which contain the production IDs of the browser extensions. To enable communication between the desktop application and development versions of browser extensions, add the development IDs to the `allowed_extensions` section of the corresponding manifests.

Manifests are located in the `browser` subdirectory of the Bitwarden configuration directory. For instance, on Windows the manifests are located at `C:\Users\<user>\AppData\Roaming\Bitwarden\browsers` and on macOS these are in `Application Support` for various browsers ([for example](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#manifest_location)). Note that disabling the desktop integration will delete the manifests, and the files will need to be updated again.

## Prettier

We recently migrated to using Prettier as code formatter. All previous branches will need to updated to avoid large merge conflicts using the following steps:

1. Check out your local Branch
2. Run `git merge cebee8aa81b87cc26157e5bd0f879db254db9319`
3. Resolve any merge conflicts, commit.
4. Run `npm run prettier`
5. Commit
6. Run `git merge -Xours 8fe821b9a3f9728bcb02d607ca75add468d380c1`
7. Push

### Git blame

We also recommend that you configure git to ignore the prettier revision using:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```
