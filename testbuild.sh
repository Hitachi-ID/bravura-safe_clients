#!/usr/bin/env bash
set -e

VERSION="0.2"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""

if [ $# -eq 0 ]
then
   echo "No command line arguments specified"

elif [ $# -eq 1 -a "$1" == "help" ]
then
    echo "Version $VERSION"
    echo "Usage: testbuild.sh build [target]"
    echo "Without any parameters will do nothing."
    echo "========================"
	
    echo "for MAC version info search CURRENT_PROJECT_VERSION in pbxproj"
    echo "and also set buildVersion in exlectron-builder.json"

elif [ $# -gt 1 -a "$1" == "build" ]
then
    PROJECT=$2

    echo "Building single target $2"
    echo "=================="

      case "$PROJECT" in
        "safari")
            pushd .

		npm install
		# npm audit fix
		npm run prepare

		cd apps
		cd browser

		npm run build:prod
		npm run dist:safari:mas

        echo "================== copying plugins ================="
        # now copy appex to the PlugIns and PlugIns_mas folder within apps/desktop
        rm -rf ../desktop/PlugIns_mas
        mkdir -p ../desktop/PlugIns_mas
        cp -r -f dist/Safari/mas/build/Release/safari.appex ../desktop/PlugIns_mas/safari.appex
        cp -r -f dist/Safari/mas/safari/safari.entitlements ../desktop/PlugIns_mas/safari.entitlements
        pushd .
        cd ../desktop/PlugIns_mas
        echo "================== signing Plugins_mas ================="
        codesign --remove-signature safari.appex
        codesign -s "Developer ID Application" -f --timestamp -o runtime --entitlements safari.entitlements safari.appex
        codesign -s "Apple Distribution" -f --timestamp -o runtime --entitlements safari.entitlements safari.appex
        popd
        
        rm -rf ../desktop/PlugIns
        mkdir -p ../desktop/PlugIns
        cp -r -f dist/Safari/mas/build/Release/safari.appex ../desktop/PlugIns/safari.appex
        cp -r -f dist/Safari/mas/safari/safari.entitlements ../desktop/PlugIns/safari.entitlements
        pushd .
        cd ../desktop/PlugIns
        echo "================== signing Plugins ================="
        codesign --remove-signature safari.appex
        codesign -s "Developer ID Application" -f --timestamp -o runtime --entitlements safari.entitlements safari.appex
        popd
        echo "==================  appex prep completed ================="
        
        # final pop of the dir to get back to root
            popd
        ;;
		
        "desktop_mac")
		
        echo "============ Make sure you have built safari plugins first ==========="
            pushd .

        npm install

        cd apps/desktop
        npm run clean:dist

            popd

        echo "build the native portion of the mac desktop app"
        pushd .
        cd apps/desktop/desktop_native
        npm run build:cross-platform
        popd
		
        pushd .
        cd apps/desktop
        npm run dist:mac:mas
        # next line is to notarize, but for upload to store with transporter, no need to notarize, just upload .pkg
        # npm run publish:mac
        popd

        ;;

        "browser")
            pushd .

		npm install
		# npm audit fix
		npm run prepare

		cd apps
		cd browser

		npm run build:prod
		npm run dist

            popd
        ;;

        "firefox")
            pushd .

		npm install
		# npm audit fix
		npm run prepare

		cd apps
		cd browser

		npm run dist:firefox

            popd
        ;;

	"web")
	    echo "building web"

	    pushd .
            cd apps/web
            ./testbuild.sh
            popd
	;;

        *)
		echo "Invalid build target specified"
        ;;
    esac
fi
