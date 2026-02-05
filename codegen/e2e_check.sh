#!/bin/bash

bump=""
force="false"

while [[ $# -gt 0 ]] ;
do
    case "$1" in
    -b | --bump)
        bump="$2"
        shift 2
        ;;
    -f | --force)
        force="true"
        shift 1
        ;;
    --help)
        echo "Usage: $0 -b/--bump [patch|minor|major] [-f/--force]"
        echo "  -b/--bump   Version bump to apply. Required only when creating the release PR"
        echo "  -f/--force  Force a release even if the local and published SDK versions match"
        exit 0
        ;;
    *)
        echo "Unknown option: $1"
        exit 1
        ;;
    esac
done

echo "Running with force = $force and bump = $bump"

go build -o codegen/sdk-checks/sdk-check codegen/sdk-checks/main.go
./codegen/sdk-checks/sdk-check check
last_exit_code=$?
echo "last exist code" $last_exit_code

# if you are not forcing a release
# you can exit early if there is an
# error when checking versions (exit code = 1)
# or if no new SDK version has been published (exit code = 0)
if [ $force == "false" ]
then
	# means that versions match or that there was an error
	if [ $last_exit_code -lt 2 ]
	then
		exit $last_exit_code
	fi
fi

# no release was planned exit
if [ -z $bump ]
then
	exit $last_exit_code
fi

# new SDK version available
if [ $last_exit_code -eq 2 ]
then
	rm -rf sdk/
	git clone https://github.com/run-llama/llama-cloud-ts
	mkdir sdk/
	cp -r llama-cloud-ts/src/* sdk/
	rm -rf llama-cloud-ts/
fi

# bump to new version
./codegen/sdk-checks/sdk-check version-bump $bump

# remove go binary
rm -rf ./codegen/sdk-checks/sdk-check
