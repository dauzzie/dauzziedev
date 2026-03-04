// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "DauzzieWriter",
  platforms: [.macOS(.v13)],
  products: [
    .executable(name: "DauzzieWriter", targets: ["DauzzieWriter"]),
  ],
  targets: [
    .executableTarget(name: "DauzzieWriter"),
  ]
)
