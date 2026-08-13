import { app, BrowserWindow, dialog } from 'electron'
import { join } from 'node:path'
import { PRODUCT_NAME } from './app-info'
import { spawnDsh, DshProcess } from './dsh-process'

let mainWindow: BrowserWindow | null = null
let dsh: DshProcess | null = null

/** Resolve the project root — in dev it's two levels up from out/main; in prod it's the app root. */
function getAppRoot(): string {
  // electron-vite builds main to out/main/index.js; project root is ../../
  return join(import.meta.dirname, '..', '..')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: PRODUCT_NAME,
    autoHideMenuBar: true,
    show: false, // don't show until dsh is ready
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function startDshAndLoad(): Promise<void> {
  createWindow()

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

  // dsh is ready — load the URL
  if (mainWindow && dsh.url) {
    void mainWindow.loadURL(dsh.url)
    mainWindow.show()
  }

  // If dsh exits unexpectedly, notify the user
  dsh.on('exit', (code: number | null) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showErrorBox(
        'DSH Shell — 进程退出',
        `DeepSeek Harness 进程意外退出 (code=${code})。\n应用将关闭。`
      )
    }
    app.quit()
  })
}

app.whenReady().then(() => {
  void startDshAndLoad()

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked
    if (mainWindow === null) {
      void startDshAndLoad()
    }
  })
})

app.on('window-all-closed', () => {
  // On macOS, keep the app alive (tray behavior arrives later)
  if (process.platform !== 'darwin') {
    dsh?.kill()
    app.quit()
  }
})

app.on('before-quit', () => {
  dsh?.kill()
})
