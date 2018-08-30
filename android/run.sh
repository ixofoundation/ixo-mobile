#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.ixo.world.mobile/host.exp.exponent.MainActivity
