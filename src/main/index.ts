import { app, BrowserWindow, dialog } from 'electron'
import { join } from 'node:path'
import { PRODUCT_NAME } from './app-info'
import { spawnDsh, DshProcess } from './dsh-process'
import { createTray, destroyTray, getTray } from './tray'
import { registerSettingsIpc } from './settings-window'
import { initSettings } from './settings'

let mainWindow: BrowserWindow | null = null
let dsh: DshProcess | null = null
let isQuitting = false

function getAppRoot(): string {
  return join(import.meta.dirname, '..', '..')
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: PRODUCT_NAME,
    autoHideMenuBar: true,
    show: false,
  })

  win.on('close', (event) => {
    // On macOS and when tray is active: hide instead of close
    if (!isQuitting) {
      event.preventDefault()
      win.hide()
    }
  })

  win.on('closed', () => {
    mainWindow = null
  })

  return win
}

async function startDshAndLoad(): Promise<void> {
  mainWindow = createWindow()

  try {
    dsh = await spawnDsh({ appRoot: getAppRoot() })
  } catch (err: any) {
    dialog.showErrorBox(
      'DSH Shell — 启动失败',
      `无法启动 DeepSeek Harness:\n\n${err.message}\n\n请确认已运行 npm install。`
    )
    app.quit()
    return
  }

  if (mainWindow && dsh.url) {
    void mainWindow.loadURL(dsh.url)
    mainWindow.show()
  }

  // Create tray after window is ready
  createTray(mainWindow, () => {
    isQuitting = true
    dsh?.kill()
    app.quit()
  })

  dsh.on('exit', (code: number | null) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showErrorBox(
        'DSH Shell — 进程退出',
        `DeepSeek Harness 进程意外退出 (code=${code})。\n应用将关闭。`
      )
    }
    isQuitting = true
    app.quit()
  })
}

// ── Single instance lock ──────────────────────────────────────────────
const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  // Another instance is already running — quit
  app.quit()
} else {
  app.on('second-instance', () => {
    // A second instance tried to start — focus the existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    registerSettingsIpc()
    initSettings()
    void startDshAndLoad()

    app.on('activate', () => {
      if (mainWindow === null) {
        void startDshAndLoad()
      } else {
        mainWindow.show()
      }
    })
  })

  app.on('window-all-closed', () => {
    // Keep the app alive — tray handles visibility
  })

  app.on('before-quit', () => {
    isQuitting = true
    dsh?.kill()
    destroyTray()
  })
}
