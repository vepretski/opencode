use napi_derive::napi;

const CHARS_PER_TOKEN: f64 = 4.0;

/// Estimate token count from input string length.
/// This is a naive character-count estimator (4 chars per token).
#[napi]
pub fn token_estimate(input: String) -> u32 {
    let len = input.chars().count() as f64;
    (len / CHARS_PER_TOKEN).round().max(0.0) as u32
}

/// Estimate tokens for multiple strings without creating intermediate JS arrays.
/// Returns total estimated token count.
#[napi]
pub fn token_estimate_batch(inputs: Vec<String>) -> u32 {
    let mut total: f64 = 0.0;
    for input in &inputs {
        total += input.chars().count() as f64;
    }
    (total / CHARS_PER_TOKEN).round().max(0.0) as u32
}

/// Estimate tokens for a JSON-serialized string without the JS JSON.stringify step.
/// Counts characters directly in the serialized form.
#[napi]
pub fn token_estimate_json(json_string: String) -> u32 {
    let len = json_string.len() as f64;
    (len / CHARS_PER_TOKEN).round().max(0.0) as u32
}
