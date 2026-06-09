use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::collections::VecDeque;
use std::sync::{Arc, Mutex};

/// Native async queue with capacity limit and drop-oldest behavior.
/// Items are passed as JSON strings to avoid serialization overhead at the boundary.
#[napi]
pub struct NativeAsyncQueue {
    inner: Arc<Mutex<QueueInner>>,
}

struct QueueInner {
    queue: VecDeque<String>,
    resolvers: VecDeque<tokio::sync::oneshot::Sender<String>>,
    capacity: usize,
    closed: bool,
}

#[napi]
impl NativeAsyncQueue {
    #[napi(constructor)]
    pub fn new(capacity: Option<u32>) -> Self {
        let cap = capacity.unwrap_or(1024) as usize;
        Self {
            inner: Arc::new(Mutex::new(QueueInner {
                queue: VecDeque::with_capacity(cap),
                resolvers: VecDeque::new(),
                capacity: cap,
                closed: false,
            })),
        }
    }

    #[napi]
    pub fn push(&self, item: String) -> bool {
        let mut inner = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        if inner.closed {
            return false;
        }

        if let Some(resolver) = inner.resolvers.pop_front() {
            let _ = resolver.send(item);
            return true;
        }

        if inner.queue.len() >= inner.capacity {
            inner.queue.pop_front();
        }

        inner.queue.push_back(item);
        true
    }

    #[napi]
    pub fn close(&self) {
        let mut inner = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        inner.closed = true;
        while let Some(_resolver) = inner.resolvers.pop_front() {}
    }

    #[napi]
    pub fn drain(&self) -> u32 {
        let mut inner = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        let len = inner.queue.len() as u32;
        inner.queue.clear();
        len
    }

    #[napi]
    pub fn len(&self) -> u32 {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).queue.len() as u32
    }

    #[napi]
    pub fn is_empty(&self) -> bool {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).queue.is_empty()
    }

    #[napi]
    pub fn is_closed(&self) -> bool {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).closed
    }

    #[napi]
    pub fn capacity(&self) -> u32 {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).capacity as u32
    }

    #[napi]
    pub async fn next(&self) -> Result<String> {
        let rx = {
            let mut inner = self.inner.lock().unwrap_or_else(|e| e.into_inner());

            if let Some(item) = inner.queue.pop_front() {
                return Ok(item);
            }

            if inner.closed {
                return Ok(String::new());
            }

            let (tx, rx) = tokio::sync::oneshot::channel();
            inner.resolvers.push_back(tx);
            rx
        };

        match rx.await {
            Ok(item) => Ok(item),
            Err(_) => Ok(String::new()),
        }
    }

    #[napi]
    pub fn drain_all(&self) -> Vec<String> {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).queue.drain(..).collect()
    }
}
