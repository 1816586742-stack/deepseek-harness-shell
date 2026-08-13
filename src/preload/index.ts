// Preload surface is intentionally empty for now; the IPC bridge arrives with the dsh process bridge.
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('dshShell', { platform: process.platform })
