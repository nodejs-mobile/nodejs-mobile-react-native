#!/bin/sh
set -e

if [ -f ./.xcode.env ]; then
  source "./.xcode.env";
fi
if [ -f ./.xcode.env.local ]; then
  source "./.xcode.env.local";
fi

DESIRED_NODE_VERSION="18"
CURRENT_NODE_VERSION="$(node -p "process.versions.node.split('.')[0]")"
if [ "$CURRENT_NODE_VERSION" -ne "$DESIRED_NODE_VERSION" ]; then
  echo "nodejs-mobile-react-native requires Node.js version \
$DESIRED_NODE_VERSION accessible from Xcode, but found \
$(node -p 'process.versions.node')"
  exit 1
fi

# This is our nodejs-project folder that was copied to the Xcode build folder
NODEPROJ="$CODESIGNING_FOLDER_PATH/nodejs-project"

if [ -z "$NODEJS_MOBILE_BUILD_NATIVE_MODULES" ]; then
# If build native modules preference is not set, look for it in the project's
#nodejs-assets/BUILD_NATIVE_MODULES.txt file.
NODEJS_ASSETS_DIR="$( cd "$PROJECT_DIR" && cd ../nodejs-assets/ && pwd )"
PREFERENCE_FILE_PATH="$NODEJS_ASSETS_DIR/BUILD_NATIVE_MODULES.txt"
  if [ -f "$PREFERENCE_FILE_PATH" ]; then
    NODEJS_MOBILE_BUILD_NATIVE_MODULES="$(cat $PREFERENCE_FILE_PATH | xargs)"
  fi
fi

if [ -z "$NODEJS_MOBILE_BUILD_NATIVE_MODULES" ]; then
# If build native modules preference is not set, try to find .gyp files
#to turn it on.
  gypfiles=($(find "$NODEPROJ" -type f -name "*.gyp"))
  if [ ${#gypfiles[@]} -gt 0 ]; then
    NODEJS_MOBILE_BUILD_NATIVE_MODULES=1
  else
    NODEJS_MOBILE_BUILD_NATIVE_MODULES=0
  fi
fi

if [ "1" != "$NODEJS_MOBILE_BUILD_NATIVE_MODULES" ]; then exit 0; fi

# Delete object files that may already come from within the npm package.
find "$NODEPROJ" -name "*.o" -type f -delete
find "$NODEPROJ" -name "*.a" -type f -delete

# Function to skip compilation of a prebuilt module
preparePrebuiltModule()
{
  local DOT_NODE_PATH="$1"
  local DOT_NODE_FULL="$(cd "$(dirname -- "$DOT_NODE_PATH")" >/dev/null; pwd -P)/$(basename -- "$DOT_NODE_PATH")"
  local MODULE_ROOT="$(cd $DOT_NODE_PATH && cd .. && cd .. && cd .. && pwd)"
  local MODULE_NAME="$(basename $MODULE_ROOT)"
  echo "Preparing to use the prebuild in $MODULE_NAME"
  # Move the prebuild to the correct folder:
  rm -rf $MODULE_ROOT/build
  mkdir -p $MODULE_ROOT/build/Release
  mv $DOT_NODE_FULL $MODULE_ROOT/build/Release/
  # Hack the npm package to forcefully disable compile-on-install:
  rm -rf $MODULE_ROOT/binding.gyp
  sed -i.bak 's/"install"/"dontinstall"/g; s/"rebuild"/"dontrebuild"/g; s/"gypfile"/"dontgypfile"/g' $MODULE_ROOT/package.json
}

# Delete bundle contents that may be there from previous builds.
# Handle the special case where the module has a prebuild that we want to use
if [ "$PLATFORM_PREFERRED_ARCH" == "arm64" ]; then
  PREBUILD_ARCH="arm64"
else
  PREBUILD_ARCH="x64"
fi
if [ "$PLATFORM_NAME" == "iphonesimulator" ] && [ "$NATIVE_ARCH" == "arm64" ]; then
  SUFFIX="-simulator"
  PREBUILD_ARCH="arm64"
else
  SUFFIX=""
fi
find -E "$NODEPROJ" \
    ! -regex ".*/prebuilds/ios-$PREBUILD_ARCH$SUFFIX" \
    -regex '.*/prebuilds/[^/]*$' -type d \
    -prune -exec rm -rf "{}" \;
find -E "$NODEPROJ" \
    ! -regex ".*/prebuilds/ios-$PREBUILD_ARCH$SUFFIX/.*\.node$" \
    -name '*.node' -type f \
    -exec rm "{}" \;
find "$NODEPROJ" \
    -name "*.framework" -type d \
    -prune -exec rm -rf "{}" \;
for DOT_NODE in `find -E "$NODEPROJ" -regex ".*/prebuilds/ios-$PREBUILD_ARCH$SUFFIX/.*\.node$"`; do
  preparePrebuiltModule "$DOT_NODE"
done

# Apply patches to the modules package.json
if [ -d "$NODEPROJ"/node_modules/ ]; then
  PATCH_SCRIPT_DIR="$( cd "$PROJECT_DIR" && cd ../node_modules/nodejs-mobile-react-native/scripts/ && pwd )"
  NODEJS_PROJECT_MODULES_DIR="$( cd "$NODEPROJ" && cd node_modules && pwd )"
  node "$PATCH_SCRIPT_DIR"/patch-package.js $NODEJS_PROJECT_MODULES_DIR
fi

# Get the nodejs-mobile-gyp location
NODEJS_MOBILE_GYP_BIN_FILE="$( cd "$PROJECT_DIR" && cd .. && node -p 'require.resolve(`nodejs-mobile-gyp/bin/node-gyp.js`)' )"

# Support building neon-bindings (Rust) native modules
if [ -f ~/.cargo/env ]; then
  source ~/.cargo/env;
fi

# Rebuild modules with right environment
NODEJS_HEADERS_DIR="$( cd "$PROJECT_DIR" && cd ../node_modules/nodejs-mobile-react-native/ios/libnode/ && pwd )"
pushd $NODEPROJ
if [ "$PLATFORM_NAME" == "iphoneos" ]; then
  GYP_DEFINES="OS=ios" \
  CARGO_BUILD_TARGET="aarch64-apple-ios iossim=false" \
  NODEJS_MOBILE_GYP="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_node_gyp="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_nodedir="$NODEJS_HEADERS_DIR" \
  npm_config_platform="ios" \
  npm_config_format="make-ios" \
  npm_config_arch="arm64" \
  npm --verbose --foreground-scripts rebuild --build-from-source
elif [ "$NATIVE_ARCH" == "arm64" ]; then
  GYP_DEFINES="OS=ios target_arch=arm64 iossim=true" \
  CARGO_BUILD_TARGET="aarch64-apple-ios-sim" \
  NODEJS_MOBILE_GYP="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_node_gyp="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_nodedir="$NODEJS_HEADERS_DIR" \
  npm_config_platform="ios" \
  npm_config_format="make-ios" \
  npm_config_arch="arm64" \
  npm --verbose --foreground-scripts rebuild --build-from-source
else
  GYP_DEFINES="OS=ios target_arch=x64 iossim=true" \
  CARGO_BUILD_TARGET="x86_64-apple-ios" \
  NODEJS_MOBILE_GYP="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_node_gyp="$NODEJS_MOBILE_GYP_BIN_FILE" \
  npm_config_nodedir="$NODEJS_HEADERS_DIR" \
  npm_config_platform="ios" \
  npm_config_format="make-ios" \
  npm_config_arch="x64" \
  npm --verbose --foreground-scripts rebuild --build-from-source
fi
popd
