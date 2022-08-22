const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    minWidth: 300,
    height: 550,
    minHeight: 300,
    icon: "icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.loadFile("staticOut/index.html");

  // win.setResizable(false);
  win.setMenu(null);

  ipcMain.handle("dialog:openDirectory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("startBrs", (e, params) => {
  const bs = require("browser-sync").create();

  bs.init({
    server: params.dir,
    port: params.port,
  });

  bs.reload(params.files);
});

ipcMain.handle("quit-app", () => {
  app.quit();
});
