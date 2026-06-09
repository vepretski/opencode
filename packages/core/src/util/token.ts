import { tokenEstimate as rustEstimate, tokenEstimateBatch as rustEstimateBatch, tokenEstimateJson as rustEstimateJson } from "../util/native"

export * as Token from "./token"

const CHARS_PER_TOKEN = 4

export const estimate = (input: string) => {
  if (rustEstimate) {
    return rustEstimate(input)
  }
  return Math.max(0, Math.round(input.length / CHARS_PER_TOKEN))
}

export const estimateBatch = (inputs: string[]) => {
  if (rustEstimateBatch) {
    return rustEstimateBatch(inputs)
  }
  let total = 0
  for (const input of inputs) {
    total += input.length
  }
  return Math.max(0, Math.round(total / CHARS_PER_TOKEN))
}

export const estimateJson = (jsonString: string) => {
  if (rustEstimateJson) {
    return rustEstimateJson(jsonString)
  }
  return Math.max(0, Math.round(jsonString.length / CHARS_PER_TOKEN))
}
