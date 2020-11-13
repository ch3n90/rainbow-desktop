'use strict'

import { app, protocol, BrowserWindow,ipcMain,Menu, Tray} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let chatWin

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createAuthWindow () {
  // Create the browser window.
  const authWin = new BrowserWindow({
    width: 330,
    height: 620,
    icon: path.join(__static, 'icon.png'),
    resizable:false,
    autoHideMenuBar:true,
    frame:false,
    // show:false,
    center:true,
    backgroundColor: '#222326',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule:true,
      webSecurity:false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    authWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) authWin.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    authWin.loadURL('app://./index.html')
  }

  return authWin;

}

//defined chat window
function createChatWindow () {
  // Create the browser window.
  const chatWin = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__static, 'icon.png'),
    resizable:false,
    autoHideMenuBar:true,
    frame:false,
    // show:false,
    center:true,
    backgroundColor: '#222326',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule:true,
      // webSecurity:false,
    },
  });
 
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    console.log(process.env.WEBPACK_DEV_SERVER_URL);
    chatWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "chatpage")
    if (!process.env.IS_TEST) chatWin.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    chatWin.loadURL('app://./chatpage.html')
  }

  return chatWin;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  win = createAuthWindow();
  // chatWin = createChatWindow();
  
})

ipcMain.on("auth-win-min",()=>{
  win.minimize();
})

ipcMain.on("auth-win-close",()=>{
win.close();
})

ipcMain.on("chat-win",()=>{
  chatWin = createChatWindow();
})
  
ipcMain.on("login-win",()=>{
  console.log("-------");
})
  
// tray
let appIcon = null

ipcMain.on('put-in-tray', (event) => {
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Remove',
    click: () => {
      event.sender.send('tray-removed')
    }
  }])

  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
})

ipcMain.on('remove-tray', () => {
  appIcon.destroy()
})

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
