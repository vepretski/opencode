import type { ChildProcessWithoutNullStreams } from "child_process"
import { Process } from "@/util/process"
import * as Log from "@opencode-ai/core/util/log"

const log = Log.create({ service: "lsp.launch" })

type Child = Process.Child & ChildProcessWithoutNullStreams

export function spawn(cmd: string, args: string[], opts?: Process.Options): Child
export function spawn(cmd: string, opts?: Process.Options): Child
export function spawn(cmd: string, argsOrOpts?: string[] | Process.Options, opts?: Process.Options) {
  const args = Array.isArray(argsOrOpts) ? [...argsOrOpts] : []
  const cfg = Array.isArray(argsOrOpts) ? opts : argsOrOpts
  const proc = Process.spawn([cmd, ...args], {
    ...cfg,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  }) as Child

  if (!proc.stdin || !proc.stdout || !proc.stderr) throw new Error("Process output not available")

  // Log unexpected exits for debugging
  proc.on("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      log.warn("LSP process exited with error", { cmd, code, signal, pid: proc.pid })
    }
  })
  proc.on("error", (err) => {
    log.error("LSP process error", { cmd, error: err.message, pid: proc.pid })
  })

  return proc
}
