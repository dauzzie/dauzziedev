import AppKit
import Foundation
import Security
import SwiftUI

enum PostCategory: String, CaseIterable, Identifiable {
  case blog = "Blog"
  case poem = "Poem"

  var id: String { rawValue }

  var defaultTags: [String] {
    switch self {
    case .blog:
      return ["engineering", "career"]
    case .poem:
      return ["poetry", "creative"]
    }
  }

  static func from(tags: [String]) -> PostCategory {
    let normalized = Set(tags.map { $0.lowercased() })
    if normalized.contains("poetry") || normalized.contains("poem") {
      return .poem
    }
    return .blog
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

struct ParsedDraft {
  let title: String
  let date: String
  let summary: String
  let author: String
  let tags: [String]
  let body: String
}

struct DeletedDraft {
  let name: String
  let content: String
}

struct EditorSnapshot: Equatable {
  let draftName: String?
  let postType: PostCategory
  let title: String
  let summary: String
  let body: String
  let author: String
  let postDate: String
  let tags: [String]
}

@MainActor
final class WriterViewModel: ObservableObject {
  @Published var repoPath: String
  @Published var title = ""
  @Published var summary = ""
  @Published var body = ""
  @Published var author = "Muhamad Firdaus Husaini"
  @Published var postDate = ""
  @Published var selectedPostType: PostCategory = .blog
  @Published var selectedTags: [String] = ["engineering", "career"]
  @Published var newCategoryInput = ""
  @Published var availableCategories: [String] = []
  @Published var currentDraftName: String? = nil

  @Published var statusMessage = ""
  @Published var dailyPrompt = ""
  @Published var recentDrafts: [RecentDraft] = []
  @Published var commitMessage = ""
  @Published var commandLog = ""
  @Published var isRunningAction = false
  @Published var vercelAuthStatus = "Not detected"
  @Published var useGitAutoDeploy = true
  @Published var hasUnsavedChanges = false

  private var lastDeletedDraft: DeletedDraft?
  private var vercelToken = ""
  private var lastSavedSnapshot = EditorSnapshot(
    draftName: nil,
    postType: .blog,
    title: "",
    summary: "",
    body: "",
    author: "Muhamad Firdaus Husaini",
    postDate: "",
    tags: ["engineering", "career"]
  )

  private let prompts = [
    "Write about one hard engineering decision you made recently.",
    "Draft a poem about software, pressure, and patience.",
    "Tell a short story from your deployment war-room moments.",
    "Write a career checkpoint: what changed this month and why.",
    "Document one automation that saved your team time this week.",
  ]

  init() {
    let defaults = UserDefaults.standard
    self.repoPath = defaults.string(forKey: "repoPath") ?? ""
    self.useGitAutoDeploy = defaults.object(forKey: "useGitAutoDeploy") as? Bool ?? true
    self.postDate = todayDateString()
    autoConfigureWorkspace()
    refreshDailyPrompt()
    refreshRecentDrafts()
    refreshAvailableCategories()
    markCurrentStateAsSaved()
  }

  func autoConfigureWorkspace() {
    if let resolvedRepo = detectDefaultRepoPath() {
      repoPath = resolvedRepo
      UserDefaults.standard.set(resolvedRepo, forKey: "repoPath")
    }

    refreshVercelAuthStatus()
  }

  func saveSettings() {
    guard effectiveRepoPath() != nil else {
      statusMessage = "Invalid repo path. Please select the project root that contains .git."
      return
    }
    let defaults = UserDefaults.standard
    defaults.set(repoPath, forKey: "repoPath")
    defaults.set(useGitAutoDeploy, forKey: "useGitAutoDeploy")
    refreshRecentDrafts()
    statusMessage = "Settings saved."
  }

  func refreshDailyPrompt() {
    let dayIndex = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 0
    dailyPrompt = prompts[dayIndex % prompts.count]
  }

  func refreshRecentDrafts() {
    var drafts: [RecentDraft] = []
    for directory in ["blog", "poetry"] {
      let absoluteDirectory = dataPath(relative: directory)
      guard let items = try? FileManager.default.contentsOfDirectory(
        at: URL(fileURLWithPath: absoluteDirectory),
        includingPropertiesForKeys: [.contentModificationDateKey],
        options: [.skipsHiddenFiles]
      ) else {
        continue
      }

      let scoped = items
        .filter { $0.pathExtension == "mdx" }
        .compactMap { url in
          let values = try? url.resourceValues(forKeys: [.contentModificationDateKey])
          return RecentDraft(
            name: "\(directory)/\(url.lastPathComponent)",
            modifiedAt: values?.contentModificationDate ?? .distantPast
          )
        }
      drafts.append(contentsOf: scoped)
    }

    recentDrafts = drafts
      .sorted { $0.modifiedAt > $1.modifiedAt }
      .prefix(25)
      .map { $0 }
    refreshAvailableCategories()
  }

  func filteredDrafts(search: String) -> [RecentDraft] {
    let query = search.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    if query.isEmpty { return recentDrafts }
    return recentDrafts.filter { $0.name.lowercased().contains(query) }
  }

  func newPost() {
    currentDraftName = nil
    title = ""
    summary = ""
    body = ""
    author = "Muhamad Firdaus Husaini"
    postDate = todayDateString()
    selectedPostType = .blog
    selectedTags = PostCategory.blog.defaultTags
    newCategoryInput = ""
    statusMessage = "New post editor ready."
    markCurrentStateAsSaved()
  }

  func loadDraft(named name: String) {
    let path = draftPath(named: name)
    guard FileManager.default.fileExists(atPath: path) else {
      statusMessage = "Draft not found: \(name)"
      return
    }

    do {
      let content = try String(contentsOfFile: path, encoding: .utf8)
      guard let parsed = parseDraft(content: content) else {
        statusMessage = "Could not parse frontmatter for \(name)."
        return
      }

      currentDraftName = name
      title = parsed.title
      summary = parsed.summary
      body = parsed.body
      author = parsed.author
      postDate = parsed.date
      selectedPostType = name.hasPrefix("poetry/") ? .poem : PostCategory.from(tags: parsed.tags)
      selectedTags = parsed.tags.isEmpty ? selectedPostType.defaultTags : parsed.tags
      applyPostTypeSelection(selectedPostType)
      statusMessage = "Loaded: \(name)"
      markCurrentStateAsSaved()
    } catch {
      statusMessage = "Failed to load draft: \(error.localizedDescription)"
    }
  }

  @discardableResult
  func createDraft() -> Bool {
    guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Title is required."
      return false
    }

    let date = normalizedDate(postDate)
    let slug = slugify(title)
    let filename = "\(date)-\(slug).mdx"
    let relativePath = "\(selectedPostType == .poem ? "poetry" : "blog")/\(filename)"
    let outputPath = draftPath(named: relativePath)

    if FileManager.default.fileExists(atPath: outputPath) {
      statusMessage = "Draft already exists: \(relativePath). Using existing file for updates."
      currentDraftName = relativePath
      return true
    }

    do {
      try FileManager.default.createDirectory(
        atPath: draftsDirectoryPath(for: selectedPostType),
        withIntermediateDirectories: true,
        attributes: nil
      )
      try buildDraftContent(date: date).write(toFile: outputPath, atomically: true, encoding: .utf8)
      currentDraftName = relativePath
      refreshRecentDrafts()
      statusMessage = "Created: \(relativePath)"
      markCurrentStateAsSaved()
      return true
    } catch {
      statusMessage = "Failed to create draft: \(error.localizedDescription)"
      return false
    }
  }

  @discardableResult
  func saveCurrentPost() -> Bool {
    guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      statusMessage = "Title is required."
      return false
    }

    if currentDraftName == nil {
      return createDraft()
    }

    guard let draftName = currentDraftName else {
      statusMessage = "No active draft selected."
      return false
    }

    let outputPath = draftPath(named: draftName)
    let date = normalizedDate(postDate)

    do {
      try buildDraftContent(date: date).write(toFile: outputPath, atomically: true, encoding: .utf8)
      refreshRecentDrafts()
      statusMessage = "Saved: \(draftName)"
      markCurrentStateAsSaved()
      return true
    } catch {
      statusMessage = "Failed to save draft: \(error.localizedDescription)"
      return false
    }
  }

  func deleteCurrentDraft() {
    guard let draftName = currentDraftName else {
      statusMessage = "Select a draft first."
      return
    }

    deleteDraft(named: draftName)
  }

  func deleteDraft(named draftName: String) {
    let path = draftPath(named: draftName)
    do {
      let previousContent = try String(contentsOfFile: path, encoding: .utf8)
      try FileManager.default.removeItem(atPath: path)
      lastDeletedDraft = DeletedDraft(name: draftName, content: previousContent)
      if currentDraftName == draftName {
        newPost()
      }
      refreshRecentDrafts()
      statusMessage = "Deleted: \(draftName)"
    } catch {
      statusMessage = "Failed to delete draft: \(error.localizedDescription)"
    }
  }

  func undoLastDelete() {
    guard let deleted = lastDeletedDraft else {
      statusMessage = "No deleted entry to restore."
      return
    }

    let path = draftPath(named: deleted.name)
    guard !FileManager.default.fileExists(atPath: path) else {
      statusMessage = "Cannot restore \(deleted.name): file already exists."
      return
    }

    do {
      try deleted.content.write(toFile: path, atomically: true, encoding: .utf8)
      lastDeletedDraft = nil
      refreshRecentDrafts()
      loadDraft(named: deleted.name)
      statusMessage = "Restored: \(deleted.name)"
    } catch {
      statusMessage = "Failed to restore draft: \(error.localizedDescription)"
    }
  }

  func addCategoryFromInput() {
    addCategory(newCategoryInput)
    newCategoryInput = ""
  }

  func addCategory(_ raw: String) {
    let normalized = normalizeCategory(raw)
    guard !normalized.isEmpty else { return }
    if !selectedTags.contains(normalized) {
      selectedTags.append(normalized)
    }
    if !availableCategories.contains(normalized) {
      availableCategories.append(normalized)
      availableCategories.sort()
    }
    refreshDirtyState()
  }

  func applyPostTypeSelection(_ type: PostCategory) {
    selectedPostType = type
    let normalized = Set(selectedTags.map { normalizeCategory($0) })

    switch type {
    case .poem:
      if !normalized.contains("poetry") && !normalized.contains("poem") {
        selectedTags.insert("poetry", at: 0)
      }
      if normalized == Set(PostCategory.blog.defaultTags.map { normalizeCategory($0) }) {
        selectedTags = PostCategory.poem.defaultTags
      }
    case .blog:
      selectedTags.removeAll {
        let value = normalizeCategory($0)
        return value == "poetry" || value == "poem"
      }
      if selectedTags.isEmpty {
        selectedTags = PostCategory.blog.defaultTags
      }
    }

    refreshDirtyState()
  }

  func removeCategory(_ category: String) {
    selectedTags.removeAll { $0 == category }
    refreshDirtyState()
  }

  func availableCategoryOptions() -> [String] {
    availableCategories.filter { !selectedTags.contains($0) }
  }

  func openCurrentDraft() {
    guard let draftName = currentDraftName else {
      statusMessage = "Select a draft first."
      return
    }
    open(path: draftPath(named: draftName))
  }

  func syncFromGitHub() {
    guard let repo = effectiveRepoPath() else {
      statusMessage = "Sync failed: repo path is not a git repository."
      return
    }

    runAction {
      var logs: [String] = []
      let fetch = self.runCommand("git", ["-C", repo, "fetch", "--all", "--prune"])
      logs.append("$ git fetch --all --prune\n\(fetch.output)")
      guard fetch.exitCode == 0 else {
        return CommandResult(exitCode: fetch.exitCode, output: logs.joined(separator: "\n\n"))
      }

      let pull = self.runCommand("git", ["-C", repo, "pull", "--ff-only"])
      logs.append("$ git pull --ff-only\n\(pull.output)")
      return CommandResult(exitCode: pull.exitCode, output: logs.joined(separator: "\n\n"))
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.refreshRecentDrafts()
        if let draftName = self.currentDraftName {
          self.loadDraft(named: draftName)
        }
        self.statusMessage = "Synced latest content from GitHub."
      } else {
        self.statusMessage = "Sync failed. Check command log."
      }
    }
  }

  func commitAndPush() {
    guard effectiveRepoPath() != nil else {
      statusMessage = "Set a valid git repo path first."
      return
    }

    let message = commitMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      ? "chore(content): update writing"
      : commitMessage

    runAction {
      self.runGitPush(message: message)
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = "Git push completed."
      } else {
        self.statusMessage = "Git push failed. Check command log."
      }
    }
  }

  func commitChanges() {
    guard effectiveRepoPath() != nil else {
      statusMessage = "Set a valid git repo path first."
      return
    }

    let message = commitMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      ? "chore(content): update writing"
      : commitMessage

    runAction {
      self.runGitCommit(message: message)
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = "Commit completed."
      } else {
        self.statusMessage = "Commit failed. Check command log."
      }
    }
  }

  func deployToVercel() {
    guard effectiveRepoPath() != nil else {
      statusMessage = "Set a valid git repo path first."
      return
    }

    runAction {
      self.runDeploy()
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
    guard saveCurrentPost() else {
      return
    }

    guard effectiveRepoPath() != nil else {
      statusMessage = "Set a valid git repo path first."
      return
    }

    let message = commitMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      ? "chore(content): publish \(currentDraftName ?? "writing update")"
      : commitMessage

    runAction {
      var sections: [String] = []

      let gitResult = self.runGitPush(message: message)
      sections.append(gitResult.output)
      guard gitResult.exitCode == 0 else {
        return CommandResult(exitCode: gitResult.exitCode, output: sections.joined(separator: "\n\n"))
      }

      if self.useGitAutoDeploy {
        sections.append("Vercel auto-deploy mode enabled: skipping manual deploy step.")
        return CommandResult(exitCode: 0, output: sections.joined(separator: "\n\n"))
      }

      let deployResult = self.runDeploy()
      sections.append(deployResult.output)
      return CommandResult(exitCode: deployResult.exitCode, output: sections.joined(separator: "\n\n"))
    } completion: { result in
      self.commandLog = result.output
      if result.exitCode == 0 {
        self.statusMessage = self.useGitAutoDeploy
          ? "One-click publish completed: save + push. Vercel will auto-deploy from Git."
          : "One-click publish completed: save, push, deploy."
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

  private func buildDraftContent(date: String) -> String {
    let normalizedTags = selectedTags
      .map { normalizeCategory($0) }
      .filter { !$0.isEmpty }
    let typeTag = normalizeCategory(selectedPostType.rawValue)
    var finalTags = normalizedTags.isEmpty ? selectedPostType.defaultTags : normalizedTags
    if !typeTag.isEmpty && !finalTags.contains(typeTag) {
      finalTags.insert(typeTag, at: 0)
    }
    let tags = finalTags.map { "'\($0)'" }.joined(separator: ", ")
    let fallbackSummary = summary.isEmpty ? "New writing draft." : summary
    let draftBody = body.isEmpty ? "Start writing..." : body

    return """
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
  }

  private func draftsDirectoryPath(for type: PostCategory) -> String {
    let relative = type == .poem ? "poetry" : "blog"
    return dataPath(relative: relative)
  }

  private func draftPath(named name: String) -> String {
    let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.contains("/") {
      return dataPath(relative: trimmed)
    }

    let blogCandidate = dataPath(relative: "blog/\(trimmed)")
    if FileManager.default.fileExists(atPath: blogCandidate) {
      return blogCandidate
    }
    let poetryCandidate = dataPath(relative: "poetry/\(trimmed)")
    if FileManager.default.fileExists(atPath: poetryCandidate) {
      return poetryCandidate
    }

    return (draftsDirectoryPath(for: selectedPostType) as NSString).appendingPathComponent(trimmed)
  }

  private func dataPath(relative: String) -> String {
    (repoPath as NSString).appendingPathComponent("data/\(relative)")
  }

  private func parseDraft(content: String) -> ParsedDraft? {
    guard content.hasPrefix("---\n") else { return nil }
    let parts = content.components(separatedBy: "\n---\n")
    guard parts.count >= 2 else { return nil }

    let frontmatter = parts[0].replacingOccurrences(of: "---\n", with: "")
    let bodyPart = parts.dropFirst().joined(separator: "\n---\n").trimmingCharacters(in: .newlines)

    let title = value(for: "title", in: frontmatter) ?? ""
    let date = value(for: "date", in: frontmatter) ?? todayDateString()
    let summary = value(for: "summary", in: frontmatter) ?? ""
    let author = value(for: "author", in: frontmatter) ?? "Muhamad Firdaus Husaini"
    let tags = tagsValue(in: frontmatter)

    return ParsedDraft(title: title, date: date, summary: summary, author: author, tags: tags, body: bodyPart)
  }

  private func value(for key: String, in frontmatter: String) -> String? {
    for line in frontmatter.split(separator: "\n") {
      if line.hasPrefix("\(key):") {
        let raw = line.dropFirst(key.count + 1).trimmingCharacters(in: .whitespaces)
        return raw.trimmingCharacters(in: CharacterSet(charactersIn: "\"'"))
      }
    }
    return nil
  }

  private func tagsValue(in frontmatter: String) -> [String] {
    guard let raw = value(for: "tags", in: frontmatter) else { return [] }
    let trimmed = raw.trimmingCharacters(in: CharacterSet(charactersIn: "[]"))
    if trimmed.isEmpty { return [] }

    return trimmed
      .split(separator: ",")
      .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
      .map { $0.trimmingCharacters(in: CharacterSet(charactersIn: "\"'")) }
      .filter { !$0.isEmpty }
  }

  private func normalizedDate(_ input: String) -> String {
    let cleaned = input.trimmingCharacters(in: .whitespacesAndNewlines)
    return cleaned.isEmpty ? todayDateString() : cleaned
  }

  private func normalizeCategory(_ value: String) -> String {
    let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    guard !trimmed.isEmpty else { return "" }
    let replaced = trimmed.replacingOccurrences(of: " ", with: "-")
    let allowed = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: "-_"))
    let cleaned = replaced.unicodeScalars.filter { allowed.contains($0) }
    return String(String.UnicodeScalarView(cleaned))
  }

  func refreshDirtyState() {
    hasUnsavedChanges = currentSnapshot() != lastSavedSnapshot
  }

  private func markCurrentStateAsSaved() {
    lastSavedSnapshot = currentSnapshot()
    hasUnsavedChanges = false
  }

  private func currentSnapshot() -> EditorSnapshot {
    let normalizedTags = selectedTags
      .map { normalizeCategory($0) }
      .filter { !$0.isEmpty }
      .sorted()
    return EditorSnapshot(
      draftName: currentDraftName,
      postType: selectedPostType,
      title: title,
      summary: summary,
      body: body,
      author: author,
      postDate: postDate,
      tags: normalizedTags
    )
  }

  private func todayDateString() -> String {
    String(ISO8601DateFormatter().string(from: Date()).prefix(10))
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
    let commitResult = runGitCommit(message: message)
    if commitResult.exitCode != 0 {
      return commitResult
    }

    guard let repo = effectiveRepoPath() else {
      return CommandResult(exitCode: 1, output: "Repo path is not a git repository: \(repoPath)")
    }
    var combined: [String] = [commitResult.output]

    let push = runCommand("git", ["-C", repo, "push"])
    combined.append("$ git push\n\(push.output)")
    return CommandResult(exitCode: push.exitCode, output: combined.joined(separator: "\n\n"))
  }

  private func runGitCommit(message: String) -> CommandResult {
    guard let repo = effectiveRepoPath() else {
      return CommandResult(exitCode: 1, output: "Repo path is not a git repository: \(repoPath)")
    }
    var combined: [String] = []

    let add = runCommand(
      "git",
      ["-C", repo, "add", "data/blog", "data/poetry", "data/authors", "data/siteMetadata.js"]
    )
    combined.append("$ git add ...\n\(add.output)")
    guard add.exitCode == 0 else {
      return CommandResult(exitCode: add.exitCode, output: combined.joined(separator: "\n\n"))
    }

    let commit = runCommand("git", ["-C", repo, "commit", "-m", message])
    combined.append("$ git commit -m \"\(message)\"\n\(commit.output)")
    if commit.exitCode != 0 && !commit.output.contains("nothing to commit") {
      return CommandResult(exitCode: commit.exitCode, output: combined.joined(separator: "\n\n"))
    }

    return CommandResult(exitCode: 0, output: combined.joined(separator: "\n\n"))
  }

  private func runDeploy() -> CommandResult {
    guard let repo = effectiveRepoPath() else {
      return CommandResult(exitCode: 1, output: "Repo path is not a git repository: \(repoPath)")
    }

    let env = deploymentEnvironment()
    let args = ["deploy", "--prod", "--yes"]
    let deploy = runCommand("vercel", args, environment: env, workingDirectory: repo)
    return CommandResult(exitCode: deploy.exitCode, output: "$ vercel deploy --prod --yes\n\(deploy.output)")
  }

  private func effectiveRepoPath() -> String? {
    let trimmed = repoPath.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !trimmed.isEmpty else { return nil }

    var url = URL(fileURLWithPath: (trimmed as NSString).expandingTildeInPath).standardizedFileURL
    var isDir: ObjCBool = false
    if !FileManager.default.fileExists(atPath: url.path, isDirectory: &isDir) {
      return nil
    }
    if !isDir.boolValue {
      url.deleteLastPathComponent()
    }

    while true {
      let gitPath = url.appendingPathComponent(".git").path
      if FileManager.default.fileExists(atPath: gitPath) {
        if repoPath != url.path {
          repoPath = url.path
        }
        return url.path
      }

      let parent = url.deletingLastPathComponent()
      if parent.path == url.path { break }
      url = parent
    }

    return nil
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
    var mergedEnv = ProcessInfo.processInfo.environment
    if let environment {
      for (key, value) in environment {
        mergedEnv[key] = value
      }
    }

    let fallbackPaths = ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin", "/usr/sbin", "/sbin"]
    let existingPath = mergedEnv["PATH"] ?? ""
    var pathParts = existingPath.split(separator: ":").map(String.init)
    for path in fallbackPaths where !pathParts.contains(path) {
      pathParts.append(path)
    }
    mergedEnv["PATH"] = pathParts.joined(separator: ":")
    process.environment = mergedEnv

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

  private func detectDefaultRepoPath() -> String? {
    if let existing = effectiveRepoPath() {
      return existing
    }

    let home = FileManager.default.homeDirectoryForCurrentUser.path
    let candidates = [
      "\(home)/Documents/GitHub/dauzziedev",
      "\(home)/GitHub/dauzziedev",
      FileManager.default.currentDirectoryPath,
    ]

    for candidate in candidates {
      repoPath = candidate
      if let resolved = effectiveRepoPath() {
        return resolved
      }
    }

    return nil
  }

  private func refreshAvailableCategories() {
    var found = Set<String>()
    for directory in ["blog", "poetry"] {
      let absoluteDirectory = dataPath(relative: directory)
      guard let items = try? FileManager.default.contentsOfDirectory(
        at: URL(fileURLWithPath: absoluteDirectory),
        includingPropertiesForKeys: nil,
        options: [.skipsHiddenFiles]
      ) else {
        continue
      }

      for file in items where file.pathExtension == "mdx" {
        guard let content = try? String(contentsOf: file, encoding: .utf8),
          let parsed = parseDraft(content: content)
        else {
          continue
        }
        for tag in parsed.tags {
          let normalized = normalizeCategory(tag)
          if !normalized.isEmpty {
            found.insert(normalized)
          }
        }
      }
    }

    availableCategories = found.sorted()
  }

  private func detectDefaultVercelToken() -> String {
    let envToken = ProcessInfo.processInfo.environment["VERCEL_TOKEN"]?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    if !envToken.isEmpty {
      return envToken
    }

    let authPath = "\(FileManager.default.homeDirectoryForCurrentUser.path)/.vercel/auth.json"
    if let data = try? Data(contentsOf: URL(fileURLWithPath: authPath)),
       let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
       let token = json["token"] as? String,
       !token.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      return token
    }

    if let token = loadTokenFromKeychain() {
      return token
    }

    return ""
  }

  private func deploymentEnvironment() -> [String: String] {
    var env = ProcessInfo.processInfo.environment
    if !vercelToken.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      env["VERCEL_TOKEN"] = vercelToken
    }
    return env
  }

  func refreshVercelAuthStatus() {
    vercelToken = detectDefaultVercelToken()
    let repo = effectiveRepoPath() ?? FileManager.default.currentDirectoryPath
    let whoami = runCommand("vercel", ["whoami"], environment: deploymentEnvironment(), workingDirectory: repo)

    if whoami.exitCode == 0 {
      let user = whoami.output
        .split(separator: "\n")
        .map(String.init)
        .first(where: { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }) ?? "authenticated user"
      vercelAuthStatus = "Signed in as \(user)"
      return
    }

    if !vercelToken.isEmpty {
      vercelAuthStatus = "Token loaded (whoami unavailable)"
    } else {
      vercelAuthStatus = "Not signed in. Run `vercel login` once."
    }
  }

  private func loadTokenFromKeychain() -> String? {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: "DauzzieWriter",
      kSecAttrAccount as String: "VERCEL_TOKEN",
      kSecReturnData as String: true,
      kSecMatchLimit as String: kSecMatchLimitOne,
    ]

    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)
    guard status == errSecSuccess,
      let data = item as? Data,
      let token = String(data: data, encoding: .utf8)
    else {
      return nil
    }
    return token
  }
}

private struct ContentView: View {
  @StateObject private var model = WriterViewModel()
  @State private var searchText = ""
  @State private var draftToDelete: String?
  @State private var showAdvanced = false
  @State private var showCommandLog = false
  @State private var savePulse = false

  var body: some View {
    VStack(spacing: 0) {
      HStack {
        ZStack {
          Circle()
            .fill(
              LinearGradient(
                colors: [.pink.opacity(0.85), .purple.opacity(0.85), .blue.opacity(0.8)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
              )
            )
            .frame(width: 42, height: 42)
          Image(systemName: "pencil.and.scribble")
            .font(.system(size: 18, weight: .semibold))
            .foregroundStyle(.white)
        }

        VStack(alignment: .leading, spacing: 2) {
          Text("Dauzzie Writer")
            .font(.system(size: 24, weight: .bold, design: .rounded))
          Text("Write first, publish fast")
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
        Spacer()
        Text(model.vercelAuthStatus)
          .font(.caption)
          .foregroundStyle(.secondary)
      }
      .padding(.horizontal, 16)
      .padding(.vertical, 12)

      Divider()

      HStack(spacing: 0) {
        VStack(alignment: .leading, spacing: 10) {
          TextField("Search entries", text: $searchText)
            .textFieldStyle(.roundedBorder)

          HStack(spacing: 8) {
            Button("New") { model.newPost() }
              .buttonStyle(.borderedProminent)
            Button("Sync") { model.syncFromGitHub() }
              .buttonStyle(.borderedProminent)
              .disabled(model.isRunningAction)
          }

          List(model.filteredDrafts(search: searchText)) { draft in
            HStack {
              VStack(alignment: .leading, spacing: 2) {
                Text(draft.name)
                  .font(.system(size: 12, weight: .semibold, design: .rounded))
                Text(draft.modifiedAt.formatted(date: .abbreviated, time: .shortened))
                  .foregroundStyle(.secondary)
                  .font(.caption2)
              }
              Spacer()
              Button("Open") { model.loadDraft(named: draft.name) }
                .buttonStyle(.bordered)
              Button {
                draftToDelete = draft.name
              } label: {
                Image(systemName: "trash")
              }
              .buttonStyle(.bordered)
              .tint(.red)
              Button {
                model.undoLastDelete()
              } label: {
                Image(systemName: "arrow.uturn.backward")
              }
              .buttonStyle(.bordered)
            }
          }

          DisclosureGroup("Workspace Settings") {
            VStack(spacing: 8) {
              TextField("Repo path", text: $model.repoPath)
                .textFieldStyle(.roundedBorder)
              HStack(spacing: 8) {
                Button("Auto Detect") { model.autoConfigureWorkspace() }
                  .buttonStyle(.bordered)
                Button("Refresh Auth") { model.refreshVercelAuthStatus() }
                  .buttonStyle(.bordered)
                Button("Save") { model.saveSettings() }
                  .buttonStyle(.bordered)
                Button("Open Repo") { model.openRepo() }
                  .buttonStyle(.bordered)
              }
            }
            .padding(.top, 6)
          }
        }
        .frame(width: 350)
        .padding(14)
        .background(
          LinearGradient(
            colors: [Color.blue.opacity(0.08), Color.cyan.opacity(0.06)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
          )
        )

        Divider()

        ScrollView {
          VStack(alignment: .leading, spacing: 12) {
            TextField("Title", text: $model.title)
              .font(.title2)
              .textFieldStyle(.roundedBorder)
              .onChange(of: model.title) { _ in model.refreshDirtyState() }

            TextField("Summary", text: $model.summary)
              .textFieldStyle(.roundedBorder)
              .onChange(of: model.summary) { _ in model.refreshDirtyState() }

            Picker("Post Type", selection: $model.selectedPostType) {
              ForEach(PostCategory.allCases) { type in
                Text(type.rawValue).tag(type)
              }
            }
            .pickerStyle(.segmented)
            .onChange(of: model.selectedPostType) { newType in
              model.applyPostTypeSelection(newType)
            }

            if model.selectedPostType == .poem {
              Text("Poem posts publish to /poetry (password-gated).")
                .font(.caption)
                .foregroundStyle(.secondary)
            }

            HStack(spacing: 12) {
              HStack(spacing: 8) {
                TextField("Add category", text: $model.newCategoryInput)
                  .textFieldStyle(.roundedBorder)
                Button("+") { model.addCategoryFromInput() }
                  .buttonStyle(.bordered)
                Menu("Add Existing") {
                  let options = model.availableCategoryOptions()
                  if options.isEmpty {
                    Text("No saved categories")
                  } else {
                    ForEach(options, id: \.self) { category in
                      Button(category) { model.addCategory(category) }
                    }
                  }
                }
              }
              TextField("Date (YYYY-MM-DD)", text: $model.postDate)
                .textFieldStyle(.roundedBorder)
                .onChange(of: model.postDate) { _ in model.refreshDirtyState() }
            }

            if !model.selectedTags.isEmpty {
              ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                  ForEach(model.selectedTags, id: \.self) { tag in
                    HStack(spacing: 4) {
                      Text(tag)
                        .font(.caption)
                      Button {
                        model.removeCategory(tag)
                      } label: {
                        Image(systemName: "xmark.circle.fill")
                          .font(.caption)
                      }
                      .buttonStyle(.plain)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.mint.opacity(0.18))
                    .clipShape(Capsule())
                  }
                }
              }
            }

            TextEditor(text: $model.body)
              .font(
                model.selectedPostType == .poem
                  ? .custom("Iowan Old Style", size: 18)
                  : .system(size: 14, weight: .regular, design: .monospaced)
              )
              .lineSpacing(model.selectedPostType == .poem ? 8 : 2)
              .frame(minHeight: 420)
              .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.25)))
              .onChange(of: model.body) { _ in model.refreshDirtyState() }

            HStack(spacing: 8) {
              Button("Save Draft") { _ = model.saveCurrentPost() }
                .buttonStyle(.borderedProminent)
                .tint(model.hasUnsavedChanges ? .orange : .blue)
                .scaleEffect(model.hasUnsavedChanges && savePulse ? 1.03 : 1.0)
                .shadow(color: model.hasUnsavedChanges ? .orange.opacity(0.4) : .clear, radius: 10)
                .animation(
                  model.hasUnsavedChanges
                    ? .easeInOut(duration: 0.85).repeatForever(autoreverses: true)
                    : .default,
                  value: savePulse
                )
              Button("Publish Live") { model.oneClickPublish() }
                .buttonStyle(.borderedProminent)
                .tint(.pink)
                .disabled(model.isRunningAction)
              Button("Delete Current") {
                if let name = model.currentDraftName {
                  draftToDelete = name
                }
              }
              .buttonStyle(.bordered)
              .tint(.red)
              .disabled(model.currentDraftName == nil)
            }

            Toggle("Use Vercel auto-deploy on push", isOn: $model.useGitAutoDeploy)

            DisclosureGroup("Advanced Publish Options", isExpanded: $showAdvanced) {
              VStack(spacing: 8) {
                TextField("Commit message", text: $model.commitMessage)
                  .textFieldStyle(.roundedBorder)
                HStack(spacing: 8) {
                  Button("Commit Changes") { model.commitChanges() }
                    .buttonStyle(.bordered)
                    .disabled(model.isRunningAction)
                  Button("Commit + Push") { model.commitAndPush() }
                    .buttonStyle(.bordered)
                    .disabled(model.isRunningAction)
                  Button("Deploy Only") { model.deployToVercel() }
                    .buttonStyle(.bordered)
                    .disabled(model.isRunningAction)
                  Button("Open Local Site") { model.openLocalSite() }
                    .buttonStyle(.bordered)
                }
              }
              .padding(.top, 6)
            }

            if !model.statusMessage.isEmpty {
              Text(model.statusMessage)
                .font(.caption)
                .foregroundStyle(model.statusMessage.lowercased().contains("failed") ? .red : .secondary)
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            if !model.commandLog.isEmpty {
              DisclosureGroup("Command Log", isExpanded: $showCommandLog) {
                ScrollView {
                  Text(model.commandLog)
                    .font(.system(size: 12, weight: .regular, design: .monospaced))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(8)
                }
                .frame(minHeight: 140, maxHeight: 220)
                .background(Color.indigo.opacity(0.08))
                .cornerRadius(8)
              }
            }
          }
          .padding(16)
        }
      }
    }
    .frame(minWidth: 1080, minHeight: 760)
    .alert("Delete entry?", isPresented: Binding(get: { draftToDelete != nil }, set: { if !$0 { draftToDelete = nil } })) {
      Button("Delete", role: .destructive) {
        if let name = draftToDelete {
          model.deleteDraft(named: name)
        }
        draftToDelete = nil
      }
      Button("Cancel", role: .cancel) {
        draftToDelete = nil
      }
    } message: {
      Text(draftToDelete ?? "")
    }
    .onChange(of: model.hasUnsavedChanges) { changed in
      savePulse = changed
    }
    .onAppear {
      savePulse = model.hasUnsavedChanges
    }
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
