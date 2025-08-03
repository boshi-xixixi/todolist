const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * 数据库服务类
 * 使用JSON文件作为本地数据库存储
 */
class DatabaseService {
  constructor() {
    // 获取用户数据目录
    this.userDataPath = app.getPath('userData');
    this.dbPath = path.join(this.userDataPath, 'todolist.json');
    this.initDatabase();
  }

  /**
   * 初始化数据库文件
   */
  initDatabase() {
    try {
      // 确保用户数据目录存在
      if (!fs.existsSync(this.userDataPath)) {
        fs.mkdirSync(this.userDataPath, { recursive: true });
      }

      // 如果数据库文件不存在，创建默认结构
      if (!fs.existsSync(this.dbPath)) {
        const defaultData = {
          tasks: [],
          settings: {
            theme: 'light',
            language: 'zh-CN',
            autoSave: true
          },
          metadata: {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
          }
        };
        this.writeData(defaultData);
      }
    } catch (error) {
      console.error('初始化数据库失败:', error);
    }
  }

  /**
   * 读取数据库数据
   * @returns {Object} 数据库数据
   */
  readData() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取数据库失败:', error);
      return {
        tasks: [],
        settings: {},
        metadata: {}
      };
    }
  }

  /**
   * 写入数据库数据
   * @param {Object} data 要写入的数据
   */
  writeData(data) {
    try {
      // 更新最后修改时间
      data.metadata = {
        ...data.metadata,
        lastModified: new Date().toISOString()
      };
      
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('写入数据库失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有任务
   * @returns {Array} 任务列表
   */
  getTasks() {
    const data = this.readData();
    return data.tasks || [];
  }

  /**
   * 保存任务列表
   * @param {Array} tasks 任务列表
   * @returns {boolean} 保存结果
   */
  saveTasks(tasks) {
    try {
      const data = this.readData();
      data.tasks = tasks;
      this.writeData(data);
      return true;
    } catch (error) {
      console.error('保存任务失败:', error);
      return false;
    }
  }

  /**
   * 添加任务
   * @param {Object} task 任务对象
   * @returns {Object} 添加的任务
   */
  addTask(task) {
    try {
      const data = this.readData();
      const newTask = {
        id: this.generateId(),
        title: task.title || '',
        description: task.description || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || 'default',
        dueDate: task.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...task
      };
      
      data.tasks.push(newTask);
      this.writeData(data);
      return newTask;
    } catch (error) {
      console.error('添加任务失败:', error);
      throw error;
    }
  }

  /**
   * 更新任务
   * @param {string} id 任务ID
   * @param {Object} updates 更新内容
   * @returns {Object} 更新后的任务
   */
  updateTask(id, updates) {
    try {
      const data = this.readData();
      const taskIndex = data.tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error(`任务 ${id} 不存在`);
      }
      
      data.tasks[taskIndex] = {
        ...data.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      this.writeData(data);
      return data.tasks[taskIndex];
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  }

  /**
   * 删除任务
   * @param {string} id 任务ID
   * @returns {boolean} 删除结果
   */
  deleteTask(id) {
    try {
      const data = this.readData();
      const taskIndex = data.tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        return false;
      }
      
      data.tasks.splice(taskIndex, 1);
      this.writeData(data);
      return true;
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  /**
   * 清空所有任务
   * @returns {boolean} 清空结果
   */
  clearTasks() {
    try {
      const data = this.readData();
      data.tasks = [];
      this.writeData(data);
      return true;
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  }

  /**
   * 获取设置
   * @returns {Object} 设置对象
   */
  getSettings() {
    const data = this.readData();
    return data.settings || {};
  }

  /**
   * 保存设置
   * @param {Object} settings 设置对象
   * @returns {boolean} 保存结果
   */
  saveSettings(settings) {
    try {
      const data = this.readData();
      data.settings = { ...data.settings, ...settings };
      this.writeData(data);
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  /**
   * 导出数据
   * @returns {Object} 导出的数据
   */
  exportData() {
    return this.readData();
  }

  /**
   * 导入数据
   * @param {Object} importData 要导入的数据
   * @returns {boolean} 导入结果
   */
  importData(importData) {
    try {
      // 验证数据格式
      if (!importData || typeof importData !== 'object') {
        throw new Error('无效的导入数据格式');
      }
      
      const data = this.readData();
      
      // 合并任务数据
      if (importData.tasks && Array.isArray(importData.tasks)) {
        data.tasks = [...data.tasks, ...importData.tasks];
      }
      
      // 合并设置数据
      if (importData.settings && typeof importData.settings === 'object') {
        data.settings = { ...data.settings, ...importData.settings };
      }
      
      this.writeData(data);
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 获取数据库统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const data = this.readData();
    const tasks = data.tasks || [];
    
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.completed).length,
      pendingTasks: tasks.filter(task => !task.completed).length,
      categories: [...new Set(tasks.map(task => task.category))],
      dbSize: this.getFileSize(),
      lastModified: data.metadata?.lastModified
    };
  }

  /**
   * 获取数据库文件大小
   * @returns {number} 文件大小（字节）
   */
  getFileSize() {
    try {
      const stats = fs.statSync(this.dbPath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 备份数据库
   * @returns {string} 备份文件路径
   */
  backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.userDataPath, `todolist-backup-${timestamp}.json`);
      
      fs.copyFileSync(this.dbPath, backupPath);
      return backupPath;
    } catch (error) {
      console.error('备份数据库失败:', error);
      throw error;
    }
  }
}

module.exports = DatabaseService;