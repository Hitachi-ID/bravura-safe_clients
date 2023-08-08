@echo OFF
ECHO ...
ECHO if signing, this script must be run from a VS command prompt
ECHO Example: call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
ECHO set ELECTRON_BUILDER_SIGN=1 in order to sign binaries during build
echo make sure env vars CERT_KEYPASS and CERT_KEYPATH are set correctly and globally
echo if signing don't forget to set BS_APP_VER=2023.12.0 for example 
ECHO ...
pause

REM install node packages
call npm install

pushd .
cd apps/desktop
call npm run clean:dist
popd


REM build the native portion of the desktop app
pushd .
cd apps/desktop/desktop_native
call npm run build
popd

REM build the dist version

pushd .
cd apps/desktop
call npm run publish:win
popd

REM ECHO ON
ECHO ...
ECHO this part must be run from a VS command prompt
ECHO ...
pause
REM call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
pushd .
cd apps/desktop/dist
echo this is where the env var BS_APP_VER will be needed (ie next batch file)
ECHO ...
copy ..\..\..\signapp.bat
call signapp.bat

popd