const { contextBridge, ipcRenderer } = require('electron');

/**
 * 暴露安全的API给渲染进程
 * 提供数据库操作接口
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // 数据库操作
  db: {
    /**
     * 获取所有任务
     * @returns {Promise<Array>} 任务列表
     */
    getTasks: () => ipcRenderer.invoke('db:getTasks'),
    
    /**
     * 保存任务
     * @param {Array} tasks 任务列表
     * @returns {Promise<boolean>} 保存结果
     */
    saveTasks: (tasks) => ipcRenderer.invoke('db:saveTasks', tasks),
    
    /**
     * 添加任务
     * @param {Object} task 任务对象
     * @returns {Promise<Object>} 添加的任务
     */
    addTask: (task) => ipcRenderer.invoke('db:addTask', task),
    
    /**
     * 更新任务
     * @param {string} id 任务ID
     * @param {Object} updates 更新内容
     * @returns {Promise<Object>} 更新后的任务
     */
    updateTask: (id, updates) => ipcRenderer.invoke('db:updateTask', id, updates),
    
    /**
     * 删除任务
     * @param {string} id 任务ID
     * @returns {Promise<boolean>} 删除结果
     */
    deleteTask: (id) => ipcRenderer.invoke('db:deleteTask', id),
    
    /**
     * 清空所有任务
     * @returns {Promise<boolean>} 清空结果
     */
    clearTasks: () => ipcRenderer.invoke('db:clearTasks')
  },
  
  // 应用信息
  app: {
    /**
     * 获取应用版本
     * @returns {Promise<string>} 应用版本
     */
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    
    /**
     * 获取平台信息
     * @returns {Promise<string>} 平台信息
     */
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
    
    /**
     * 检查是否为Electron环境
     * @returns {boolean} 是否为Electron环境
     */
    isElectron: () => true
  },
  
  // 文件操作
  file: {
    /**
     * 导出数据
     * @param {Object} data 要导出的数据
     * @returns {Promise<string>} 导出文件路径
     */
    exportData: (data) => ipcRenderer.invoke('file:exportData', data),
    
    /**
     * 导入数据
     * @returns {Promise<Object>} 导入的数据
     */
    importData: () => ipcRenderer.invoke('file:importData')
  },
  
  // 通知
  notification: {
    /**
     * 显示系统通知
     * @param {string} title 通知标题
     * @param {string} body 通知内容
     * @returns {Promise<void>}
     */
    show: (title, body) => ipcRenderer.invoke('notification:show', title, body)
  }
});

// 监听主进程消息
ipcRenderer.on('app:update-available', () => {
  console.log('应用更新可用');
});

ipcRenderer.on('app:update-downloaded', () => {
  console.log('应用更新已下载');
});