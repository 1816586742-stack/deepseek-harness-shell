import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

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
}

/** Initialize settings on app start — apply persisted values. */
export function initSettings(): void {
  applySettings(loadSettings())
}
