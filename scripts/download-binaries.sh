#!/bin/bash

set -e

REPO="nodejs-mobile/nodejs-mobile"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Fetching latest release from $REPO..."

# Get latest release info
RELEASE_INFO=$(curl -s "https://api.github.com/repos/$REPO/releases/latest")
TAG=$(echo "$RELEASE_INFO" | jq -r '.tag_name')

if [ -z "$TAG" ] || [ "$TAG" = "null" ]; then
    echo "Error: Could not fetch latest release tag"
    exit 1
fi

echo "Latest release: $TAG"

# Asset names
ANDROID_ASSET="nodejs-mobile-${TAG}-android.zip"
IOS_ASSET="nodejs-mobile-${TAG}-ios.zip"

# Get download URLs
ANDROID_URL=$(echo "$RELEASE_INFO" | jq -r ".assets[] | select(.name == \"$ANDROID_ASSET\") | .browser_download_url")
IOS_URL=$(echo "$RELEASE_INFO" | jq -r ".assets[] | select(.name == \"$IOS_ASSET\") | .browser_download_url")

if [ -z "$ANDROID_URL" ] || [ "$ANDROID_URL" = "null" ]; then
    echo "Error: Could not find download URL for $ANDROID_ASSET"
    exit 1
fi

if [ -z "$IOS_URL" ] || [ "$IOS_URL" = "null" ]; then
    echo "Error: Could not find download URL for $IOS_ASSET"
    exit 1
fi

# Extract Android binaries
echo "Downloading and extracting Android binaries..."
ANDROID_DEST="$PROJECT_ROOT/android/libnode"

# Remove existing bin directory
if [ -d "${ANDROID_DEST:?}/bin" ]; then
    rm -rf "${ANDROID_DEST:?}/bin"
fi

# Create a temporary file for the download
ANDROID_ZIP=$(mktemp)
curl -L "$ANDROID_URL" -o "$ANDROID_ZIP"
unzip -o "$ANDROID_ZIP" "bin/*" -d "$ANDROID_DEST/"
rm "$ANDROID_ZIP"

# Extract iOS binaries
echo "Downloading and extracting iOS binaries..."
IOS_DEST="$PROJECT_ROOT/ios"

# Remove existing xcframework
if [ -d "${IOS_DEST:?}/NodeMobile.xcframework" ]; then
    rm -rf "${IOS_DEST:?}/NodeMobile.xcframework"
fi

# Create a temporary file for the download
IOS_ZIP=$(mktemp)
curl -L "$IOS_URL" -o "$IOS_ZIP"
unzip -o "$IOS_ZIP" "NodeMobile.xcframework/*" -d "$IOS_DEST/"
rm "$IOS_ZIP"

echo "Binary download and extraction completed successfully!"
