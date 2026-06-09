import { idCreate, idTimestamp, idAscending, idDescending } from "../util/native"

const prefixes = {
  job: "job",
  event: "evt",
  session: "ses",
  message: "msg",
  permission: "per",
  question: "que",
  part: "prt",
  pty: "pty",
  tool: "tool",
  workspace: "wrk",
} as const

export function ascending(prefix: keyof typeof prefixes, given?: string) {
  if (idAscending) {
    return idAscending(prefix, given ?? null)
  }
  return generateID(prefix, "ascending", given)
}

export function descending(prefix: keyof typeof prefixes, given?: string) {
  if (idDescending) {
    return idDescending(prefix, given ?? null)
  }
  return generateID(prefix, "descending", given)
}

function generateID(prefix: keyof typeof prefixes, direction: "descending" | "ascending", given?: string): string {
  if (!given) {
    return create(prefixes[prefix], direction)
  }

  if (!given.startsWith(prefixes[prefix])) {
    throw new Error(`ID ${given} does not start with ${prefixes[prefix]}`)
  }
  return given
}

function randomBase62(length: number): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let result = ""
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % 62]
  }
  return result
}

// Fallback JS implementation (used when Rust module is not available)
let lastTimestamp = 0
let counter = 0

export function create(prefix: string, direction: "descending" | "ascending", timestamp?: number): string {
  if (idCreate) {
    return idCreate(prefix, direction, timestamp ?? null)
  }

  // JS fallback
  const currentTimestamp = timestamp ?? Date.now()

  if (currentTimestamp !== lastTimestamp) {
    lastTimestamp = currentTimestamp
    counter = 0
  }
  counter++

  let now = BigInt(currentTimestamp) * BigInt(0x1000) + BigInt(counter)
  now = direction === "descending" ? ~now : now

  const timeBytes = new Uint8Array(6)
  for (let i = 0; i < 6; i++) {
    timeBytes[i] = Number((now >> BigInt(40 - 8 * i)) & BigInt(0xff))
  }

  const hex = Array.from(timeBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return prefix + "_" + hex + randomBase62(14)
}

/** Extract timestamp from an ascending ID. Does not work with descending IDs. */
export function timestamp(id: string): number {
  if (idTimestamp) {
    return idTimestamp(id)
  }

  // JS fallback
  const prefix = id.split("_")[0]
  const hex = id.slice(prefix.length + 1, prefix.length + 13)
  const encoded = BigInt("0x" + hex)
  return Number(encoded / BigInt(0x1000))
}

export * as Identifier from "./id"
