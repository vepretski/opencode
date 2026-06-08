# OpenCode-Rustified

Performance-optimized fork of [OpenCode](https://github.com/anomalyco/opencode) with critical components rewritten in Rust via [NAPI-RS](https://napi.rs).

<img width="432" height="59" alt="Taskmgr_BcUquSbFSi" src="https://github.com/user-attachments/assets/75d4e8ed-8243-4b11-9ffe-9e4e60391cb9" />


> **Problem:** OpenCode suffered from unbounded memory growth (187GB RSS), O(n²) string concatenation, uncontrolled LSP diagnostics maps, and MaxListenersExceeded warnings during intensive sessions.

> **Solution:** Three performance-critical components rewritten in Rust — AsyncQueue, RingBuffer, and LRU Cache — while maintaining full compatibility with the original OpenCode ecosystem.

## What Changed

### Rust-backed Components

| Component | Before (TypeScript) | After (Rust) |
|-----------|---------------------|--------------|
| AsyncQueue | Unbounded array, O(n²) concat | Fixed capacity (1024), drop-oldest policy |
| RingBuffer | String concatenation for bash output | 10MB ring buffer with zero-copy |
| LRU Cache | Unbounded Map for LSP diagnostics | 200-entry LRU with automatic eviction |

### Performance Improvements

- **Memory:** RSS capped instead of unbounded growth
- **CPU:** Rust-native data structures eliminate JS garbage collector pressure
- **LSP:** Bounded diagnostics cache prevents memory leaks from language servers
- **Bash/PTY:** Ring buffer prevents output accumulation in long-running sessions

### Bug Fixes (upstream)

| Category | Fix | Files |
|----------|-----|-------|
| **FATAL** | Missing `realpathSync` import — crash on every dev startup | `util/filesystem.ts` |
| **OAuth race** | Concurrent OAuth flows overwrite single `pendingOAuth` variable | `plugin/xai.ts`, `plugin/digitalocean.ts`, `plugin/openai/codex.ts` |
| **Double resume** | `Effect.callback` in MCP browser-open can fire `resume()` twice | `mcp/index.ts` |
| **Memory leak** | RPC pending Map never cleaned on worker death | `util/rpc.ts` |
| **Timer leak** | `withTimeout` doesn't clear timer on rejection | `util/timeout.ts` |
| **Logic bug** | `body.error \|\| body.error?.message` — second operand unreachable | `provider/error.ts` |
| **Swallowed errors** | Empty `catch {}` blocks hide parse failures | `mcp/index.ts`, `session/message-v2.ts` |
| **Log level** | Copilot 403 logged as error instead of warning | `plugin/github-copilot/copilot.ts` |

### Optimizations (upstream)

| What | Before | After | File |
|------|--------|-------|------|
| Levenshtein distance | O(n×m) full matrix | O(m) two-row | `tool/edit.ts` |
| Config substitution | O(n²) string `+=` | Array + `join()` | `config/variable.ts` |
| Doom loop detection | `JSON.stringify` per delta | Cached `inputJson` | `session/processor.ts` |
| Prompt comparison | Double encode + stringify | Early return + single stringify | `core/session/input.ts` |
| Git cache refresh | 4 sequential subprocesses | `Effect.all()` parallel | `reference/repository-cache.ts` |
| Plugin `as any` casts | Untyped hook dispatch | Proper `Hooks` type narrowing | `plugin/index.ts` |

## Installation

### Windows (Global Command)

```powershell
# Clone the repository
git clone https://github.com/discoart/opencode-rustified.git
cd opencode-rustified

# Install dependencies
bun install

# Build Rust native module
cd packages/opencode-native
cargo build --release

# Copy the built module
copy target\release\opencode_native.dll ..\opencode-native.node

# Create global command (requires npm global directory in PATH)
# The opencode-rs.cmd file is already configured for Windows
```

### Linux/macOS

```bash
git clone https://github.com/discoart/opencode-rustified.git
cd opencode-rustified
bun install

cd packages/opencode-native
cargo build --release
cp target/release/libopencode_native.so ../opencode-native.node  # Linux
# cp target/release/libopencode_native.dylib ../opencode-native.node  # macOS
```

## Usage

### Running the Fork

```bash
# From the repository directory
bun run --cwd packages/opencode --conditions=browser src/index.ts

# Or use the global command (Windows)
opencode-rs

# With arguments
opencode-rs --help
opencode-rs --version
opencode-rs /path/to/project
```

### Global Command Setup (Windows)

Create a batch file in a directory that's in your PATH:

```batch
@ECHO off
SETLOCAL
SET PROJECT=C:\path\to\opencode-rustified
SET OPENCODE_VERSION=1.16.2-rustified
SET OPENCODE_DISABLE_CHANNEL_DB=true
SET NODE_PATH=%PROJECT%\packages\opencode\node_modules;%PROJECT%\node_modules
"%USERPROFILE%\.bun\bin\bun.exe" run --conditions=browser "%PROJECT%\packages\opencode\src\index.ts" %*
```

Save as `opencode-rs.cmd` in `%APPDATA%\npm` or any directory in your PATH.

### Key Features

- **Identical behavior** to original OpenCode — same UI, same commands, same configuration
- **Shared sessions** — uses the same database (`opencode.db`) as the original
- **Plugin compatible** — all existing plugins work without modification
- **Project aware** — opens in the current working directory, not the fork location
- **Graceful fallback** — if Rust module fails to load, automatically falls back to JavaScript

## How It Works

### Architecture

```
opencode-rs
├── packages/opencode/          # Original OpenCode source (modified)
│   ├── src/util/queue.ts       # Rust-backed AsyncQueue
│   └── src/index.ts            # Signal handlers added
├── packages/opencode-native/   # Rust NAPI-RS module
│   ├── src/queue.rs            # NativeAsyncQueue
│   ├── src/buffer.rs           # NativeRingBuffer
│   └── src/cache.rs            # NativeLruCache
└── .github/workflows/          # CI/CD pipeline
    └── build-windows.yml       # Automated builds
```

### Data Flow

```
User Input → OpenCode CLI → TypeScript Layer → Rust NAPI-RS → Native Data Structures
                                              ↓
                                    Same database as original opencode
                                    Same plugins, sessions, projects
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `OPENCODE_VERSION` | Version string display | `"local"` |
| `OPENCODE_DISABLE_CHANNEL_DB` | Use main database file | `false` |
| `OPENCODE_CHANNEL` | Build channel (compile-time) | `"local"` |
| `NODE_PATH` | Module resolution paths | System default |

## Development

### Building the Rust Module

```bash
cd packages/opencode-native

# Development build
cargo build

# Release build (optimized)
cargo build --release

# Run tests
cargo test

# Build with NAPI
npx napi build --release
```

### Testing

```bash
# Run OpenCode tests
cd packages/opencode
bun test

# Run Rust module tests
cd packages/opencode-native
cargo test
```

### Project Structure

- **packages/opencode-native/** — Rust source code for NAPI-RS module
- **packages/opencode/** — Modified OpenCode source (TypeScript)
- **packages/core/** — Shared core utilities
- **packages/tui/** — Terminal UI components
- **packages/server/** — HTTP API server

## Troubleshooting

### Module Not Found

If you see "Cannot find module" errors:

```bash
# Ensure NODE_PATH is set correctly
SET NODE_PATH=C:\path\to\opencode-rustified\packages\opencode\node_modules;C:\path\to\opencode-rustified\node_modules

# Or reinstall dependencies
bun install
```

### Sessions Not Loading

Ensure `OPENCODE_DISABLE_CHANNEL_DB=true` is set in your environment or batch file. This forces the fork to use the same `opencode.db` file as the original.

### Wrong Working Directory

If `opencode-rs` opens in the wrong directory, remove any `--cwd` flags from your batch file. The fork should preserve your current working directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun test` and `cargo test`
5. Submit a pull request

## License

MIT License — same as original OpenCode.

## Credits

- [OpenCode](https://github.com/anomalyco/opencode) — Original project
- [NAPI-RS](https://napi.rs) — Rust bindings for Node.js
- [Bun](https://bun.sh) — JavaScript runtime

---

**Performance issues with OpenCode?** This fork resolves memory leaks and performance degradation during long sessions. Use `opencode-rs` as a drop-in replacement.
