#!/bin/bash

./gradlew ${1:-installDevDebug} --stacktrace && adb shell am start -n com.ixo-world.ixo-world-mobile/host.exp.exponent.MainActivity
