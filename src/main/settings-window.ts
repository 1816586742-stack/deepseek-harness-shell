import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { PRODUCT_NAME } from './app-info'
import { loadSettings, saveSettings, ShellSettings } from './settings'

let settingsWindow: BrowserWindow | null = null

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 320,
    title: PRODUCT_NAME + ' — 设置',
    resizable: false,
    autoHideMenuBar: true,
    parent: undefined, // no parent — independent window
    webPreferences: {
      preload: join(import.meta.dirname, '..', 'preload', 'index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    void settingsWindow.loadURL(devUrl + '/settings.html')
  } else {
    void settingsWindow.loadFile(join(import.meta.dirname, '..', 'renderer', 'settings.html'))
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

// ── IPC handlers for settings window ────────────────────────────────
export function registerSettingsIpc(): void {
  ipcMain.handle('settings:get', () => {
    return loadSettings()
  })

  ipcMain.handle('settings:set', (_event, settings: ShellSettings) => {
    saveSettings(settings)
    return settings
  })
}
