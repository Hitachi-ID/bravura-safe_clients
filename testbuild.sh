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
		npm run dist:safari

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
