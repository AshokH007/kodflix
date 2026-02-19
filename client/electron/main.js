import electron from 'electron';
const { app, BrowserWindow } = electron;
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess;

function startBackend() {
    const serverPath = path.join(__dirname, '../../server/server.js');
    const nodePath = 'C:\\nodejs\\node.exe';

    console.log('Starting KODFLIX Backend silently...');

    backendProcess = spawn(nodePath, [serverPath], {
        cwd: path.join(__dirname, '../../server'),
        detached: false,
        stdio: 'ignore', // Hides output
        windowsHide: true // Hides the command window on Windows
    });

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend:', err);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "KODFLIX",
        backgroundColor: '#141414',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        show: false
    });

    // Load the app: Production dist if available, else dev server
    const distPath = path.join(__dirname, '../dist/index.html');
    const hasDist = fs.existsSync(distPath);

    if (!app.isPackaged && !hasDist) {
        win.loadURL('http://localhost:5174').catch(() => {
            setTimeout(() => win.loadURL('http://localhost:5174'), 2000);
        });
    } else {
        win.loadFile(distPath);
    }

    win.once('ready-to-show', () => {
        win.show();
    });
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (backendProcess) backendProcess.kill();
    if (process.platform !== 'darwin') app.quit();
});

process.on('exit', () => {
    if (backendProcess) backendProcess.kill();
});
