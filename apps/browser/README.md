----------------------------------------------------------------

Bravura Safe is a modified version of Bitwarden�. It was developed using Bitwarden open source software. Bravura Security, Inc. and Bravura Safe are not affiliated with or endorsed by Bitwarden or Bitwarden, Inc. Bitwarden is a trademark or registered trademark of Bitwarden, Inc. in the United States and/or other countries. 

The original work is available at [https://github.com/bitwarden/server]. 
The original documentation is available at [https://bitwarden.com/help/].
A complete list of all changes is available in the git history of this project.

This project contains the APIs, database, and other core infrastructure items needed for all bitwarden client applications.


#  Browser Extension


The browser extension is written using the Web Extension API and Angular.

# Build/Run

**Requirements**

- [Node.js](https://nodejs.org) v16.13.1
- NPM v8
- [Gulp](https://gulpjs.com/) (`npm install --global gulp-cli`)
- [NVM](https://github.com/nvm-sh/nvm) (`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`)

**Build the app**

Make sure Node.JS v16.13.1 is installed
Make sure NVM is installed correctly

nvm install v16.13.1 #(once only) 
nvm use v16.13.1 
npm install -g npm@8.1.2 #(optional, if nvm didn't set it!) 

navigate to root of "clients" folder ex: ~/projects/clients and run testbuild.sh as shown below

```
./testbuild.sh build firefox
```

the output file is placed in : ~/projects_ubuntu/clients/apps/browser/dist
filename: dist-firefox.zip