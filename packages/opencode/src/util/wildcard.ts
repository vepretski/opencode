import { wildcardMatch as rustMatch, wildcardAll as rustAll, wildcardAllStructured as rustAllStructured } from "../util/native"
import { sortBy, pipe } from "remeda"

export function match(str: string, pattern: string) {
  if (rustMatch) {
    const caseInsensitive = process.platform === "win32"
    return rustMatch(str, pattern, caseInsensitive)
  }

  // JS fallback
  if (str) str = str.replaceAll("\\", "/")
  if (pattern) pattern = pattern.replaceAll("\\", "/")
  let escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")

  if (escaped.endsWith(" .*")) {
    escaped = escaped.slice(0, -3) + "( .*)?"
  }

  const flags = process.platform === "win32" ? "si" : "s"
  return new RegExp("^" + escaped + "$", flags).test(str)
}

export function all(input: string, patterns: Record<string, any>) {
  if (rustAll) {
    const entries = Object.entries(patterns).map(([k, v]) => [k, String(v)])
    const result = rustAll(input, entries)
    if (result !== undefined) {
      // Find the original value from patterns
      for (const [key, value] of Object.entries(patterns)) {
        if (String(value) === result) return value
      }
    }
    return undefined
  }

  // JS fallback
  const sorted = pipe(patterns, Object.entries, sortBy([([key]) => key.length, "asc"], [([key]) => key, "asc"]))
  let result = undefined
  for (const [pattern, value] of sorted) {
    if (match(input, pattern)) {
      result = value
      continue
    }
  }
  return result
}

export function allStructured(input: { head: string; tail: string[] }, patterns: Record<string, any>) {
  if (rustAllStructured) {
    const entries = Object.entries(patterns).map(([k, v]) => [k, String(v)])
    const result = rustAllStructured(input.head, input.tail, entries)
    if (result !== undefined) {
      for (const [key, value] of Object.entries(patterns)) {
        if (String(value) === result) return value
      }
    }
    return undefined
  }

  // JS fallback
  const sorted = pipe(patterns, Object.entries, sortBy([([key]) => key.length, "asc"], [([key]) => key, "asc"]))
  let result = undefined
  for (const [pattern, value] of sorted) {
    const parts = pattern.split(/\s+/)
    if (!match(input.head, parts[0])) continue
    if (parts.length === 1 || matchSequence(input.tail, parts.slice(1))) {
      result = value
      continue
    }
  }
  return result
}

function matchSequence(items: string[], patterns: string[]): boolean {
  if (patterns.length === 0) return true
  const [pattern, ...rest] = patterns
  if (pattern === "*") return matchSequence(items, rest)
  for (let i = 0; i < items.length; i++) {
    if (match(items[i], pattern) && matchSequence(items.slice(i + 1), rest)) {
      return true
    }
  }
  return false
}

export * as Wildcard from "./wildcard"
