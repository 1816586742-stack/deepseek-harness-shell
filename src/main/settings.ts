import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

export interface ShellSettings {
  launchAtLogin: boolean
  language: 'system' | 'zh' | 'en'
}

const DEFAULTS: ShellSettings = {
  launchAtLogin: false,
  language: 'system',
}

function getSettingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

let cached: ShellSettings | null = null

export function loadSettings(): ShellSettings {
  if (cached) return cached
  const path = getSettingsPath()
  if (existsSync(path)) {
    try {
      cached = { ...DEFAULTS, ...JSON.parse(readFileSync(path, 'utf-8')) }
      return cached!
    } catch {
      // Corrupted file — use defaults
    }
  }
  cached = { ...DEFAULTS }
  return cached!
}

export function saveSettings(settings: ShellSettings): void {
  cached = settings
  writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2), 'utf-8')
  applySettings(settings)
}

export function applySettings(settings: ShellSettings): void {
  // Launch at login
  const current = app.getLoginItemSettings()
  if (current.openAtLogin !== settings.launchAtLogin) {
    app.setLoginItemSettings({
      openAtLogin: settings.launchAtLogin,
      openAsHidden: true,
    })
  }

  // Language: write to dsh's settings.yaml when forced
  if (settings.language !== 'system') {
    writeDshLocale(settings.language)
  }
}

/** Write locale.preference to dsh's $DSH_HOME/settings.yaml. */
function writeDshLocale(lang: 'zh' | 'en'): void {
  const dshHome = join(homedir(), '.dsh')
  const settingsPath = join(dshHome, 'settings.yaml')

  try {
    mkdirSync(dshHome, { recursive: true })

    let content = ''
    if (existsSync(settingsPath)) {
      content = readFileSync(settingsPath, 'utf-8')
    }

    // Simple YAML patch: replace or append locale.preference line
    const localeLine = `locale:\n  preference: ${lang}`
    const localeRegex = /^locale:\n  preference:.*$/m

    if (localeRegex.test(content)) {
      content = content.replace(localeRegex, localeLine)
    } else {
      content = content.trimEnd() + '\n\n' + localeLine + '\n'
    }

    writeFileSync(settingsPath, content, 'utf-8')
  } catch {
    // Non-fatal — dsh will fall back to navigator.language
  }
}

/** Initialize settings on app start — apply persisted values. */
export function initSettings(): void {
  applySettings(loadSettings())
}
