use napi_derive::napi;
use rand::Rng;
use std::sync::Mutex;

const BASE62_CHARS: &[u8; 62] = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const RANDOM_LENGTH: usize = 14; // 26 - 12 (3 prefix + underscore + 6 hex + 2 padding)

struct IdState {
    last_timestamp: u64,
    counter: u32,
}

static STATE: Mutex<IdState> = Mutex::new(IdState {
    last_timestamp: 0,
    counter: 0,
});

fn random_base62(length: usize) -> String {
    let mut rng = rand::thread_rng();
    let mut result = String::with_capacity(length);
    for _ in 0..length {
        let idx = rng.gen_range(0..62);
        result.push(BASE62_CHARS[idx] as char);
    }
    result
}

fn encode_timestamp(ts: u64, counter: u32, descending: bool) -> String {
    let mut value = ts * 0x1000 + counter as u64;
    if descending {
        value = !value;
    }

    let mut hex = String::with_capacity(12);
    for i in 0..6 {
        let byte = (value >> (40 - 8 * i)) & 0xff;
        hex.push_str(&format!("{:02x}", byte));
    }
    hex
}

#[napi]
pub fn id_create(prefix: String, direction: String, timestamp: Option<f64>) -> String {
    let current_timestamp = timestamp.map(|t| t as u64).unwrap_or_else(|| {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64
    });

    let mut state = STATE.lock().unwrap();
    if current_timestamp != state.last_timestamp {
        state.last_timestamp = current_timestamp;
        state.counter = 0;
    }
    state.counter += 1;
    let counter = state.counter;
    drop(state);

    let descending = direction == "descending";
    let time_hex = encode_timestamp(current_timestamp, counter, descending);
    let random = random_base62(RANDOM_LENGTH);

    format!("{}_{}{}", prefix, time_hex, random)
}

#[napi]
pub fn id_timestamp(id: String) -> f64 {
    let underscore_pos = id.find('_').unwrap_or(0);
    let hex_start = underscore_pos + 1;
    let hex_end = hex_start + 12;

    if hex_end > id.len() {
        return 0.0;
    }

    let hex_str = &id[hex_start..hex_end];
    let encoded = u64::from_str_radix(hex_str, 16).unwrap_or(0);
    (encoded / 0x1000) as f64
}

#[napi]
pub fn id_ascending(prefix: String, given: Option<String>) -> String {
    let prefix_str = match prefix.as_str() {
        "job" => "job",
        "event" => "evt",
        "session" => "ses",
        "message" => "msg",
        "permission" => "per",
        "question" => "que",
        "part" => "prt",
        "pty" => "pty",
        "tool" => "tool",
        "workspace" => "wrk",
        _ => &prefix,
    };

    match given {
        Some(id) => {
            if !id.starts_with(prefix_str) {
                panic!("ID {} does not start with {}", id, prefix_str);
            }
            id
        }
        None => id_create(prefix_str.to_string(), "ascending".to_string(), None),
    }
}

#[napi]
pub fn id_descending(prefix: String, given: Option<String>) -> String {
    let prefix_str = match prefix.as_str() {
        "job" => "job",
        "event" => "evt",
        "session" => "ses",
        "message" => "msg",
        "permission" => "per",
        "question" => "que",
        "part" => "prt",
        "pty" => "pty",
        "tool" => "tool",
        "workspace" => "wrk",
        _ => &prefix,
    };

    match given {
        Some(id) => {
            if !id.starts_with(prefix_str) {
                panic!("ID {} does not start with {}", id, prefix_str);
            }
            id
        }
        None => id_create(prefix_str.to_string(), "descending".to_string(), None),
    }
}
