import { BrowserWindow, shell } from 'electron'
import icon from '../../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { injectable } from 'inversify'

@injectable()
export default class WindowService {
  mainWindow!: BrowserWindow

  createWindow(): BrowserWindow {
    this.mainWindow = new BrowserWindow({
      width: 1100,
      height: 670,
      show: false,
      // frame: false,
      // autoHideMenuBar: true,
      icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
      // this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    return this.mainWindow
  }
}
