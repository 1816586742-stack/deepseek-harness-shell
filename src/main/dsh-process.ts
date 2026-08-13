import { ChildProcess, spawn, execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { EventEmitter } from 'node:events'

/** The regex that matches dsh's readiness line: "dsh web: http://127.0.0.1:<port>" */
const READY_LINE_RE = /^dsh web: (https?:\/\/\S+)$/m

/** Locate the dsh CLI entry point inside node_modules. */
function findDshEntry(appRoot: string): string {
  // In dev, appRoot is the project root; in production, it's the app.asar unpacked dir.
  const candidates = [
    join(appRoot, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js'),
    join(appRoot, 'node_modules', '.bin', 'dsh'),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  throw new Error(
    `Cannot find @deepseek-ai/dsh entry point. Tried:\n${candidates.map(c => '  - ' + c).join('\n')}\nRun "npm install" first.`
  )
}

export interface DshProcess extends EventEmitter {
  /** The URL to load in the BrowserWindow once the host is ready. */
  url: string | null
  /** The underlying child process handle. */
  process: ChildProcess
  /** Kill the process tree. Call on app quit. */
  kill(): void
}

export interface SpawnOptions {
  /** Project root (where node_modules lives). */
  appRoot: string
  /** Optional extra CLI args to pass after "web". */
  extraArgs?: string[]
}

/**
 * Spawn the dsh web server and resolve with its ready URL once the readiness line
 * is printed to stdout. Rejects if dsh exits before printing the line.
 */
export function spawnDsh(options: SpawnOptions): Promise<DshProcess> {
  return new Promise((resolve, reject) => {
    const entry = findDshEntry(options.appRoot)

    // --expose-internals is required by the cordis HMR plugin
    const args = ['--expose-internals', entry, 'web', '--port', '0', ...(options.extraArgs ?? [])]

    const child = spawn(process.execPath, args, {
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const emitter = new EventEmitter() as DshProcess
    emitter.process = child
    emitter.url = null

    let resolved = false
    let stdoutBuf = ''

    child.stdout!.on('data', (chunk: Buffer) => {
      const text = chunk.toString()
      process.stdout.write('[dsh] ' + text)

      if (!resolved) {
        stdoutBuf += text
        const match = READY_LINE_RE.exec(stdoutBuf)
        if (match) {
          resolved = true
          emitter.url = match[1]
          emitter.emit('ready', match[1])
          resolve(emitter)
        }
      }
    })

    child.stderr!.on('data', (chunk: Buffer) => {
      process.stderr.write('[dsh:err] ' + chunk.toString())
    })

    child.on('error', (err) => {
      if (!resolved) {
        resolved = true
        reject(new Error(`Failed to spawn dsh: ${err.message}`))
      }
    })

    child.on('exit', (code, signal) => {
      if (!resolved) {
        resolved = true
        reject(
          new Error(
            `dsh exited before printing ready line (code=${code}, signal=${signal})`
          )
        )
      }
      emitter.emit('exit', code, signal)
    })

    // Kill method: kill the whole process tree
    emitter.kill = () => {
      if (!child.killed) {
        if (process.platform === 'win32') {
          // Windows: use taskkill to kill the process tree
          try {
            execFileSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
              stdio: 'ignore',
            })
          } catch {
            // Process may have already exited
            child.kill('SIGKILL')
          }
        } else {
          // POSIX: kill the process group
          try {
            process.kill(-child.pid!, 'SIGTERM')
          } catch {
            child.kill('SIGTERM')
          }
        }
      }
    }
  })
}

/**
 * Parse a dsh readiness line and return the URL, or null if not found.
 * Exported for testing.
 */
export function parseReadyLine(output: string): string | null {
  const match = READY_LINE_RE.exec(output)
  return match ? match[1] : null
}
