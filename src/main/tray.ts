import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { PRODUCT_NAME } from './app-info'
import { openSettingsWindow } from './settings-window'

/** Resolve the tray icon path — prefers 16x16 for tray, falls back to app icon. */
function getTrayIconPath(): string {
  const candidates = [
    join(import.meta.dirname, '..', '..', 'build', 'tray-icon.png'),
    join(import.meta.dirname, '..', '..', 'build', 'icon.png'),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  // Last resort: use the built-in app icon
  return join(import.meta.dirname, '..', '..', 'build', 'icon.png')
}

let tray: Tray | null = null

export function getTray(): Tray | null {
  return tray
}

export function createTray(mainWindow: BrowserWindow, onQuit: () => void): void {
  const iconPath = getTrayIconPath()
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip(PRODUCT_NAME)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      },
    },
    {
      label: '设置',
      click: () => {
        openSettingsWindow()
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        onQuit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  // Double-click tray icon to open window
  tray.on('double-click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

export function destroyTray(): void {
  if (tray && !tray.isDestroyed()) {
    tray.destroy()
    tray = null
  }
}
