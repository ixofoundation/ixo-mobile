## Setup
### Link native modules

```sh
react-native link
```

```sh
$ cd ios
$ rm -rf Pods
$ pod install
```

### Development

```sh
react-native start or yarn run ios_dev ( you might need to cancel the metro bundler and start your own instance using  react-start start)
```

### Production

```sh
yarn run ios_prod (ios)
yarn run android_prod (android)
```

### Android Studio

#### Development
1. Make sure the project builds on from the android folder
2. Might need to do a cache reset (File -> Invalidate caches / restart)
3. Build the project to emulator / android device

#### Build a release version
1. Build -> Select Build Variant

## Native Libraries

* react-native-sensitive-info [https://www.npmjs.com/package/react-native-sensitive-info]
* react-native-camera [https://github.com/react-native-community/react-native-camera]
* react-native-permissions [https://github.com/yonahforst/react-native-permissions]

