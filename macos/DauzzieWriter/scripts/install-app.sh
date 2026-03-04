#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="DauzzieWriter"
BUNDLE_NAME="${APP_NAME}.app"
BUNDLE_ID="dev.dauzzie.DauzzieWriter"
BUILD_DIR="${ROOT_DIR}/.build/release"
BIN_PATH="${BUILD_DIR}/${APP_NAME}"

TARGET_DIR="/Applications"
if [[ ! -w "$TARGET_DIR" ]]; then
  TARGET_DIR="$HOME/Applications"
  mkdir -p "$TARGET_DIR"
fi

APP_DIR="${TARGET_DIR}/${BUNDLE_NAME}"
CONTENTS_DIR="${APP_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"
RESOURCES_DIR="${CONTENTS_DIR}/Resources"
PLIST_PATH="${CONTENTS_DIR}/Info.plist"
ICONSET_DIR="${BUILD_DIR}/${APP_NAME}.iconset"
ICON_PATH="${RESOURCES_DIR}/${APP_NAME}.icns"

echo "Building release binary..."
cd "$ROOT_DIR"
swift build -c release

if [[ ! -f "$BIN_PATH" ]]; then
  echo "Release binary not found at $BIN_PATH"
  exit 1
fi

echo "Creating app bundle at ${APP_DIR}"
rm -rf "$APP_DIR"
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR"
cp "$BIN_PATH" "$MACOS_DIR/$APP_NAME"
chmod +x "$MACOS_DIR/$APP_NAME"

echo "Generating app icon..."
rm -rf "$ICONSET_DIR"
mkdir -p "$ICONSET_DIR"

swift - "$ICONSET_DIR" <<'SWIFT'
import AppKit
import Foundation

let args = CommandLine.arguments
guard args.count >= 2 else {
  fputs("Missing iconset output directory.\n", stderr)
  exit(1)
}

let iconsetDir = args[1]

let outputs: [(String, Int)] = [
  ("icon_16x16.png", 16),
  ("icon_16x16@2x.png", 32),
  ("icon_32x32.png", 32),
  ("icon_32x32@2x.png", 64),
  ("icon_128x128.png", 128),
  ("icon_128x128@2x.png", 256),
  ("icon_256x256.png", 256),
  ("icon_256x256@2x.png", 512),
  ("icon_512x512.png", 512),
  ("icon_512x512@2x.png", 1024),
]

func makeIcon(size: Int) -> NSImage {
  let side = CGFloat(size)
  let image = NSImage(size: NSSize(width: side, height: side))
  image.lockFocus()
  defer { image.unlockFocus() }

  NSColor.clear.setFill()
  NSRect(x: 0, y: 0, width: side, height: side).fill()

  let inset = side * 0.08
  let circleRect = NSRect(x: inset, y: inset, width: side - (2 * inset), height: side - (2 * inset))
  let circle = NSBezierPath(ovalIn: circleRect)
  let gradient = NSGradient(
    colors: [
      NSColor.systemPink.withAlphaComponent(0.95),
      NSColor.systemPurple.withAlphaComponent(0.95),
      NSColor.systemBlue.withAlphaComponent(0.92),
    ]
  )!
  gradient.draw(in: circle, angle: 45)

  if let symbol = NSImage(systemSymbolName: "pencil.and.scribble", accessibilityDescription: nil)?
    .withSymbolConfiguration(.init(pointSize: side * 0.42, weight: .bold)) {
    NSColor.white.set()
    let symbolRect = NSRect(x: side * 0.22, y: side * 0.2, width: side * 0.56, height: side * 0.56)
    symbol.draw(in: symbolRect)
  }

  return image
}

for (name, size) in outputs {
  let image = makeIcon(size: size)
  guard
    let tiff = image.tiffRepresentation,
    let rep = NSBitmapImageRep(data: tiff),
    let png = rep.representation(using: .png, properties: [:])
  else {
    fputs("Failed creating icon \(name)\n", stderr)
    exit(1)
  }
  let url = URL(fileURLWithPath: iconsetDir).appendingPathComponent(name)
  try png.write(to: url)
}
SWIFT

iconutil -c icns "$ICONSET_DIR" -o "$ICON_PATH"

cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>${APP_NAME}</string>
  <key>CFBundleDisplayName</key>
  <string>${APP_NAME}</string>
  <key>CFBundleIdentifier</key>
  <string>${BUNDLE_ID}</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleExecutable</key>
  <string>${APP_NAME}</string>
  <key>CFBundleIconFile</key>
  <string>${APP_NAME}</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
PLIST

echo "Installed ${BUNDLE_NAME} to ${TARGET_DIR}"
echo "You can launch it from Spotlight or Applications folder."
