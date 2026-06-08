// Rust-backed AsyncQueue with capacity limit and drop-oldest behavior
// This replaces the original unbounded queue that caused 187GB RSS

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Try to load native module, fall back to pure JS if not available
let NativeAsyncQueue: any
try {
  const native = require('../../../opencode-native/opencode-native.node')
  NativeAsyncQueue = native.NativeAsyncQueue
} catch {
  // Fallback to pure JS implementation (original behavior)
  NativeAsyncQueue = null
}

export class AsyncQueue<T> implements AsyncIterable<T> {
  private rust: any
  private queue: T[] = []
  private resolvers: ((value: T) => void)[] = []
  private closed = false
  private capacity: number

  constructor(capacity: number = 1024) {
    this.capacity = capacity
    if (NativeAsyncQueue) {
      this.rust = new NativeAsyncQueue(capacity)
    }
  }

  push(item: T): boolean {
    if (this.closed) return false

    if (this.rust) {
      return this.rust.push(JSON.stringify(item))
    }

    // Fallback to original behavior
    const resolve = this.resolvers.shift()
    if (resolve) resolve(item)
    else {
      // Apply capacity limit in fallback mode too
      if (this.queue.length >= this.capacity) {
        this.queue.shift() // Drop oldest
      }
      this.queue.push(item)
    }
    return true
  }

  async next(): Promise<T> {
    if (this.rust) {
      const result = this.rust.next()
      if (result === '') {
        // Queue is closed, return a promise that never resolves (like original)
        return new Promise<T>(() => {})
      }
      return JSON.parse(result) as T
    }

    // Fallback to original behavior
    if (this.queue.length > 0) return this.queue.shift()!
    return new Promise((resolve) => this.resolvers.push(resolve))
  }

  async *[Symbol.asyncIterator]() {
    if (this.rust) {
      while (true) {
        const result = await this.rust.next()
        if (result === '') return // Queue closed
        yield JSON.parse(result) as T
      }
    }

    // Fallback to original behavior
    while (true) yield await this.next()
  }

  close(): void {
    this.closed = true
    if (this.rust) {
      this.rust.close()
    }
  }

  drain(): number {
    if (this.rust) {
      return this.rust.drain()
    }
    const len = this.queue.length
    this.queue = []
    return len
  }

  get length(): number {
    if (this.rust) {
      return this.rust.len()
    }
    return this.queue.length
  }

  get isEmpty(): boolean {
    if (this.rust) {
      return this.rust.is_empty()
    }
    return this.queue.length === 0
  }

  get isClosed(): boolean {
    return this.closed
  }

  get capacityValue(): number {
    return this.capacity
  }
}

export async function work<T>(concurrency: number, items: T[], fn: (item: T) => Promise<void>) {
  const pending = [...items]
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (true) {
        const item = pending.pop()
        if (item === undefined) return
        await fn(item)
      }
    }),
  )
}
