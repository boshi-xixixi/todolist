/**
 * 数据库适配器
 * 根据运行环境自动选择使用Electron数据库或浏览器localStorage
 */

// 任务接口定义
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 设置接口定义
export interface Settings {
  theme: 'light' | 'dark';
  language: string;
  autoSave: boolean;
  [key: string]: any;
}

// 数据库接口
export interface DatabaseAdapter {
  getTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<boolean>;
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  clearTasks(): Promise<boolean>;
  getSettings(): Promise<Settings>;
  saveSettings(settings: Partial<Settings>): Promise<boolean>;
  exportData(): Promise<any>;
  importData(data: any): Promise<boolean>;
}

/**
 * Electron数据库适配器
 */
class ElectronDatabaseAdapter implements DatabaseAdapter {
  private get electronAPI() {
    return (window as any).electronAPI;
  }

  async getTasks(): Promise<Task[]> {
    return this.electronAPI.db.getTasks();
  }

  async saveTasks(tasks: Task[]): Promise<boolean> {
    return this.electronAPI.db.saveTasks(tasks);
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.electronAPI.db.addTask(task);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.electronAPI.db.updateTask(id, updates);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.electronAPI.db.deleteTask(id);
  }

  async clearTasks(): Promise<boolean> {
    return this.electronAPI.db.clearTasks();
  }

  async getSettings(): Promise<Settings> {
    // Electron环境下的设置获取
    const stored = localStorage.getItem('todolist-settings');
    return stored ? JSON.parse(stored) : {
      theme: 'light',
      language: 'zh-CN',
      autoSave: true
    };
  }

  async saveSettings(settings: Partial<Settings>): Promise<boolean> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem('todolist-settings', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  async exportData(): Promise<any> {
    const tasks = await this.getTasks();
    const settings = await this.getSettings();
    return this.electronAPI.file.exportData({ tasks, settings });
  }

  async importData(data: any): Promise<boolean> {
    return this.electronAPI.file.importData(data);
  }
}

/**
 * 浏览器localStorage适配器
 */
class LocalStorageDatabaseAdapter implements DatabaseAdapter {
  private readonly TASKS_KEY = 'todolist-tasks';
  private readonly SETTINGS_KEY = 'todolist-settings';

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getTasks(): Promise<Task[]> {
    try {
      const stored = localStorage.getItem(this.TASKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取任务失败:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<boolean> {
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('保存任务失败:', error);
      return false;
    }
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const newTask: Task = {
        ...task,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      tasks.push(newTask);
      await this.saveTasks(tasks);
      return newTask;
    } catch (error) {
      console.error('添加任务失败:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error(`任务 ${id} 不存在`);
      }
      
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await this.saveTasks(tasks);
      return tasks[taskIndex];
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      if (filteredTasks.length === tasks.length) {
        return false; // 任务不存在
      }
      
      await this.saveTasks(filteredTasks);
      return true;
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  async clearTasks(): Promise<boolean> {
    try {
      localStorage.removeItem(this.TASKS_KEY);
      return true;
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {
        theme: 'light',
        language: 'zh-CN',
        autoSave: true
      };
    } catch (error) {
      console.error('获取设置失败:', error);
      return {
        theme: 'light',
        language: 'zh-CN',
        autoSave: true
      };
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<boolean> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  async exportData(): Promise<any> {
    try {
      const tasks = await this.getTasks();
      const settings = await this.getSettings();
      const data = {
        tasks,
        settings,
        metadata: {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          source: 'browser'
        }
      };
      
      // 创建下载链接
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todolist-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return data;
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  }

  async importData(data: any): Promise<boolean> {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('无效的导入数据格式');
      }
      
      // 导入任务
      if (data.tasks && Array.isArray(data.tasks)) {
        const currentTasks = await this.getTasks();
        const mergedTasks = [...currentTasks, ...data.tasks];
        await this.saveTasks(mergedTasks);
      }
      
      // 导入设置
      if (data.settings && typeof data.settings === 'object') {
        await this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

/**
 * 检查是否在Electron环境中运行
 */
function isElectron(): boolean {
  return !!(window as any).electronAPI;
}

/**
 * 创建数据库适配器实例
 */
export function createDatabaseAdapter(): DatabaseAdapter {
  if (isElectron()) {
    return new ElectronDatabaseAdapter();
  } else {
    return new LocalStorageDatabaseAdapter();
  }
}

// 导出默认数据库实例
export const db = createDatabaseAdapter();

// 导出环境检查函数
export { isElectron };

// 导出通知函数
export async function showNotification(title: string, body: string): Promise<void> {
  if (isElectron()) {
    // Electron环境使用系统通知
    const electronAPI = (window as any).electronAPI;
    await electronAPI.notification.show(title, body);
  } else {
    // 浏览器环境使用Web Notification API
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
    }
  }
}

// 导出应用信息函数
export async function getAppInfo(): Promise<{ version: string; platform: string; isElectron: boolean }> {
  if (isElectron()) {
    const electronAPI = (window as any).electronAPI;
    const version = await electronAPI.app.getVersion();
    const platform = await electronAPI.app.getPlatform();
    return { version, platform, isElectron: true };
  } else {
    return {
      version: '1.0.0',
      platform: navigator.platform,
      isElectron: false
    };
  }
}