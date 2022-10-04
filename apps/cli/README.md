# Bravura Safe Command-line Interface


The Bravura Safe CLI is a powerful, full-featured command-line interface (CLI) tool to access and manage a Bitwarden vault. The CLI is written with TypeScript and Node.js and can be run on Windows, macOS, and Linux distributions.

![CLI](https://raw.githubusercontent.com/<replace me>/brand/master/screenshots/cli-macos.png "CLI")

## Download/Install

You can install the Bravura Safe CLI multiple different ways:

**NPM**

TBD

**Native Executable**

We provide natively packaged versions of the CLI for each platform which have no requirements on installing the Node.js runtime. You can obtain these from the [downloads section](https://<replace me>/article/cli/#download--install) in the documentation.


## Documentation

The Bravura Safe CLI is self-documented with `--help` content and examples for every command. You should start exploring the CLI by using the global `--help` option:

```bash
bsafe --help
```

This option will list all available commands that you can use with the CLI.

Additionally, you can run the `--help` option on a specific command to learn more about it:

```bash
bsafe list --help
bsafe create --help
```

**Detailed Documentation**

We provide detailed documentation and examples for using the CLI in our help center at https://<replace me>/article/cli/.

## Build/Run

**Requirements**

- [Node.js](https://nodejs.org) v16.13.1.
  - Testing is done against Node 16, other versions may work, but are not guaranteed.
- NPM v8

**Run the app**

```bash
npm install
npm run sub:init # initialize the git submodule for jslib
npm run build:watch
```

You can then run commands from the `./build` folder:

```bash
node ./build/bw.js login
```

## Prettier

We recently migrated to using Prettier as code formatter. All previous branches will need to updated to avoid large merge conflicts using the following steps:

1. Check out your local Branch
2. Run `git merge ec53a16c005e0dd9aef6845c18811e8b14067168`
3. Resolve any merge conflicts, commit.
4. Run `npm run prettier`
5. Commit
6. Run `git merge -Xours 910b4a24e649f21acbf4da5b2d422b121d514bd5`
7. Push

### Git blame

We also recommend that you configure git to ignore the prettier revision using:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```
