export * as Otlp from "./otlp"

export function loggers() {
  return []
}

export async function tracingLayer() {
  return Layer.empty
}
