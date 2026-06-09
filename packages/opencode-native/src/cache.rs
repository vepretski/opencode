use napi_derive::napi;
use lru::LruCache;
use std::num::NonZeroUsize;

/// Native LRU cache for LSP diagnostics with bounded capacity.
#[napi]
pub struct NativeLruCache {
    cache: LruCache<String, Vec<String>>,
}

#[napi]
impl NativeLruCache {
    #[napi(constructor)]
    pub fn new(capacity: Option<u32>) -> Self {
        let cap = capacity.unwrap_or(200) as usize;
        let non_zero_cap = NonZeroUsize::new(cap).unwrap_or(NonZeroUsize::new(200).unwrap());
        Self {
            cache: LruCache::new(non_zero_cap),
        }
    }

    #[napi]
    pub fn get(&mut self, key: String) -> Option<Vec<String>> {
        self.cache.get(&key).cloned()
    }

    #[napi]
    pub fn get_first(&mut self, key: String) -> Option<String> {
        self.cache.get(&key).and_then(|v| v.first().cloned())
    }

    #[napi]
    pub fn has(&self, key: String) -> bool {
        self.cache.contains(&key)
    }

    #[napi]
    pub fn set(&mut self, key: String, value: Vec<String>) {
        self.cache.put(key, value);
    }

    #[napi]
    pub fn delete(&mut self, key: String) -> bool {
        self.cache.pop(&key).is_some()
    }

    #[napi]
    pub fn clear(&mut self) {
        self.cache.clear();
    }

    #[napi]
    pub fn len(&self) -> u32 {
        self.cache.len() as u32
    }

    #[napi]
    pub fn is_empty(&self) -> bool {
        self.cache.is_empty()
    }

    #[napi]
    pub fn keys(&self) -> Vec<String> {
        self.cache.iter().map(|(k, _)| k.clone()).collect()
    }

    #[napi]
    pub fn values(&self) -> Vec<Vec<String>> {
        self.cache.iter().map(|(_, v)| v.clone()).collect()
    }

    #[napi]
    pub fn capacity(&self) -> u32 {
        self.cache.cap().get() as u32
    }
}
