use napi_derive::napi;
use std::collections::VecDeque;

#[napi]
pub struct NativeRingBuffer {
    chunks: VecDeque<String>,
    total_bytes: usize,
    capacity: usize,
    cut: bool,
}

#[napi]
impl NativeRingBuffer {
    #[napi(constructor)]
    pub fn new(capacity: Option<u32>) -> Self {
        let cap = capacity.unwrap_or(10 * 1024 * 1024) as usize; // Default 10MB
        Self {
            chunks: VecDeque::new(),
            total_bytes: 0,
            capacity: cap,
            cut: false,
        }
    }

    /// Push a chunk of text to the buffer
    /// Returns true if some data was dropped due to capacity limit
    #[napi]
    pub fn push(&mut self, chunk: String) -> bool {
        let chunk_len = chunk.len();
        self.chunks.push_back(chunk);
        self.total_bytes += chunk_len;

        let mut dropped = false;

        // Drop oldest chunks while over capacity
        while self.total_bytes > self.capacity && self.chunks.len() > 1 {
            if let Some(oldest) = self.chunks.pop_front() {
                self.total_bytes -= oldest.len();
                dropped = true;
                self.cut = true;
            }
        }

        dropped
    }

    /// Get the full content as string
    #[napi]
    pub fn to_string(&self) -> String {
        self.chunks.iter().cloned().collect::<Vec<_>>().join("")
    }

    /// Get the last N bytes of content (for preview)
    #[napi]
    pub fn tail(&self, max_bytes: u32) -> String {
        let max = max_bytes as usize;
        let mut result = String::new();
        let mut bytes = 0;

        // Iterate from newest to oldest
        for chunk in self.chunks.iter().rev() {
            if bytes + chunk.len() > max {
                // Take what we can from this chunk
                let remaining = max - bytes;
                if remaining > 0 {
                    let start = chunk.len().saturating_sub(remaining);
                    result = chunk[start..].to_string() + &result;
                }
                break;
            }
            result = chunk.clone() + &result;
            bytes += chunk.len();
        }

        result
    }

    /// Check if buffer was cut (had to drop data)
    #[napi]
    pub fn is_cut(&self) -> bool {
        self.cut
    }

    /// Get total bytes in buffer
    #[napi]
    pub fn len(&self) -> u32 {
        self.total_bytes as u32
    }

    /// Check if buffer is empty
    #[napi]
    pub fn is_empty(&self) -> bool {
        self.chunks.is_empty()
    }

    /// Clear the buffer
    #[napi]
    pub fn clear(&mut self) {
        self.chunks.clear();
        self.total_bytes = 0;
        self.cut = false;
    }

    /// Get capacity
    #[napi]
    pub fn capacity(&self) -> u32 {
        self.capacity as u32
    }
}
