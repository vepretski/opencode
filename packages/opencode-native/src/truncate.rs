use napi_derive::napi;
use serde::Serialize;

#[derive(Serialize, Clone)]
#[napi(object)]
pub struct TruncateResult {
    pub lines: Vec<String>,
    pub total_lines: u32,
    pub total_bytes: u32,
    pub truncated_lines: u32,
    pub truncated_bytes: u32,
    pub hit_bytes: bool,
}

#[derive(Serialize, Clone)]
#[napi(object)]
pub struct TextStats {
    pub lines: u32,
    pub bytes: u32,
}

/// Truncate tool output to fit within line and byte limits.
/// Returns the truncated lines along with metadata about what was removed.
#[napi]
pub fn truncate_output(
    text: String,
    max_lines: u32,
    max_bytes: u32,
    direction: String,
) -> TruncateResult {
    let total_bytes = text.len() as u32;
    let lines: Vec<&str> = text.lines().collect();
    let total_lines = lines.len() as u32;

    // Check if truncation is needed
    if total_lines <= max_lines && total_bytes <= max_bytes {
        return TruncateResult {
            lines: lines.into_iter().map(|s| s.to_string()).collect(),
            total_lines,
            total_bytes,
            truncated_lines: 0,
            truncated_bytes: 0,
            hit_bytes: false,
        };
    }

    let mut out: Vec<String> = Vec::new();
    let mut bytes: u32 = 0;
    let mut hit_bytes = false;

    if direction == "head" {
        for (i, line) in lines.iter().enumerate() {
            if i as u32 >= max_lines {
                break;
            }
            let line_bytes = line.len() as u32;
            let size = line_bytes + if i > 0 { 1 } else { 0 }; // +1 for newline
            if bytes + size > max_bytes {
                hit_bytes = true;
                break;
            }
            out.push(line.to_string());
            bytes += size;
        }
    } else {
        // tail direction
        let mut collected: Vec<String> = Vec::new();
        for line in lines.iter().rev() {
            if collected.len() as u32 >= max_lines {
                break;
            }
            let line_bytes = line.len() as u32;
            let size = line_bytes + if !collected.is_empty() { 1 } else { 0 };
            if bytes + size > max_bytes {
                hit_bytes = true;
                break;
            }
            collected.push(line.to_string());
            bytes += size;
        }
        collected.reverse();
        out = collected;
    }

    let removed_bytes = if hit_bytes {
        total_bytes - bytes
    } else {
        0
    };
    let removed_lines = if !hit_bytes {
        total_lines - out.len() as u32
    } else {
        0
    };

    TruncateResult {
        lines: out,
        total_lines,
        total_bytes,
        truncated_lines: removed_lines,
        truncated_bytes: removed_bytes,
        hit_bytes,
    }
}

/// Count lines and bytes in text without splitting into JS arrays.
#[napi]
pub fn text_stats(text: String) -> TextStats {
    let lines = text.lines().count() as u32;
    let bytes = text.len() as u32;
    TextStats { lines, bytes }
}
