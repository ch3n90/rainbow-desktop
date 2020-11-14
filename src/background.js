'use strict'

import { app, protocol, BrowserWindow,ipcMain,Menu,Tray,nativeImage} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWin
let chatWin

global.cache = {
  token: null,
  user: null,
  contacts:null,
  sessions:null,
}

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


  authWin.once('ready-to-show', () => {
    authWin.show()
  })

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
    show:false,
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
    chatWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "chatpage")
    if (!process.env.IS_TEST) chatWin.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    chatWin.loadURL('app://./chatpage.html')
  }

  chatWin.once('ready-to-show', () => {
    chatWin.show()
  })

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
  if (authWin.isDestroyed()) {
    authWin = createAuthWindow();
  }
  if (chatWin.isDestroyed()) {
    chatWin = createChatWindow();
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
  authWin = createAuthWindow();
})


ipcMain.on("chat-win",()=>{
  //init chat panel
  chatWin = createChatWindow();
  //close auth panel
  authWin.destroy();
  authWin = null;
})
  
ipcMain.on("auth-win",()=>{
  authWin = createAuthWindow();
  chatWin.destroy();
  chatWin = null;
})
  
// tray
let appIcon,timer,count = 0;
const iconName = process.platform === 'win32' ? 'icon.png' : 'iconTemplate.png'
const iconPath = path.join(__static, iconName)
ipcMain.on('put-in-tray', (event) => {
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: '退出',
            click: () => {
              app.quit();
            }
  }])
  appIcon.on('click',()=> {
    chatWin.show();
  })

  appIcon.setToolTip('rainbow')
  appIcon.setContextMenu(contextMenu)
})

ipcMain.on('remove-tray', () => {
  appIcon.destroy()
})

// 渲染线程通知，有新的消息
ipcMain.on('msg', (event,arg) => {
  timer = setInterval(() => {
    count += 1
    if (count % 2 === 0) {
      appIcon.setImage(iconPath)
    } else {
      appIcon.setImage(nativeImage.createEmpty())
    }
  }, 600)
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
