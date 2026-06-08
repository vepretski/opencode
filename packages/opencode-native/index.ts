// TypeScript wrappers for Rust native modules
// These provide drop-in replacements for the problematic TypeScript implementations

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Load the native module
const native = require('./opencode-native.node')

// Export native classes
export const NativeAsyncQueue = native.NativeAsyncQueue
export const NativeRingBuffer = native.NativeRingBuffer
export const NativeLruCache = native.NativeLruCache

// TypeScript wrapper for AsyncQueue with the same API as the original
export class AsyncQueue<T> implements AsyncIterable<T> {
  private rust: InstanceType<typeof NativeAsyncQueue>
  private closed = false

  constructor(capacity: number = 1024) {
    this.rust = new NativeAsyncQueue(capacity)
  }

  push(item: T): boolean {
    if (this.closed) return false
    return this.rust.push(JSON.stringify(item))
  }

  async next(): Promise<T> {
    const result = this.rust.next()
    if (result === '') {
      // Queue is closed, return a promise that never resolves (like original)
      return new Promise<T>(() => {})
    }
    return JSON.parse(result) as T
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      const result = await this.rust.next()
      if (result === '') return // Queue closed
      yield JSON.parse(result) as T
    }
  }

  close(): void {
    this.closed = true
    this.rust.close()
  }

  drain(): number {
    return this.rust.drain()
  }

  get length(): number {
    return this.rust.len()
  }

  get isEmpty(): boolean {
    return this.rust.is_empty()
  }

  get isClosed(): boolean {
    return this.rust.is_closed()
  }

  get capacity(): number {
    return this.rust.capacity()
  }
}

// TypeScript wrapper for RingBuffer
export class RingBuffer {
  private rust: InstanceType<typeof NativeRingBuffer>

  constructor(capacity: number = 10 * 1024 * 1024) { // Default 10MB
    this.rust = new NativeRingBuffer(capacity)
  }

  push(chunk: string): boolean {
    return this.rust.push(chunk)
  }

  toString(): string {
    return this.rust.to_string()
  }

  tail(maxBytes: number): string {
    return this.rust.tail(maxBytes)
  }

  get isCut(): boolean {
    return this.rust.is_cut()
  }

  get length(): number {
    return this.rust.len()
  }

  get isEmpty(): boolean {
    return this.rust.is_empty()
  }

  clear(): void {
    this.rust.clear()
  }

  get capacity(): number {
    return this.rust.capacity()
  }
}

// TypeScript wrapper for LruCache
export class LruCache<V = any> {
  private rust: InstanceType<typeof NativeLruCache>

  constructor(capacity: number = 200) {
    this.rust = new NativeLruCache(capacity)
  }

  get(key: string): V | undefined {
    const result = this.rust.get(key)
    if (result === undefined) return undefined
    return JSON.parse(result[0]) as V
  }

  set(key: string, value: V): void {
    this.rust.set(key, [JSON.stringify(value)])
  }

  has(key: string): boolean {
    return this.rust.has(key)
  }

  delete(key: string): boolean {
    return this.rust.delete(key)
  }

  clear(): void {
    this.rust.clear()
  }

  get size(): number {
    return this.rust.len()
  }

  get isEmpty(): boolean {
    return this.rust.is_empty()
  }

  keys(): string[] {
    return this.rust.keys()
  }

  values(): V[] {
    return this.rust.values().map(v => JSON.parse(v[0]) as V)
  }

  get capacity(): number {
    return this.rust.capacity()
  }
}
