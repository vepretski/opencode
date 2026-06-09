// Rust-backed AsyncQueue with capacity limit and drop-oldest behavior
// This replaces the original unbounded queue that caused 187GB RSS

import { NativeAsyncQueue } from "./native"

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

  async next(): Promise<T | undefined> {
    if (this.rust) {
      const result = await this.rust.next()
      if (result === '') {
        return undefined // Queue closed
      }
      try {
        return JSON.parse(result) as T
      } catch {
        return undefined
      }
    }

    // Fallback to original behavior
    if (this.closed) return undefined
    if (this.queue.length > 0) return this.queue.shift()!
    return new Promise((resolve) => {
      if (this.closed) { resolve(undefined); return }
      this.resolvers.push(resolve)
    })
  }

  async *[Symbol.asyncIterator]() {
    while (!this.closed) {
      const item = await this.next()
      if (item === undefined) return
      yield item
    }
  }

  close(): void {
    this.closed = true
    if (this.rust) {
      this.rust.close()
    }
    // Wake up any pending consumers so they can exit
    for (const resolve of this.resolvers) {
      resolve(undefined as any)
    }
    this.resolvers.length = 0
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
