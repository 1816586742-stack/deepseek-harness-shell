import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { PRODUCT_NAME } from './app-info'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: PRODUCT_NAME,
    autoHideMenuBar: true
  })

  // In dev, electron-vite serves the renderer from its dev server.
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    void win.loadURL(devUrl)
  } else {
    void win.loadFile(join(import.meta.dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS: re-create a window when the dock icon is clicked and none is open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Keep the app alive on macOS only; tray behavior arrives in a later ticket.
  if (process.platform !== 'darwin') app.quit()
})
