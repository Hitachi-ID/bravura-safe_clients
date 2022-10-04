#!/usr/bin/env bash
. ~/.nvm/nvm.sh

set -e

VERSION="0.2"
echo ""

if [ $# -eq 1 -a "$1" == "help" ]
then
    echo "Version $VERSION"
    echo "Usage: testbuild.sh [command]"
    echo "Without any parameters will call the build steps and generate a docker image."
    echo "========================"
    echo "install     Install the required version of node"
    echo "build       Building only -- npm & docker only"
    echo "push REPO TAG"
    echo "pull REPO TAG"
    echo "tag REPO1 TAG1 REPO2 TAG2"
    echo ""

elif [ $# -eq 1 -a "$1" == "install" ]
then
    echo "Install node version:"
    pushd .
    cd ../../
    nvm install;
    popd

elif [ $# -gt 1 -a "$1" == "tag" ]
then
    REPO1=$2
    TAG1=$3
    REPO2=$4
    TAG2=$5

    echo "Tagging"
    echo "=================="

    docker tag $REPO1/web:$TAG1 $REPO2/web:$TAG2

elif [ $# -gt 1 -a "$1" == "push" ]
then
    REPO=$2
    TAG=$3

    echo "Pushing bravura_vault web ($TAG)"
    echo "========================"

    docker push $REPO/web:$TAG

elif [ $# -gt 1 -a "$1" == "pull" ]
then
    REPO=$2
    TAG=$3

    echo "Pulling bravura_vault web ($TAG)"
    echo "========================"

    docker pull $REPO/web:$TAG
elif [ $# -eq 1 -a "$1" == "build" ]
then
    echo "Building docker and npm only -- open source, selfhosted, production level:"
    npm run build:bravura:selfhost:prod
    docker build -t bravura_vault/web . --label com.hitachi.web.hash="$(git rev-parse HEAD)"
else
    echo "Run build for open source, selfhosted, production level:"
	pushd .
	cd ../../
    nvm use
    npm ci
	popd
    npm run build:bravura:selfhost:prod
    docker build -t bravura_vault/web . --label com.hitachi.web.hash="$(git rev-parse HEAD)"
fi
