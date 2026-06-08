export function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T> {
  let timer: NodeJS.Timeout
  return new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(label ?? `Operation timed out after ${ms}ms`))
    }, ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}
