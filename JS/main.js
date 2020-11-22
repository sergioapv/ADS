const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let win;

function createWindow() {
    win = new BrowserWindow({
      // icon:'C:/Users/eduar/OneDrive/Ambiente de Trabalho/Stuff/Faculdade/Mestrado/Da Ciencia para o Mercado de Trabalho/Electron WorkSpace/images/logo_orig_new_clicked_40x30.png',
      width: 1920,
      height:1080,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        // webviewTag:true,
  }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    })

}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
})
