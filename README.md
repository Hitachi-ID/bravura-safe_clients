----------------------------------------------------------------

Hitachi ID Bravura Safe is a modified version of Bitwarden®. It was developed using Bitwarden open source software. Hitachi ID Systems, Inc. and Bravura Safe are not affiliated with or endorsed by Bitwarden or Bitwarden, Inc. Bitwarden is a trademark or registered trademark of Bitwarden, Inc. in the United States and/or other countries. 

The original work is available at [https://github.com/bitwarden/server]. 
The original documentation is available at [https://bitwarden.com/help/].
A complete list of all changes is available in the git history of this project.

This project contains the APIs, database, and other core infrastructure items needed for all bitwarden client applications.


#  Client Applications


This repository houses all Bravura Safe client applications except the Mobile application

Please check the readmes for each application under `apps` for instructions on how to build the different applications.

## Related projects:

- [bravura-safe_server] The core infrastructure backend (API, database, Docker, etc).
- [bravura-safe_mobile] The mobile app vault (iOS and Android).
- [bravura-safe_directory-connector] A tool for syncing a directory (AD, LDAP, Azure, G Suite, Okta) to an organization.


## Git blame

We recommend that you configure git to ignore specific revision using:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Migrate PRs from old repositories

We recently migrated from individual client repositories. And some PRs were unfortunately left behind in the old repositories. Luckily it's fairly straightforward to sync them up again. Please follow all the instructions below in order to avoid most merge conflicts.

### Desktop

```
# Merge master
git merge master

# Merge branch mono-repo-prep
git merge 28bc4113b9bbae4dba2b5af14d460764fce79acf

# Verify files are placed in apps/desktop

# Add remote
git remote add clients git@github.com:<replace me>/clients.git

# Merge against clients master
git fetch clients
git merge clients/master

# Push to clients or your own fork
```

### CLI

```
# Merge master
git merge master

# Merge branch mono-repo-prep
git merge 980429f4bdcb178d8d92d8202cbdacfaa45c917e

# Verify files are placed in apps/cli

# Add remote
git remote add clients git@github.com:<replace me>/clients.git

# Merge against clients master
git fetch clients
git merge clients/master

# Push to clients or your own fork
```
