const { app, BrowserWindow, Menu, shell, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const DatabaseService = require('./database');

// 初始化数据库服务
let dbService;

/**
 * 创建主窗口
 */
function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.svg'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false // 先隐藏窗口，等加载完成后再显示
  });

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // 开发模式下打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

/**
 * 创建应用菜单
 */
function createMenu() {
  const template = [
    {
      label: 'TodoList',
      submenu: [
        {
          label: '关于 TodoList',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: '隐藏 TodoList',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '隐藏其他',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: '显示全部',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '重做',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: '强制重新加载',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.reloadIgnoringCache();
            }
          }
        },
        {
          label: '切换开发者工具',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          }
        },
        { type: 'separator' },
        {
          label: '实际大小',
          accelerator: 'CmdOrCtrl+0',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.zoomLevel = 0;
            }
          }
        },
        {
          label: '放大',
          accelerator: 'CmdOrCtrl+Plus',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.zoomLevel += 0.5;
            }
          }
        },
        {
          label: '缩小',
          accelerator: 'CmdOrCtrl+-',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.zoomLevel -= 0.5;
            }
          }
        },
        { type: 'separator' },
        {
          label: '切换全屏',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            shell.openExternal('https://github.com/yourusername/todolist');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 初始化数据库服务
  dbService = new DatabaseService();
  
  // 设置IPC处理程序
  setupIpcHandlers();
  
  createWindow();
  createMenu();

  app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * 设置IPC处理程序
 */
function setupIpcHandlers() {
  // 数据库操作处理程序
  ipcMain.handle('db:getTasks', async () => {
    try {
      return dbService.getTasks();
    } catch (error) {
      console.error('获取任务失败:', error);
      return [];
    }
  });

  ipcMain.handle('db:saveTasks', async (event, tasks) => {
    try {
      return dbService.saveTasks(tasks);
    } catch (error) {
      console.error('保存任务失败:', error);
      return false;
    }
  });

  ipcMain.handle('db:addTask', async (event, task) => {
    try {
      return dbService.addTask(task);
    } catch (error) {
      console.error('添加任务失败:', error);
      throw error;
    }
  });

  ipcMain.handle('db:updateTask', async (event, id, updates) => {
    try {
      return dbService.updateTask(id, updates);
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  });

  ipcMain.handle('db:deleteTask', async (event, id) => {
    try {
      return dbService.deleteTask(id);
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  });

  ipcMain.handle('db:clearTasks', async () => {
    try {
      return dbService.clearTasks();
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  });

  // 应用信息处理程序
  ipcMain.handle('app:getVersion', async () => {
    return app.getVersion();
  });

  ipcMain.handle('app:getPlatform', async () => {
    return process.platform;
  });

  // 文件操作处理程序
  ipcMain.handle('file:exportData', async (event, data) => {
    try {
      const result = await dialog.showSaveDialog({
        title: '导出数据',
        defaultPath: `todolist-export-${new Date().toISOString().split('T')[0]}.json`,
        filters: [
          { name: 'JSON文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
        return result.filePath;
      }
      return null;
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  });

  ipcMain.handle('file:importData', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: '导入数据',
        filters: [
          { name: 'JSON文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const importData = JSON.parse(fileContent);
        
        // 导入数据到数据库
        const success = dbService.importData(importData);
        if (success) {
          return dbService.exportData();
        }
        throw new Error('导入数据失败');
      }
      return null;
    } catch (error) {
      console.error('导入数据失败:', error);
      throw error;
    }
  });

  // 通知处理程序
  ipcMain.handle('notification:show', async (event, title, body) => {
    try {
      if (Notification.isSupported()) {
        const notification = new Notification({
          title,
          body,
          icon: path.join(__dirname, '../public/favicon.ico')
        });
        notification.show();
      }
    } catch (error) {
      console.error('显示通知失败:', error);
    }
  });
}

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  // 在 macOS 上，应用程序和它们的菜单栏通常保持活动状态，
  // 直到用户使用 Cmd + Q 明确退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在开发模式下，当主进程崩溃时重启应用
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}