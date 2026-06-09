// Shared loader for the Rust native module
// Falls back to null if the native module is not available

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let native: any = null
try {
  native = require('../../../opencode-native/opencode-native.node')
} catch {
  // Native module not available, use JS fallbacks
}

export const NativeAsyncQueue = native?.NativeAsyncQueue ?? null
export const NativeRingBuffer = native?.NativeRingBuffer ?? null
export const NativeLruCache = native?.NativeLruCache ?? null

// ID generation
export const idCreate = native?.id_create ?? null
export const idTimestamp = native?.id_timestamp ?? null
export const idAscending = native?.id_ascending ?? null
export const idDescending = native?.id_descending ?? null

// Token estimation
export const tokenEstimate = native?.token_estimate ?? null
export const tokenEstimateBatch = native?.token_estimate_batch ?? null
export const tokenEstimateJson = native?.token_estimate_json ?? null

// Truncation
export const truncateOutput = native?.truncate_output ?? null
export const textStats = native?.text_stats ?? null

// Wildcard matching
export const wildcardMatch = native?.wildcard_match ?? null
export const wildcardAll = native?.wildcard_all ?? null
export const wildcardAllStructured = native?.wildcard_all_structured ?? null

// Diagnostics
export const dedupeDiagnostics = native?.dedupe_diagnostics ?? null
export const mergeDiagnosticsNative = native?.merge_diagnostics ?? null
