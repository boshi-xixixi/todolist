/**
 * 数据库适配器 - 自动检测运行环境并选择合适的存储方式
 * 浏览器环境使用 localStorage，Electron 环境使用文件系统
 */

import { Task } from '../types';

// 检测是否在 Electron 环境中
const isElectron = (): boolean => {
  return typeof window !== 'undefined' && 
         window.electronAPI !== undefined;
};

/**
 * 数据库适配器类
 * 提供统一的数据存储接口，自动适配不同运行环境
 */
class DatabaseAdapter {
  private readonly STORAGE_KEY = 'todolist_tasks';

  /**
   * 获取所有任务
   * @returns {Promise<Task[]>} 任务列表
   */
  async getTasks(): Promise<Task[]> {
    try {
      if (isElectron()) {
        // Electron 环境：使用文件系统存储
        const tasks = await window.electronAPI.db.getTasks();
        return Array.isArray(tasks) ? tasks : [];
      } else {
        // 浏览器环境：使用 localStorage
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return [];
        
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('获取任务失败:', error);
      return [];
    }
  }

  /**
   * 保存所有任务
   * @param {Task[]} tasks 任务列表
   * @returns {Promise<boolean>} 保存结果
   */
  async saveTasks(tasks: Task[]): Promise<boolean> {
    try {
      if (isElectron()) {
        // Electron 环境：使用文件系统存储
        return await window.electronAPI.db.saveTasks(tasks);
      } else {
        // 浏览器环境：使用 localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        return true;
      }
    } catch (error) {
      console.error('保存任务失败:', error);
      return false;
    }
  }

  /**
   * 添加新任务
   * @param {Omit<Task, 'id'>} taskData 任务数据（不包含ID）
   * @returns {Promise<Task>} 添加的任务
   */
  async addTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      ...taskData,
      createdAt: new Date().toISOString(),

    };

    if (isElectron()) {
      // Electron 环境：使用专用的添加方法
      return await window.electronAPI.db.addTask(newTask);
    } else {
      // 浏览器环境：获取现有任务并添加新任务
      const tasks = await this.getTasks();
      tasks.push(newTask);
      await this.saveTasks(tasks);
      return newTask;
    }
  }

  /**
   * 更新任务
   * @param {string} id 任务ID
   * @param {Partial<Omit<Task, 'id'>>} updates 更新内容
   * @returns {Promise<Task | null>} 更新后的任务
   */
  async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null> {
    try {
      if (isElectron()) {
        // Electron 环境：使用专用的更新方法
        return await window.electronAPI.db.updateTask(id, {
          ...updates,

        });
      } else {
        // 浏览器环境：获取任务列表并更新指定任务
        const tasks = await this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) {
          console.warn(`任务 ${id} 不存在`);
          return null;
        }

        const updatedTask = {
          ...tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        tasks[taskIndex] = updatedTask;
        await this.saveTasks(tasks);
        return updatedTask;
      }
    } catch (error) {
      console.error('更新任务失败:', error);
      return null;
    }
  }

  /**
   * 删除任务
   * @param {string} id 任务ID
   * @returns {Promise<boolean>} 删除结果
   */
  async deleteTask(id: string): Promise<boolean> {
    console.log('database.deleteTask 被调用，任务ID:', id);
    
    try {
      if (isElectron()) {
        console.log('使用 Electron 环境删除方法');
        // Electron 环境：使用专用的删除方法
        const result = await window.electronAPI.db.deleteTask(id);
        console.log('Electron 删除结果:', result);
        return result;
      } else {
        console.log('使用浏览器环境删除方法');
        // 浏览器环境：从任务列表中移除指定任务
        const tasks = await this.getTasks();
        console.log('获取到的任务列表长度:', tasks.length);
        console.log('要删除的任务ID:', id);
        
        const filteredTasks = tasks.filter(task => task.id !== id);
        console.log('过滤后的任务列表长度:', filteredTasks.length);
        
        if (filteredTasks.length === tasks.length) {
          console.warn(`任务 ${id} 不存在`);
          return false;
        }

        console.log('保存过滤后的任务列表...');
        const saveResult = await this.saveTasks(filteredTasks);
        console.log('保存结果:', saveResult);
        return saveResult;
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  /**
   * 清空所有任务
   * @returns {Promise<boolean>} 清空结果
   */
  async clearTasks(): Promise<boolean> {
    try {
      if (isElectron()) {
        // Electron 环境：使用专用的清空方法
        return await window.electronAPI.db.clearTasks();
      } else {
        // 浏览器环境：清空 localStorage
        localStorage.removeItem(this.STORAGE_KEY);
        return true;
      }
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  }

  /**
   * 导出数据
   * @returns {Promise<Task[]>} 所有任务数据
   */
  async exportData(): Promise<Task[]> {
    return await this.getTasks();
  }

  /**
   * 导入数据
   * @param {Task[]} tasks 要导入的任务列表
   * @returns {Promise<boolean>} 导入结果
   */
  async importData(tasks: Task[]): Promise<boolean> {
    if (!Array.isArray(tasks)) {
      console.error('导入数据格式错误：必须是数组');
      return false;
    }

    // 验证数据格式
    const validTasks = tasks.filter(task => 
      task && 
      typeof task.id === 'string' && 
      typeof task.title === 'string'
    );

    if (validTasks.length !== tasks.length) {
      console.warn(`导入数据中有 ${tasks.length - validTasks.length} 条无效记录被忽略`);
    }

    return await this.saveTasks(validTasks);
  }

  /**
   * 获取存储统计信息
   * @returns {Promise<{total: number, completed: number, pending: number}>} 统计信息
   */
  async getStats(): Promise<{total: number, completed: number, pending: number}> {
    const tasks = await this.getTasks();
    const completed = tasks.filter(task => task.completed).length;
    
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed
    };
  }

  /**
   * 检查当前运行环境
   * @returns {string} 运行环境类型
   */
  getEnvironment(): string {
    return isElectron() ? 'electron' : 'browser';
  }

  /**
   * 生成唯一ID
   * @returns {string} 唯一标识符
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例实例
export const database = new DatabaseAdapter();

// 导出类型定义
export type { Task };

// 为 Electron 环境添加类型声明
declare global {
  interface Window {
    electronAPI?: {
      db: {
        getTasks: () => Promise<Task[]>;
        saveTasks: (tasks: Task[]) => Promise<boolean>;
        addTask: (task: Task) => Promise<Task>;
        updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
        deleteTask: (id: string) => Promise<boolean>;
        clearTasks: () => Promise<boolean>;
      };
      app: {
        getVersion: () => Promise<string>;
        getPlatform: () => Promise<string>;
        isElectron: () => boolean;
      };
      file: {
        exportData: (data: any) => Promise<string>;
        importData: () => Promise<any>;
      };
      notification: {
        show: (title: string, body: string) => Promise<void>;
      };
    };
  }
}