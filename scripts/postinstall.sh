#!/bin/bash

echo "Running postinstall.sh, from..."
pwd

servicesdir="../../www/js/services"
testdestdir="../../tests/Services"

if [ -d "$servicesdir" ]; then
		echo "Directory exists!"
    cp js/recentItems.service.js $servicesdir
    cp test/specs/recentItemsService.tests.js $testdestdir
fi
