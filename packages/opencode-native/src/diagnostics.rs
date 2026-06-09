use napi_derive::napi;
use serde::Serialize;
use std::collections::HashSet;

#[derive(Serialize, Clone)]
#[napi(object)]
pub struct DiagnosticRange {
    pub start_line: u32,
    pub start_character: u32,
    pub end_line: u32,
    pub end_character: u32,
}

#[derive(Serialize, Clone)]
#[napi(object)]
pub struct Diagnostic {
    pub code: Option<String>,
    pub severity: Option<u32>,
    pub message: String,
    pub source: Option<String>,
    pub range: DiagnosticRange,
}

fn diagnostic_key(d: &Diagnostic) -> String {
    format!(
        "{}|{}|{}|{}|{}:{}-{}:{}",
        d.code.as_deref().unwrap_or(""),
        d.severity.map(|s| s.to_string()).unwrap_or_default(),
        d.message,
        d.source.as_deref().unwrap_or(""),
        d.range.start_line,
        d.range.start_character,
        d.range.end_line,
        d.range.end_character
    )
}

/// Deduplicate diagnostics by creating a key from their fields.
/// Much faster than JSON.stringify-based dedup in JS.
#[napi]
pub fn dedupe_diagnostics(items: Vec<Diagnostic>) -> Vec<Diagnostic> {
    let mut seen = HashSet::with_capacity(items.len());
    let mut result = Vec::with_capacity(items.len());

    for item in items {
        let key = diagnostic_key(&item);
        if seen.insert(key) {
            result.push(item);
        }
    }

    result
}

/// Merge and deduplicate diagnostics from multiple sources (push + pull).
#[napi]
pub fn merge_diagnostics(
    push_diagnostics: Vec<Diagnostic>,
    pull_diagnostics: Vec<Diagnostic>,
) -> Vec<Diagnostic> {
    let mut all = push_diagnostics;
    all.extend(pull_diagnostics);
    dedupe_diagnostics(all)
}
