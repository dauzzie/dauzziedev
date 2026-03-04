import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import path from 'path'

const majorNode = Number(process.versions.node.split('.')[0])
const generatedDir = path.join(process.cwd(), '.contentlayer', 'generated')

if (!existsSync(generatedDir)) {
  process.exit(0)
}

const replaceForRuntime = (source) => {
  // Node 20+ uses `with { type: 'json' }`.
  if (majorNode >= 20) {
    return source.replace(/assert\s*\{\s*type:\s*'json'\s*\}/g, "with { type: 'json' }")
  }

  // Older runtimes use `assert { type: 'json' }`.
  return source.replace(/with\s*\{\s*type:\s*'json'\s*\}/g, "assert { type: 'json' }")
}

const visit = (dir) => {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const st = statSync(fullPath)
    if (st.isDirectory()) {
      visit(fullPath)
      continue
    }

    if (!fullPath.endsWith('.mjs')) continue

    const original = readFileSync(fullPath, 'utf8')
    const updated = replaceForRuntime(original)
    if (updated !== original) {
      writeFileSync(fullPath, updated)
    }
  }
}

visit(generatedDir)
