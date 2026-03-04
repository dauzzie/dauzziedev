import AppKit
import Foundation
import SwiftUI

enum WritingType: String, CaseIterable, Identifiable {
  case blog = "Blog"
  case poem = "Poem"
  case story = "Story"
  case note = "Note"

  var id: String { rawValue }

  var defaultTags: [String] {
    switch self {
    case .blog:
      return ["engineering", "career"]
    case .poem:
      return ["poetry", "creative"]
    case .story:
      return ["story", "creative"]
    case .note:
      return ["notes"]
    }
  }
}

struct RecentDraft: Identifiable {
  let id = UUID()
  let name: String
  let modifiedAt: Date
}

struct CommandResult {
  let exitCode: Int32
  let output: String
}

@MainActor
final class WriterViewModel: ObservableObject {
  @Published var repoPath: String
  @Published var title = ""
  @Published var summary = ""
  @Published var body = ""
  @Published var author = "Muhamad Firdaus Husaini"
  @Published var selectedType: WritingType = .blog
  @Published var statusMessage = ""
  @Published var dailyPrompt = ""
  @Published var recentDrafts: [RecentDraft] = []
  @Published var commitMessage = ""
  @Published var vercelToken = ""
  @Published var vercelProjectName = ""
  @Published var deployHookURL = ""
  @Published var commandLog = ""
  @Published var isRunningAction = false

  private let prompts = [
    "Write about one hard engineering decision you made recently.",
    "Draft a poem about software, pressure, and patience.",
    "Tell a short story from your deployment war-room moments.",
    "Write a career checkpoint: what changed this month and why.",
    "Document one automation that saved your team time this week.",
  ]

  init() {
    let defaults = UserDefaults.standard
    let defaultPath = FileManager.default.currentDirectoryPath
    self.repoPath = defaults.string(forKey: "repoPath") ?? defaultPath
    self.vercelToken = defaults.string(forKey: "vercelToken") ?? ""
    self.vercelProjectName = defaults.string(forKey: "vercelProjectName") ?? ""
    self.deployHookURL = defaults.string(forKey: "deployHookURL") ?? ""
    refreshDailyPrompt()
    refreshRecentDrafts()
  }

  func saveSettings() {
    let defaults = UserDefaults.standard
    defaults.set(repoPath, forKey: "repoPath")
    defaults.set(vercelToken, forKey: "vercelToken")
    defaults.set(vercelProjectName, forKey: "vercelProjectName")
    defaults.set(deployHookURL, forKey: "deployHookURL")
    refreshRecentDrafts()
    statusMessage = "Settings saved."
  }

  func refreshDailyPrompt() {
    let dayIndex = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 0
    dailyPrompt = prompts[dayIndex % prompts.count]
  }

  func refreshRecentDrafts() {
    let blogPath = (repoPath as NSString).appendingPathComponent("data/blog")
    guard let items = try? FileManager.default.contentsOfDirectory(
      at: URL(fileURLWithPath: blogPath),
      includingPropertiesForKeys: [.contentModificationDateKey],
      options: [.skipsHiddenFiles]
    ) else {
      recentDrafts = []
      return
    }

    recentDrafts = items
      .filter { $0.pathExtension == "mdx" }
      .compactMap { url in
        let values = try? url.resourceValues(forKeys: [.contentModificationDateKey])
        return RecentDraft(name: url.lastPathComponent, modifiedAt: values?.contentModificationDate ?? .distantPast)
      }
      .sorted { $0.modifiedAt > $1.modifiedAt }
      .prefix(8)
      .map { $0 }
  }

  @discardableResult
  func createDraft() -> Bool {
    guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Title is required."
      return false
    }

    let date = ISO8601DateFormatter().string(from: Date()).prefix(10)
    let slug = slugify(title)
    let filename = "\(date)-\(slug).mdx"
    let blogPath = (repoPath as NSString).appendingPathComponent("data/blog")
    let outputPath = (blogPath as NSString).appendingPathComponent(filename)

    if FileManager.default.fileExists(atPath: outputPath) {
      statusMessage = "Draft already exists: \(filename)"
      return true
    }

    let tags = selectedType.defaultTags.map { "'\($0)'" }.joined(separator: ", ")
    let fallbackSummary = summary.isEmpty ? "New \(selectedType.rawValue.lowercased()) draft." : summary
    let draftBody = body.isEmpty ? "Start writing..." : body

    let content = """
    ---
    title: "\(title)"
    date: "\(date)"
    tags: [\(tags)]
    draft: false
    summary: "\(fallbackSummary)"
    images: []
    layout: PostLayout
    author: "\(author)"
    ---

    \(draftBody)
    """

    do {
      try FileManager.default.createDirectory(
        atPath: blogPath,
        withIntermediateDirectories: true,
        attributes: nil
      )
      try content.write(toFile: outputPath, atomically: true, encoding: .utf8)
      statusMessage = "Saved: \(filename)"
      refreshRecentDrafts()
      open(path: outputPath)
      return true
    } catch {
      statusMessage = "Failed to save draft: \(error.localizedDescription)"
      return false
    }
  }

  func commitAndPush() {
    guard !repoPath.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Set a repo path first."
      return
    }

    let message = commitMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      ? "chore(content): add new writing draft"
      : commitMessage

    runAction {
      var combined: [String] = []

      let add = self.runCommand("git", ["-C", self.repoPath, "add", "data/blog", "data/authors", "data/siteMetadata.js"])
      combined.append("$ git add ...\n\(add.output)")
      guard add.exitCode == 0 else { return CommandResult(exitCode: add.exitCode, output: combined.joined(separator: "\n\n")) }

      let commit = self.runCommand("git", ["-C", self.repoPath, "commit", "-m", message])
      combined.append("$ git commit -m \"\(message)\"\n\(commit.output)")

      if commit.exitCode != 0 && !commit.output.contains("nothing to commit") {
        return CommandResult(exitCode: commit.exitCode, output: combined.joined(separator: "\n\n"))
      }

      let push = self.runCommand("git", ["-C", self.repoPath, "push"])
      combined.append("$ git push\n\(push.output)")

      return CommandResult(exitCode: push.exitCode, output: combined.joined(separator: "\n\n"))
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = "Git push completed. Vercel should auto-deploy if connected to this repo."
      } else {
        self.statusMessage = "Git push failed. Check command log."
      }
    }
  }

  func deployToVercel() {
    guard !repoPath.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Set a repo path first."
      return
    }

    runAction {
      if !self.deployHookURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        let hook = self.runCommand("curl", ["-sS", "-X", "POST", self.deployHookURL])
        return CommandResult(exitCode: hook.exitCode, output: "$ curl -X POST <deploy-hook>\n\(hook.output)")
      }

      var env = ProcessInfo.processInfo.environment
      if !self.vercelToken.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        env["VERCEL_TOKEN"] = self.vercelToken
      }

      var args = ["--prod", "--yes"]
      if !self.vercelProjectName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        args += ["--name", self.vercelProjectName]
      }

      let deploy = self.runCommand("vercel", args, environment: env, workingDirectory: self.repoPath)
      return CommandResult(exitCode: deploy.exitCode, output: "$ vercel \(args.joined(separator: " "))\n\(deploy.output)")
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = "Vercel deploy triggered successfully."
      } else {
        self.statusMessage = "Vercel deploy failed. Install Vercel CLI or use a deploy hook URL."
      }
    }
  }

  func oneClickPublish() {
    if !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      let created = createDraft()
      if !created {
        return
      }
    }

    guard !repoPath.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Set a repo path first."
      return
    }

    let message = commitMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      ? "chore(content): publish new writing"
      : commitMessage

    runAction {
      var sections: [String] = []

      let gitResult = self.runGitPush(message: message)
      sections.append(gitResult.output)
      guard gitResult.exitCode == 0 else {
        return CommandResult(exitCode: gitResult.exitCode, output: sections.joined(separator: "\n\n"))
      }

      let deployResult = self.runDeploy()
      sections.append(deployResult.output)
      return CommandResult(exitCode: deployResult.exitCode, output: sections.joined(separator: "\n\n"))
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = "One-click publish completed: draft, push, and deploy finished."
      } else {
        self.statusMessage = "One-click publish failed. Check command log."
      }
    }
  }

  func openRepo() {
    open(path: repoPath)
  }

  func openLocalSite() {
    guard let url = URL(string: "http://localhost:3000") else { return }
    NSWorkspace.shared.open(url)
  }

  func openLatestDraft() {
    guard let name = recentDrafts.first?.name else { return }
    let fullPath = (repoPath as NSString).appendingPathComponent("data/blog/\(name)")
    open(path: fullPath)
  }

  private func open(path: String) {
    NSWorkspace.shared.open(URL(fileURLWithPath: path))
  }

  private func slugify(_ value: String) -> String {
    let allowed = CharacterSet.alphanumerics.union(.whitespaces)
    let cleaned = value.unicodeScalars.map { allowed.contains($0) ? Character($0) : " " }
    let words = String(cleaned).lowercased().split(separator: " ").filter { !$0.isEmpty }
    return words.joined(separator: "-")
  }

  private func runAction(task: @escaping () -> CommandResult, completion: @escaping (CommandResult) -> Void) {
    isRunningAction = true
    Task.detached {
      let result = task()
      await MainActor.run {
        completion(result)
        self.isRunningAction = false
      }
    }
  }

  private func runGitPush(message: String) -> CommandResult {
    var combined: [String] = []

    let add = runCommand("git", ["-C", repoPath, "add", "data/blog", "data/authors", "data/siteMetadata.js"])
    combined.append("$ git add ...\n\(add.output)")
    guard add.exitCode == 0 else {
      return CommandResult(exitCode: add.exitCode, output: combined.joined(separator: "\n\n"))
    }

    let commit = runCommand("git", ["-C", repoPath, "commit", "-m", message])
    combined.append("$ git commit -m \"\(message)\"\n\(commit.output)")
    if commit.exitCode != 0 && !commit.output.contains("nothing to commit") {
      return CommandResult(exitCode: commit.exitCode, output: combined.joined(separator: "\n\n"))
    }

    let push = runCommand("git", ["-C", repoPath, "push"])
    combined.append("$ git push\n\(push.output)")
    return CommandResult(exitCode: push.exitCode, output: combined.joined(separator: "\n\n"))
  }

  private func runDeploy() -> CommandResult {
    if !deployHookURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      let hook = runCommand("curl", ["-sS", "-X", "POST", deployHookURL])
      return CommandResult(exitCode: hook.exitCode, output: "$ curl -X POST <deploy-hook>\n\(hook.output)")
    }

    var env = ProcessInfo.processInfo.environment
    if !vercelToken.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      env["VERCEL_TOKEN"] = vercelToken
    }

    var args = ["--prod", "--yes"]
    if !vercelProjectName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      args += ["--name", vercelProjectName]
    }

    let deploy = runCommand("vercel", args, environment: env, workingDirectory: repoPath)
    return CommandResult(exitCode: deploy.exitCode, output: "$ vercel \(args.joined(separator: " "))\n\(deploy.output)")
  }

  private func runCommand(
    _ executable: String,
    _ arguments: [String],
    environment: [String: String]? = nil,
    workingDirectory: String? = nil
  ) -> CommandResult {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
    process.arguments = [executable] + arguments
    if let environment {
      process.environment = environment
    }
    if let workingDirectory {
      process.currentDirectoryURL = URL(fileURLWithPath: workingDirectory)
    }

    let outputPipe = Pipe()
    process.standardOutput = outputPipe
    process.standardError = outputPipe

    do {
      try process.run()
      process.waitUntilExit()
    } catch {
      return CommandResult(exitCode: 1, output: "Failed to run command: \(error.localizedDescription)")
    }

    let data = outputPipe.fileHandleForReading.readDataToEndOfFile()
    let output = String(data: data, encoding: .utf8) ?? ""
    return CommandResult(exitCode: process.terminationStatus, output: output)
  }
}

private struct ContentView: View {
  @StateObject private var model = WriterViewModel()

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 16) {
        Text("Dauzzie Writer")
          .font(.system(size: 28, weight: .bold, design: .rounded))

        Text("Companion app for blog posts, poems, and stories")
          .foregroundStyle(.secondary)

        GroupBox("Workspace") {
          VStack(spacing: 10) {
            TextField("Website repo path", text: $model.repoPath)
              .textFieldStyle(.roundedBorder)
            HStack(spacing: 8) {
              TextField("Vercel Project Name (optional)", text: $model.vercelProjectName)
                .textFieldStyle(.roundedBorder)
              SecureField("VERCEL_TOKEN (optional)", text: $model.vercelToken)
                .textFieldStyle(.roundedBorder)
            }
            TextField("Vercel Deploy Hook URL (optional)", text: $model.deployHookURL)
              .textFieldStyle(.roundedBorder)
            HStack(spacing: 8) {
              Button("Save Settings") { model.saveSettings() }
                .buttonStyle(.borderedProminent)
              Button("Open Repo") { model.openRepo() }
                .buttonStyle(.bordered)
              Button("Open Local Site") { model.openLocalSite() }
                .buttonStyle(.bordered)
            }
          }
        }

        GroupBox("Daily Prompt") {
          HStack {
            Text(model.dailyPrompt)
              .frame(maxWidth: .infinity, alignment: .leading)
            Button("Refresh") { model.refreshDailyPrompt() }
          }
        }

        GroupBox("Create Draft") {
          VStack(spacing: 10) {
            HStack(spacing: 12) {
              TextField("Title", text: $model.title)
                .textFieldStyle(.roundedBorder)
              Picker("Type", selection: $model.selectedType) {
                ForEach(WritingType.allCases) { type in
                  Text(type.rawValue).tag(type)
                }
              }
              .frame(width: 150)
            }

            TextField("Summary", text: $model.summary)
              .textFieldStyle(.roundedBorder)

            TextEditor(text: $model.body)
              .font(.system(size: 14, weight: .regular, design: .monospaced))
              .frame(minHeight: 180)
              .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.25)))

            HStack(spacing: 8) {
              Button("Create Draft") { model.createDraft() }
                .buttonStyle(.borderedProminent)
              Button("Open Latest Draft") { model.openLatestDraft() }
                .buttonStyle(.bordered)
            }
          }
        }

        GroupBox("Publish") {
          VStack(spacing: 10) {
            TextField("Commit message", text: $model.commitMessage)
              .textFieldStyle(.roundedBorder)
            HStack(spacing: 8) {
              Button("Commit + Push (GitHub)") { model.commitAndPush() }
                .buttonStyle(.borderedProminent)
                .disabled(model.isRunningAction)
              Button("Deploy to Vercel") { model.deployToVercel() }
                .buttonStyle(.bordered)
                .disabled(model.isRunningAction)
              Button("One-Click Publish") { model.oneClickPublish() }
                .buttonStyle(.bordered)
                .disabled(model.isRunningAction)
            }
            if !model.commandLog.isEmpty {
              ScrollView {
                Text(model.commandLog)
                  .font(.system(size: 12, weight: .regular, design: .monospaced))
                  .frame(maxWidth: .infinity, alignment: .leading)
                  .padding(8)
              }
              .frame(minHeight: 140, maxHeight: 220)
              .background(Color.black.opacity(0.06))
              .cornerRadius(8)
            }
          }
        }

        Text(model.statusMessage)
          .foregroundStyle(model.statusMessage.lowercased().contains("failed") ? .red : .secondary)

        Divider()

        Text("Recent Drafts")
          .font(.headline)
        List(model.recentDrafts) { draft in
          VStack(alignment: .leading, spacing: 2) {
            Text(draft.name).font(.system(size: 13, weight: .semibold, design: .rounded))
            Text(draft.modifiedAt.formatted(date: .abbreviated, time: .shortened))
              .foregroundStyle(.secondary)
              .font(.caption)
          }
        }
        .frame(minHeight: 160)
      }
      .padding(20)
    }
    .frame(minWidth: 920, minHeight: 820)
  }
}

@main
struct DauzzieWriterApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
    .windowStyle(.titleBar)
  }
}
