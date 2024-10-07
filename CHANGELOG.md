# Node.js for Mobile Apps React Native plugin ChangeLog

<table>
<tr>
<th>Current</th>
</tr>
<tr>
<td>
<a href="#18.20.4">18.20.4</a><br/>
<a href="#18.17.8">18.17.8</a><br/>
<a href="#18.17.7">18.17.7</a><br/>
<a href="#18.17.6">18.17.6</a><br/>
<a href="#18.17.5">18.17.5</a><br/>
<a href="#18.17.4">18.17.4</a><br/>
<a href="#18.17.3">18.17.3</a><br/>
<a href="#18.17.2">18.17.2</a><br/>
<a href="#18.17.1">18.17.1</a><br/>
<a href="#16.17.10">16.17.10</a><br/>
<a href="#16.17.9">16.17.9</a><br/>
<a href="#16.17.8">16.17.8</a><br/>
<a href="#16.17.7">16.17.7</a><br/>
<a href="#16.17.6">16.17.6</a><br/>
<a href="#16.17.5">16.17.5</a><br/>
<a href="#16.17.4">16.17.4</a><br/>
<a href="#16.17.3">16.17.3</a><br/>
<a href="#16.17.2">16.17.2</a><br/>
<a href="#16.17.1">16.17.1</a><br/>
<a href="#16.17.0">16.17.0</a><br/>
<a href="#0.8.2">0.8.2</a><br/>
<a href="#0.8.1">0.8.1</a><br/>
<a href="#0.8.0">0.8.0</a><br/>
<a href="#0.7.0">0.7.0</a><br/>
<a href="#0.6.4">0.6.4</a><br/>
<a href="#0.6.3">0.6.3</a><br/>
<a href="#0.6.2">0.6.2</a><br/>
<a href="#0.6.1">0.6.1</a><br/>
<a href="#0.6.0">0.6.0</a><br/>
<a href="#0.5.0">0.5.0</a><br/>
<a href="#0.4.3">0.4.3</a><br/>
<a href="#0.4.2">0.4.2</a><br/>
<a href="#0.4.1">0.4.1</a><br/>
<a href="#0.4.0">0.4.0</a><br/>
<a href="#0.3.4">0.3.4</a><br/>
<a href="#0.3.3">0.3.3</a><br/>
<a href="#0.3.2">0.3.2</a><br/>
<a href="#0.3.1">0.3.1</a><br/>
<a href="#0.3.0">0.3.0</a><br/>
<a href="#0.2.1">0.2.1</a><br/>
<a href="#0.2.0">0.2.0</a><br/>
<a href="#0.1.4">0.1.4</a><br/>
<a href="#0.1.3">0.1.3</a><br/>
<a href="#0.1.2">0.1.2</a><br/>
<a href="#0.1.1">0.1.1</a><br/>
</td>
</tr>
</table>

<a id="18.20.4"></a>
## 2024-10-07, Version 18.20.4 (Current)

### Notable Changes

* Update `nodejs-mobile` binaries to `v18.20.4`


<a id="18.17.8"></a>
## 2024-08-21, Version 18.17.8

### Notable Changes

* android: use mavenCentral in gradle dependencies


<a id="18.17.7"></a>
## 2024-02-21, Version 18.17.7

### Notable Changes

* plugin: update nodejs-mobile-gyp


<a id="18.17.6"></a>
## 2024-01-23, Version 18.17.6

### Notable Changes

* ios: support React Native 0.73


<a id="18.17.5"></a>
## 2024-01-22, Version 18.17.5

### Notable Changes

* ios: fix react-native config warning upon install


<a id="18.17.4"></a>
## 2023-12-12, Version 18.17.4

### Notable Changes

* ios: set native addon iOS MinimumOSVersion to 13


<a id="18.17.3"></a>
## 2023-10-17, Version 18.17.3

### Notable Changes

* ios: support compiling or prebuilding for iOS simulator


<a id="18.17.2"></a>
## 2023-10-16, Version 18.17.2

### Notable Changes

* android: support native addons that need `ranlib` from the NDK


<a id="18.17.1"></a>
## 2023-10-16, Version 18.17.1

### Notable Changes

* Update `nodejs-mobile` binaries to `v18.17.1`
* (Host) Node.js version 16 required when building native modules on Android and iOS
* iOS >=13.0 required as deployment target
* Android >=7.0 (SDK 24) required as `minSdkVersion`
* Android NDK 24 or higher required when building native modules


<a id="16.17.10"></a>
## 2023-03-23, Version 16.17.10

### Notable Changes

* ios: fix bash mistake in build native mods script


<a id="16.17.9"></a>
## 2023-03-17, Version 16.17.9

### Notable Changes

* ios: hotfix for mistake in 16.17.8


<a id="16.17.8"></a>
## 2023-03-17, Version 16.17.8

### Notable Changes

* plugin: support prebuilt native modules and skip their compilation


<a id="16.17.7"></a>
## 2023-03-15, Version 16.17.7

### Notable Changes

* ios: improve Xcode scripts, less verbose outputs


<a id="16.17.6"></a>
## 2023-03-06, Version 16.17.6

### Notable Changes

* android: require NDK 24.x or higher


<a id="16.17.5"></a>
## 2023-02-21, Version 16.17.5

### Notable Changes

* ios: update nodejs-mobile to 16.17.1, support iOS Simulators on x86_64 hosts
* plugin: ignore large binaries from git but not from npm


<a id="16.17.4"></a>
## 2023-02-13, Version 16.17.4

### Notable Changes

* plugin: fix Android scripts finding node-gyp-build-mobile


<a id="16.17.3"></a>
## 2023-02-07, Version 16.17.3

### Notable Changes

* plugin: change iOS plisttemplate with min iOS 11.0


<a id="16.17.2"></a>
## 2023-02-07, Version 16.17.2

### Notable Changes

* plugin: node_modules patcher ignores malformed package.json files


<a id="16.17.1"></a>
## 2023-02-06, Version 16.17.1

### Notable Changes

* plugin: fix iOS scripts discovering the path to node-mobile-gyp
* plugin: add more debug info when built iOS frameworks are wrong


<a id="16.17.0"></a>
## 2023-01-30, Version 16.17.0

### Notable Changes

* Update `nodejs-mobile` binaries to `v16.17.0`
* (Host) Node.js version 16 required when building native modules on Android and iOS


<a id="0.8.2"></a>
## 2022-09-06, Version 0.8.2

### Commits

* [[`2fa781d`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/2fa781d836aa794c6b3809db58bdf0f417859f01)] - plugin: support react-native 0.69 on Android
* [[`c1e15d4`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/c1e15d40d19d3e356cc8dc3f1d1013f71214c3a5)] - Fix podspec source specification


<a id="0.8.1"></a>
## 2022-05-19, Version 0.8.1

### Commits

* [[`c2df7c5`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/c2df7c50119614cc8f4535b285cd27c457c80b1d)] - android: Get ndkVersion from main projects' gradle config


<a id="0.8.0"></a>
## 2022-03-16, Version 0.8.0

### Notable Changes

* New JS API `startWithArgs(command[, options])`

### Commits

* [[`2edd052`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/2edd052e7a007edc917ee44b5130b24fda62a40e)] - plugin: new JS API startWithArgs() (@siepra)


<a id="0.7.0"></a>
## 2022-02-01, Version 0.7.0

### Notable Changes

* Support Android Gradle plugin version 4

### Commits

* [[`9f0300d`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/9f0300ddbf4de9c34e6f2ddb05200f9d37fcc374)] - android: support Android Gradle plugin v4 (gmaclennan)


<a id="0.6.4"></a>
## 2021-12-16, Version 0.6.4

### Notable Changes

* Support using patch-package on packages with symlinks

### Commits

* [[`934c4f7`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/934c4f7558f8cfac9b0f96298c4d3f68d4ef7572)] - plugin: use lstatSync instead of statSync (Jpoliachik)


<a id="0.6.3"></a>
## 2021-10-26, Version 0.6.3

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.3.3`, which fixes a crash on Android 11 related to network interfaces
* Support React Native 0.64.x and above

### Commits

* [[`91206f4`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/91206f4c0675907798b48394dc375482fd62f600)] - core: update nodejs-mobile v0.3.3 (Andre Staltz)
* [[`8d2cb35`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/8d2cb350e6267b4c15a66e4f6ab35b9507616ed2)] - android: use prebuilt toolchain for native modules (Gregor MacLennan)
* [[`2b57062`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/2b5706234e8a7a8e70857193c542d8ffcb641c7c)] - plugin: support react-native 0.64 (Andre Staltz)
* [[`1366db0`](https://github.com/nodejs-mobile/nodejs-mobile-react-native/commit/1366db07162798552e1fba3fe3168cf61a365749)] - plugin: update repo metadata for new org (Andre Staltz)

<a id="0.6.2"></a>
## 2020-11-02, Version 0.6.2

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.3.2`, which updates the engine to `v12.19.0` LTS.
* Support Rust neon-bindings for native modules on iOS.

### Commits

* [[`b8b7d60`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/b8b7d60be696d633f0b6e1ab34e36737309451a0)] - core: update nodejs-mobile v0.3.2 (Jaime Bernardo)
* [[`7e40004`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7e4000466c93b2f053e2922e589de5bb4a5dac9d)] - ios: support neon-bindings (Rust) native modules (Andre Staltz)

<a id="0.6.1"></a>
## 2020-05-25, Version 0.6.1

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.3.1`, which updates the engine to `v12.16.3` LTS.

### Commits

* [[`bfe78e7`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/bfe78e7c0a503193d9075e9809ebb17c33832e14)] - core: update nodejs-mobile v0.3.1 (Jaime Bernardo)
* [[`736900c`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/736900c18c0cf69023180fc3964dde09ad35b4e0)] - android: build reproducible dir and file lists (Corey)
* [[`b2d3fe9`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/b2d3fe943d8bc90f13542eeef9a9290c8b432ae1)] - doc: add mention to iOS 11.0 or later support (Jaime Bernardo)

<a id="0.6.0"></a>
## 2020-04-27, Version 0.6.0

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.3.0`, which updates the engine to `v12.16.0` LTS and uses V8 on iOS.

### Commits

* [[`1a58bcf`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/1a58bcf53321d83165b9f607587650a3a0bf8aba)] - core: update nodejs-mobile v0.3.0 (Jaime Bernardo)
* [[`b12b309`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/b12b309f4da0d303a400c4bd6b2c74acaf1cfb32)] - android: rust cargo build environment variables (stoically)

<a id="0.5.0"></a>
## 2019-09-17, Version 0.5.0

### Notable Changes

* Support for `react-native v0.60+`, breaking compatibility with previous versions.
* TypeScript type definitions added.

### Commits

* [[`7cd4a01`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7cd4a01f41fd937628fff9e001de5eda6a001cb9)] - plugin: support react-native 0.60+ (Jaime Bernardo)
* [[`dd7c67a`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/dd7c67a5d7bee803105e9370e020633e2a3a4131)] - plugin: add typescript type definitions (Ivan Schurawel)
* [[`71c401d`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/71c401d0fe7aa6e7b0c5a330bed3645c7a1ea036)] - plugin: update xcode to 2.0.0 (Rajiv Shah)

<a id="0.4.3"></a>
## 2019-06-10, Version 0.4.3

### Notable Changes

* Fix a compatibility issue with newer versions of Gradle when building for Android.

### Commits

* [[`aafb0a5`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/aafb0a56b6960b2b116ad9ef9b673738d99a4512)] - android: use input and output dir syntax in Gradle (Jaime Bernardo)

<a id="0.4.2"></a>
## 2019-06-03, Version 0.4.2

### Notable Changes

* Update `nodejs-mobile-gyp` to `v0.3.1`, fixing a potential security issue.

### Commits

* [[`14c5554`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/14c555472bb1626b8a0ed56bd5d72ce7ed37b646)] - plugin: update nodejs-mobile-gyp to 0.3.1 (Julia Friesel)

<a id="0.4.1"></a>
## 2019-04-24, Version 0.4.1

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.2.1`, fixing an App Store submission error.

### Commits

* [[`13e15a4`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/13e15a44d3af89454669ee2423642a67c592e376)] - plugin: patch node-pre-gyp libc replacement (Jaime Bernardo)
* [[`bb93132`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/bb9313234715472229e16907f567deb95174f56b)] - android: use minSdkVersion to build native modules (Jaime Bernardo)
* [[`5e37e7a`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/5e37e7a1ef7532afa78aededfb33f00643f839b8)] - core: update nodejs-mobile v0.2.1 (Jaime Bernardo)
* [[`829ec3a`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/829ec3ad804aae958813026ab544055faf7dfbba)] - android: Use ReactModule annotation from 0.58 (André Staltz)

<a id="0.4.0"></a>
## 2019-04-04, Version 0.4.0

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.2.0`, which updates the engine to `v10.13.0` LTS.

### Commits

* [[`844fce9`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/844fce9cf8329f2c816de4e7f2d1efeeeee88439)] - docs: mention metro.config.js in Troubleshooting (Jaime Bernardo)
* [[`9655d3a`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/9655d3af08102a463891052772e848e94e4c14be)] - android: fix libc++_shared packaging in 0.59 (Jaime Bernardo)
* [[`c6d9a23`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/c6d9a239d3422a78bcfe95ab745e4f06408a2379)] - android: fix gradle compile deprecation warning (Jaime Bernardo)
* [[`81567e4`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/81567e4e605329a2659e9f7ec4c25ade20c4fdc5)] - core: update nodejs-mobile v0.2.0 (Jaime Bernardo)

<a id="0.3.4"></a>
## 2019-03-18, Version 0.3.4

### Notable Changes

* Hotfix release: fix postlink script paths for `react-native >= 0.59`.

### Commits
* [[`ba9d5d4`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ba9d5d48c413550a890aeb9ec2e895db93eeb5bb)] - plugin: update script paths for react-native 0.59 (Jaime Bernardo)

<a id="0.3.3"></a>
## 2019-02-19, Version 0.3.3

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.1.9`.
* Add 64 bit binaries for Android.

### Commits
* [[`9357f13`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/9357f139e6c9594b1746c3672eb111d1a7c0c529)] - android: build native modules for every arch (Jaime Bernardo)
* [[`fbab03e`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/fbab03e7372167a2ccba766d043a8559b309586e)] - android: add 64 bit binaries (Jaime Bernardo)
* [[`db830fe`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/db830fe3ec75092c3b865d8ed1f1d8189aa0ec71)] - core: update nodejs-mobile v0.1.9 (Jaime Bernardo)

<a id="0.3.2"></a>
## 2018-11-21, Version 0.3.2

### Notable Changes

* Hotfixes the node thread stack size on iOS, when starting the runtime with a node project folder.

### Commits

* [[`082cbc0`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/082cbc0d4815d435a8c06cd34bea4c0a6d573dec)] - ios: set node project thread stack size to 2MB (Jaime Bernardo)

<a id="0.3.1"></a>
## 2018-11-07, Version 0.3.1

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.1.8`, fixing exceptions on Apple A12 CPUs for iOS and being built with NDK r18b for Android.

### Commits

* [[`0e6ffe9`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/0e6ffe9cfb26bf0fa2b8ba8a823067d4ad35ab9c)] - core: update nodejs-mobile v0.1.8 (Jaime Bernardo)
* [[`ed727ed`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ed727edea17e8a9e1a85cef3413becc83b8a0328)] - docs: duplicate module name instructions (Jaime Bernardo)

<a id="0.3.0"></a>
## 2018-09-03, Version 0.3.0

### Notable Changes

* Add new channel APIs.

### Commits

* [[`085e047`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/085e04762b98859354738611cd4e9fc0828c679e)] - docs: document os.tmpdir behavior in node (Jaime Bernardo)
* [[`2ccc542`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/2ccc54290d59cc014d930d1b4bac7c8486bc6316)] - android: show alternative to misleading error log (Jaime Bernardo)
* [[`ff308a6`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ff308a6107c1857e7ec94599420ede1b712e0931)] - docs: document the new channel API, app channel (Jaime Bernardo)
* [[`1116698`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/11166985ef65b253fcb7080289619c31466ead7a)] - plugin: add app.datadir API to get writable path (Jaime Bernardo)
* [[`10c1d3e`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/10c1d3e75af44f1f5b473c0dba552363e13cfe49)] - plugin: add app channel for pause-resume events (Jaime Bernardo)
* [[`7c922f9`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7c922f9751e577154cbc95215bb8c83dbe2254b1)] - plugin: improved events channel (Jaime Bernardo)

<a id="0.2.1"></a>
## 2018-07-30, Version 0.2.1

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.1.7`, built with NDK r17b, to solve Android 7 C++ STL runtime issues.
* Use project-wide properties from react-native, for compatibility with recent react-native releases.

### Commits

* [[`f813ec9`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/f813ec973879506b52ba73b57928deaf8ab0e51e)] - core: update nodejs-mobile v0.1.7 (Jaime Bernardo)
* [[`5e35c75`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/5e35c750f706d600440e4b69b97303e82ae1847c)] - android: use react-native project-wide properties (Jaime Bernardo)

<a id="0.2.0"></a>
## 2018-07-09, Version 0.2.0

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.1.6`, with concurrent GC for iOS.
* Improve native modules support.
* Automatically detect native modules.
* Remove simulator strip when building for iOS devices.
* Include memory optimizations.

### Commits

* [[`b0a55d6`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/b0a55d6cc9244d519c53e026b1f3a5ca9ada288b)] - core: update nodejs-mobile v0.1.6 (Jaime Bernardo)
* [[`dc6e1ed`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/dc6e1ed4a0de202567d08beae1b58b81067e64c8)] - docs: add native modules instructions to README (Jaime Bernardo)
* [[`eb960e0`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/eb960e02cd64d0a1d4229e249d472c6500eaf67e)] - plugin: add automatic native modules detection (Jaime Bernardo)
* [[`ded08e5`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ded08e5ddf0de5402ddd74e27205561fa8474e55)] - android: use original .bin for native modules (Jaime Bernardo)
* [[`209f541`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/209f5410b6e35c8b3f5fc94049f09c0fa92ca975)] - android: release node-rn JNI local references (Jaime Bernardo)
* [[`fd958ed`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/fd958edc6079061f5ccc6ee637be30d7d910c945)] - ios: release memory from node-react messages (Jaime Bernardo)
* [[`d356d70`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/d356d70ac15ce1e59d6916ef143aca4cc6e5a6e5)] - core: update nodejs-mobile v0.1.5 (Jaime Bernardo)
* [[`cba49e1`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/cba49e1baa457a7be7b094ec06d5fdf2cc396498)] - ios: building for device removes the x86_64 arch (Jaime Bernardo)
* [[`22e6286`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/22e62863c30a215fc9227672da867fa88e8e7d0e)] - android: check if native modules assets exist (Jaime Bernardo)
* [[`222f953`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/222f9539b62e18c0fb090f7972e3ea3f599bd83f)] - plugin: use alternative nodejs-mobile-gyp path (Jaime Bernardo)
* [[`757294e`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/757294e9567cdd0fd1723f25c4a37b8918a8f193)] - ios: delete .deps gyp paths from app build (Jaime Bernardo)
* [[`5f5447d`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/5f5447db4ab0ebc0e610cbfff598774bb83c2eb1)] - ios: build native modules as frameworks (Jaime Bernardo)
* [[`89ce6b3`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/89ce6b335ab71943b856215e3be973d71b9b8b87)] - ios: rewrite build phases when linking (Jaime Bernardo)

<a id="0.1.4"></a>
## 2018-03-05, Version 0.1.4

### Notable Changes

* Include the nodejs-project in the runtime NODE_PATH.
* Update `nodejs-mobile` binaries to `v0.1.4`.
* Include experimental native modules build code.
* Increase the iOS node thread stack size to 1MB.

### Commits

* [[`7780f20`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7780f2017817723de53123a268578c89b96235e1)] - plugin: remove native modules detection (Jaime Bernardo)
* [[`99f3400`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/99f3400895d0b8626dbea37f8382f13e6aeb7ebb)] - docs: rephrasing of some README.md sections (Jaime Bernardo)
* [[`940fcfe`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/940fcfe5f14baf9976d8714b3aa321fc094821b7)] - ios: increase node's thread stack size to 1MB (Jaime Bernardo)
* [[`409b5d4`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/409b5d4e35ae0ad8fe102c26b778e6aa77888f1c)] - docs: Add native modules instructions (Jaime Bernardo)
* [[`62af6f1`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/62af6f1ed876756135ca24ec47075dee5665d7c6)] - ios: use file to override native modules build (Jaime Bernardo)
* [[`fabbd6b`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/fabbd6b6a3757af1e624c52503c7f5e8e07a6e9e)] - android: use file to override native modules build (Jaime Bernardo)
* [[`41f7dce`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/41f7dcedbf0ecaa25ea256cd069c1c6b6c94d626)] - android: use script to call npm and node on macOS (Jaime Bernardo)
* [[`3cc78d6`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/3cc78d66a313fb8ec80ba568990f907f182c2d47)] - android: use gradle tasks inputs and outputs (Jaime Bernardo)
* [[`8a7688f`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/8a7688f9b8942f0977483d7929ead7a19fbf473f)] - plugin: Build native modules automatically (Jaime Bernardo)
* [[`7ae4dd5`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7ae4dd569b5bcc9e560ba75bbff2bdf29904a8d8)] - plugin: use nodejs-mobile-gyp for native modules (Jaime Bernardo)
* [[`d933954`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/d9339545465c67b846cbe5b9b09e5180e4846cb6)] - plugin: patch node-pre-gyp module path variables (Jaime Bernardo)
* [[`62c2670`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/62c2670b743bc60da817e8a686622fad597f1737)] - ios: native modules support (Jaime Bernardo)
* [[`af82e39`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/af82e3974d4b206b84ed20a24646a4901ae81f32)] - android: native modules support (Jaime Bernardo)
* [[`448c9ae`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/448c9ae32e70e1d2ec5239fa9d95ce22179f6eca)] - core: update nodejs-mobile v0.1.4 (Jaime Bernardo)
* [[`d478d02`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/d478d029d76e7d1de8b52d1cd5c51f7d61067b31)] - plugin: set NODE_PATH to include the project root (Enrico Giordani)

<a id="0.1.3"></a>
## 2018-01-16, Version 0.1.3

### Notable Changes

* Breaking change:
  - The `start` function from the plugin now takes the node entrypoint filename as a mandatory argument. This means current `react-native` project will have to update every `start()` call to `start('main.js')` to maintain behaviour.
* Updates `react-native` dependency version to `0.52`.
* Optimizes assets copy.
* Adds option argument to disable redirecting `stdout` and `stderr` to logcat.

### Commits

* [[`6de9bb6`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/6de9bb674e1d513547fcba2a62f0a91b556ea1d5)] - plugin: node.js entrypoint filename as argument (Jaime Bernardo)
* [[`b7f145d`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/b7f145d9945df4794f02ef1a98529b623df93958)] - plugin: Add options argument to start methods (Jaime Bernardo)
* [[`ae837b2`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ae837b29c928bdd964db79abff06ddf925af097a)] - android: optimize assets copy (Enrico Giordani)
* [[`c32ace3`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/c32ace3e432f9ee29f5c05964f12c966611a5ddf)] - rn: add requiresMainQueueSetup and update to 0.52 (Rayron Victor)

<a id="0.1.2"></a>
## 2017-10-31, Version 0.1.2

### Notable Changes

* Update `nodejs-mobile` binaries to `v0.1.3`.
* Adds iOS simulator support.
* Updates node version and headers to `v8.6.0`.
* Shows stdout and stderr in Android logcat.

### Commits

* [[`3c5b16e`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/3c5b16e9a8a2b3eba3f513ad310adc433e0732d3)] - docs: Add mention to simulator support in README (Jaime Bernardo)
* [[`7069d4b`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/7069d4bd84d66c264eda7ea99599ef3957b36de9)] - core: update nodejs-mobile v0.1.3 (Jaime Bernardo)
* [[`70c9ac3`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/70c9ac3798ca1fa06447ffb5430a1ba7259bccbc)] - bridge: emit message event inside a setImmediate (Jaime Bernardo)
* [[`e5fbfd0`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/e5fbfd0748757a9c77dc57e4b6c11a68d13aaeac)] - android: Redirect stdout and stderr to logcat (Jaime Bernardo)
* [[`ece0079`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/ece0079d9cd798e045936048c4f65788554090de)] - meta: Update package.json fields (Jaime Bernardo)
* [[`1a5cf5e`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/1a5cf5e3c8d11a92eb88726dbb301a15dc30efa4)] - meta: Add Reporting Issues section to README.md (Jaime Bernardo)
* [[`da767ba`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/da767babc69b59e4efd9ef244766dbbf75999cc5)] - Create LICENSE (Alexis Campailla)

<a id="0.1.1"></a>
## 2017-10-02, Version 0.1.1

### Notable Changes

* Initial release.

### Commits

* [[`d1601e4`](https://github.com/janeasystems/nodejs-mobile-react-native/commit/d1601e494cf14ae4704ee7e781b0b89a645f5c50)] - Initial commit for the React Native Module (Jaime Bernardo)
