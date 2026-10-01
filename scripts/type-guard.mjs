// chimera-type-guard: author-time explicit-type linter.
// Why textual, not typescript-eslint: typescript-eslint/ts-api-utils read TS
// compiler internals that no longer exist in TS7 (native), and TS7's own
// `./unstable/*` API exposes no parser for linting. So this scanner strips
// comments + strings (state machine, positions preserved) and enforces our
// five conventions with regexes. Revisit when typescript-eslint supports TS7.
// Usage: node scripts/type-guard.mjs — exits 1 on findings.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse as parseSfc } from '@vue/compiler-sfc'

const ROOT = new URL('..', import.meta.url).pathname
const files = execSync(
  `git -C "${ROOT}" ls-files '*.ts' '*.vue' ':!:node_modules' ':!:.nuxt' ':!:.output' ':!:dist'`,
  { encoding: 'utf8' },
)
  .split('\n')
  .map((f) => f.trim())
  .filter((f) => f !== '' && !f.endsWith('scripts/type-guard.mjs'))

// Replace comments/strings with spaces (keep \n) so rules never match prose.
function strip(text) {
  let out = ''
  let i = 0
  const n = text.length
  let state = 'code'
  let quote = ''
  let depth = 0
  while (i < n) {
    const c = text[i]
    const next = i + 1 < n ? text[i + 1] : ''
    if (state === 'code') {
      if (c === '/' && next === '/') {
        state = 'line'
        out += '  '
        i += 2
      } else if (c === '/' && next === '*') {
        state = 'block'
        out += '  '
        i += 2
      } else if (c === "'" || c === '"' || c === '`') {
        state = 'str'
        quote = c
        depth = c === '`' ? 0 : -1
        out += ' '
        i += 1
      } else {
        out += c
        i += 1
      }
    } else if (state === 'line') {
      if (c === '\n') {
        state = 'code'
        out += c
      } else {
        out += ' '
      }
      i += 1
    } else if (state === 'block') {
      if (c === '*' && next === '/') {
        state = 'code'
        out += '  '
        i += 2
      } else {
        out += c === '\n' ? '\n' : ' '
        i += 1
      }
    } else {
      // string/template literal
      if (quote === '`' && c === '$' && next === '{') {
        depth += 1
        out += '  '
        i += 2
      } else if (quote === '`' && depth > 0 && c === '}') {
        depth -= 1
        out += ' '
        i += 1
      } else if (c === quote && depth <= 0) {
        state = 'code'
        out += ' '
        i += 1
      } else if (c === '\\') {
        out += '  '
        i += 2
      } else {
        out += c === '\n' ? '\n' : ' '
        i += 1
      }
    }
  }
  return out
}

const findings = []

function checkUnit(name, code, lineOffset) {
  const posOf = (idx) => {
    let line = 1
    let col = 1
    for (let i = 0; i < idx; i++) {
      if (code[i] === '\n') {
        line += 1
        col = 1
      } else {
        col += 1
      }
    }
    return { line: line + lineOffset, col }
  }
  const clean = strip(code)
  const hit = (idx, rule, msg) => {
    const p = posOf(idx)
    findings.push({ file: name, line: p.line, col: p.col, rule, msg })
  }
  let m
  // 1. explicit any (: any, as any, Array<any>, <any>)
  const anyRe = /:\s*any\b|\bas\s+any\b|<\s*any\s*[,>]/g
  while ((m = anyRe.exec(clean)) !== null) hit(m.index, 'no-explicit-any', 'explicit any is forbidden')
  // 2. non-null assertion (!) — postfix only (preceded by value chars);
  // logical NOT (!cond) is legitimate and ignored.
  const bangRe = /(?<=[\w$)\]'`"])!(?![=])/g
  while ((m = bangRe.exec(clean)) !== null) hit(m.index, 'no-non-null-assertion', 'non-null assertion (!) is forbidden — narrow explicitly')
  // 3. exported named function without return type: export [async] function f( ... ) {/: no colon before { or =>
  const fnRe = /export\s+(async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/g
  while ((m = fnRe.exec(clean)) !== null) {
    // Depth-aware match: find the paren closing the parameter list.
    const tail = clean.slice(m.index + m[0].length - 1)
    let depth = 0
    let j = 0
    while (j < tail.length) {
      if (tail[j] === '(') depth += 1
      if (tail[j] === ')') {
        depth -= 1
        if (depth === 0) break
      }
      j += 1
    }
    const after = tail.slice(j + 1).match(/^\s*([:{])/)
    if (after === null || after[1] !== ':') {
      hit(m.index, 'explicit-return-type', 'exported function needs an explicit return type')
    }
  }
  // 4. exported const arrow without return type: export const x = (args) => / export const x = async (args) =>
  const arrowRe = /export\s+const\s+[A-Za-z_$][\w$]*\s*=\s*(async\s*)?\(/g
  while ((m = arrowRe.exec(clean)) !== null) {
    const tail = clean.slice(m.index + m[0].length)
    let depth = 1
    let j = 0
    while (j < tail.length && depth > 0) {
      if (tail[j] === '(') depth += 1
      if (tail[j] === ')') depth -= 1
      j += 1
    }
    const after = tail.slice(j).match(/^\s*([:{]|=>)/)
    if (after === null || (after[1] !== ':' && after[1] !== '=>')) {
      hit(m.index, 'explicit-return-type', 'exported arrow function needs an explicit return type')
    } else if (after[1] === '=>') {
      hit(m.index, 'explicit-return-type', 'exported arrow function needs an explicit return type')
    }
  }
  // 5. bare `void ident;` escape hatches
  const voidRe = /^\s*void\s+[A-Za-z_$][\w$]*\s*;/gm
  while ((m = voidRe.exec(clean)) !== null) hit(m.index, 'no-void-hatch', 'bare void escape hatch — remove the unused binding instead')
}

for (const rel of files) {
  const abs = path.join(ROOT, rel)
  const text = readFileSync(abs, 'utf8')
  if (rel.endsWith('.vue')) {
    const { descriptor } = parseSfc(text, { filename: rel })
    for (const block of [descriptor.script, descriptor.scriptSetup]) {
      if (block !== null && block.content.trim() !== '') {
        checkUnit(rel, block.content, block.loc.start.line - 1)
      }
    }
  } else {
    checkUnit(rel, text, 0)
  }
}

if (findings.length > 0) {
  for (const f of findings.sort((a, b) => (a.file < b.file ? -1 : 1))) {
    console.log(`${f.file}:${f.line}:${f.col} [${f.rule}] ${f.msg}`)
  }
  console.log(`\n${findings.length} finding(s)`)
  process.exit(1)
} else {
  console.log(`type-guard clean (${files.length} files)`)
}
