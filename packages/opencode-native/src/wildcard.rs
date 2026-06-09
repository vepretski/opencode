use napi_derive::napi;
use regex::Regex;

/// Convert a shell-style wildcard pattern to a regex string.
fn wildcard_to_regex(pattern: &str) -> String {
    let normalized = pattern.replace('\\', "/");
    let mut escaped = String::with_capacity(normalized.len() * 2);

    for c in normalized.chars() {
        match c {
            '.' | '+' | '^' | '$' | '{' | '}' | '(' | ')' | '|' | '[' | ']' | '\\' => {
                escaped.push('\\');
                escaped.push(c);
            }
            '*' => escaped.push_str(".*"),
            '?' => escaped.push('.'),
            _ => escaped.push(c),
        }
    }

    // If pattern ends with " .*", make the trailing part optional
    if escaped.ends_with(" .*") {
        let len = escaped.len();
        escaped.truncate(len - 3);
        escaped.push_str("( .*)?");
    }

    escaped
}

/// Match a string against a shell-style wildcard pattern.
#[napi]
pub fn wildcard_match(str: String, pattern: String, case_insensitive: bool) -> bool {
    let normalized_str = str.replace('\\', "/");
    let regex_pattern = wildcard_to_regex(&pattern);
    let full_pattern = format!("^{}$", regex_pattern);

    let flags = if case_insensitive { "(?si)" } else { "(?s)" };
    let re = match Regex::new(&format!("{}{}", flags, full_pattern)) {
        Ok(r) => r,
        Err(_) => return false,
    };

    re.is_match(&normalized_str)
}

/// Find the best matching value from a pattern dictionary.
/// Patterns are sorted by length (ascending) then alphabetically.
#[napi]
pub fn wildcard_all(input: String, patterns: Vec<(String, String)>) -> Option<String> {
    let mut sorted: Vec<_> = patterns;
    sorted.sort_by(|a, b| {
        a.0.len()
            .cmp(&b.0.len())
            .then_with(|| a.0.cmp(&b.0))
    });

    let mut result: Option<String> = None;
    let case_insensitive = cfg!(windows);

    for (pattern, value) in &sorted {
        if wildcard_match(input.clone(), pattern.clone(), case_insensitive) {
            result = Some(value.clone());
        }
    }

    result
}

/// Match a sequence of items against a sequence of patterns.
/// '*' pattern matches any single item.
fn match_sequence(items: &[String], patterns: &[String]) -> bool {
    if patterns.is_empty() {
        return true;
    }

    let case_insensitive = cfg!(windows);

    if patterns[0] == "*" {
        return match_sequence(items, &patterns[1..]);
    }

    for i in 0..items.len() {
        if wildcard_match(
            items[i].clone(),
            patterns[0].clone(),
            case_insensitive,
        ) && match_sequence(&items[i + 1..], &patterns[1..])
        {
            return true;
        }
    }

    false
}

/// Match structured input (head + tail) against a pattern dictionary.
#[napi]
pub fn wildcard_all_structured(
    head: String,
    tail: Vec<String>,
    patterns: Vec<(String, String)>,
) -> Option<String> {
    let mut sorted: Vec<_> = patterns;
    sorted.sort_by(|a, b| {
        a.0.len()
            .cmp(&b.0.len())
            .then_with(|| a.0.cmp(&b.0))
    });

    let mut result: Option<String> = None;
    let case_insensitive = cfg!(windows);

    for (pattern, value) in &sorted {
        let parts: Vec<&str> = pattern.split_whitespace().collect();
        if parts.is_empty() {
            continue;
        }

        if !wildcard_match(head.clone(), parts[0].to_string(), case_insensitive) {
            continue;
        }

        if parts.len() == 1 {
            result = Some(value.clone());
            continue;
        }

        let tail_patterns: Vec<String> = parts[1..].iter().map(|s| s.to_string()).collect();
        if match_sequence(&tail, &tail_patterns) {
            result = Some(value.clone());
        }
    }

    result
}
