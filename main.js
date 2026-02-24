const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let trackerContentDims = null;
let savedTrackerZoom = null;
let trackerWindow = null;

// --- Persistent settings file ---
const settingsPath = path.join(app.getPath('userData'), 'tracker-settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (e) {
    // ignore corrupt file
  }
  return {};
}

function saveSettings(data) {
  try {
    const existing = loadSettings();
    const merged = { ...existing, ...data };
    fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2), 'utf8');
  } catch (e) {
    // ignore write errors
  }
}

// Load saved zoom on startup
const initialSettings = loadSettings();
savedTrackerZoom = initialSettings.zoom || null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'ALTTP Randomizer Community Tracker',
    icon: path.join(__dirname, 'tracker', 'images', 'icons', 'favicon-32x32.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    backgroundColor: '#1a1a2e',
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'tracker', 'index.html'));

  mainWindow.webContents.setWindowOpenHandler(({ url, features }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }

    // Parse width and height from the window.open features string
    let width = 500;
    let height = 1060;
    if (features) {
      const wMatch = features.match(/width=(\d+)/);
      const hMatch = features.match(/height=(\d+)/);
      if (wMatch) width = parseInt(wMatch[1]);
      if (hMatch) height = parseInt(hMatch[1]);
    }

    trackerContentDims = { width, height };

    // Use saved window position/size if available, otherwise use content dims
    const saved = loadSettings();
    const openWidth = saved.windowBounds ? saved.windowBounds.width : width + 16;
    const openHeight = saved.windowBounds ? saved.windowBounds.height : height + 62;
    const openX = saved.windowBounds ? saved.windowBounds.x : undefined;
    const openY = saved.windowBounds ? saved.windowBounds.y : undefined;

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: openWidth,
        height: openHeight,
        x: openX,
        y: openY,
        minWidth: 300,
        minHeight: 200,
        resizable: true,
        maximizable: true,
        fullscreenable: true,
        title: 'ALTTP Tracker',
        icon: path.join(__dirname, 'tracker', 'images', 'icons', 'favicon-32x32.png'),
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.js'),
          webSecurity: false,
        },
      },
    };
  });

  // Track the tracker window for saving bounds on close
  app.on('browser-window-created', (_, win) => {
    if (win === mainWindow) return;
    trackerWindow = win;
    win.setMenuBarVisibility(false);

    // Save window position/size whenever it moves or resizes
    const saveBounds = () => {
      if (trackerWindow && !trackerWindow.isDestroyed()) {
        const bounds = trackerWindow.getBounds();
        saveSettings({ windowBounds: bounds });
      }
    };

    win.on('resize', saveBounds);
    win.on('move', saveBounds);
    win.on('closed', () => {
      trackerWindow = null;
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.handle('get-app-path', () => app.getAppPath());

ipcMain.handle('get-content-dimensions', () => {
  return trackerContentDims;
});

ipcMain.handle('fit-window-to-content', (event, contentW, contentH) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const [winW, winH] = win.getSize();
    const [clientW, clientH] = win.getContentSize();
    const frameW = winW - clientW;
    const frameH = winH - clientH;
    win.setSize(contentW + frameW, contentH + frameH);
  }
});

ipcMain.handle('save-zoom', (event, zoom) => {
  savedTrackerZoom = zoom;
  saveSettings({ zoom });
});

ipcMain.handle('get-saved-zoom', () => {
  return savedTrackerZoom;
});

ipcMain.handle('set-aspect-ratio', (event, ratio) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.setAspectRatio(ratio);
  }
});
