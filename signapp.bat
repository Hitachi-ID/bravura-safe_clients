@echo off

echo *** 
echo *** make sure signtool.exe is in your path, or run within VS 2022 x64 Command Prompt
echo *** 

IF "%BS_APP_VER%"=="" ( ECHO BS_APP_VER Variable is NOT defined .. exiting
goto :exit
) else (
 ECHO BS_APP_VER Variable is defined: %BS_APP_VER%
)

echo *** 

REM signtool.exe sign /q /f %CERT_KEYPATH% /p %CERT_KEYPASS% /t http://timestamp.digicert.com "Bravura Safe-Portable-2023.11.0.exe"
REM signtool.exe sign /f %CERT_KEYPATH% /p %CERT_KEYPASS% /fd sha256 /tr http://timestamp.digicert.com  /td sha256 /as "Bravura Safe-Portable-2023.11.0.exe"
signtool.exe verify /pa /tw "Bravura Safe-Portable-%BS_APP_VER%.exe"

signtool.exe  sign /a /f %CERT_KEYPATH% /p %CERT_KEYPASS% /fd SHA256  /tr http://timestamp.digicert.com /td sha256 "Bravura Safe-%BS_APP_VER%-x64.appx"
signtool.exe  sign /a /f %CERT_KEYPATH% /p %CERT_KEYPASS% /fd SHA256  /tr http://timestamp.digicert.com /td sha256 "Bravura Safe-%BS_APP_VER%-arm64.appx"
signtool.exe  sign /a /f %CERT_KEYPATH% /p %CERT_KEYPASS% /fd SHA256  /tr http://timestamp.digicert.com /td sha256 "Bravura Safe-%BS_APP_VER%-ia32.appx"


pushd.
cd nsis-web
REM signtool.exe sign /q /f %CERT_KEYPATH% /p %CERT_KEYPASS% /t http://timestamp.digicert.com "Bravura Safe-Installer-2023.11.0.exe"
REM signtool.exe sign /f %CERT_KEYPATH% /p %CERT_KEYPASS% /fd sha256 /tr http://timestamp.digicert.com  /td sha256 /as "Bravura Safe-Installer-2023.11.0.exe"
signtool.exe verify /pa /tw "Bravura Safe-Installer-%BS_APP_VER%.exe"
popd


:exit
echo Exiting script ....