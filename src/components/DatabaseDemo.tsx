import React, { useState, useEffect } from 'react';
import { db, isElectron, showNotification, getAppInfo, type Task } from '../utils/database';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Download, Upload, Bell, Info } from 'lucide-react';

/**
 * 数据库功能演示组件
 * 展示如何在不同环境下使用统一的数据库API
 */
export function DatabaseDemo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appInfo, setAppInfo] = useState<{ version: string; platform: string; isElectron: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * 加载任务数据
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      const taskList = await db.getTasks();
      setTasks(taskList);
      setMessage(`成功加载 ${taskList.length} 个任务`);
    } catch (error) {
      console.error('加载任务失败:', error);
      setMessage('加载任务失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 添加示例任务
   */
  const addSampleTask = async () => {
    try {
      setLoading(true);
      const newTask = await db.addTask({
        title: `示例任务 ${Date.now()}`,
        description: '这是一个示例任务',
        completed: false,
        priority: 'medium',
        category: 'demo'
      });
      
      setTasks(prev => [...prev, newTask]);
      setMessage('成功添加示例任务');
      
      // 显示通知
      await showNotification('任务添加成功', `已添加任务: ${newTask.title}`);
    } catch (error) {
      console.error('添加任务失败:', error);
      setMessage('添加任务失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 切换任务完成状态
   */
  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = await db.updateTask(taskId, {
        completed: !task.completed
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setMessage(`任务已${updatedTask.completed ? '完成' : '取消完成'}`);
    } catch (error) {
      console.error('更新任务失败:', error);
      setMessage('更新任务失败');
    }
  };

  /**
   * 删除任务
   */
  const deleteTask = async (taskId: string) => {
    try {
      const success = await db.deleteTask(taskId);
      if (success) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setMessage('任务已删除');
      } else {
        setMessage('删除任务失败');
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      setMessage('删除任务失败');
    }
  };

  /**
   * 导出数据
   */
  const exportData = async () => {
    try {
      setLoading(true);
      await db.exportData();
      setMessage('数据导出成功');
    } catch (error) {
      console.error('导出数据失败:', error);
      setMessage('导出数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 导入数据（仅浏览器环境演示）
   */
  const importData = async () => {
    if (isElectron()) {
      try {
        setLoading(true);
        const result = await db.importData({});
        if (result) {
          await loadTasks();
          setMessage('数据导入成功');
        } else {
          setMessage('数据导入失败');
        }
      } catch (error) {
        console.error('导入数据失败:', error);
        setMessage('导入数据失败');
      } finally {
        setLoading(false);
      }
    } else {
      // 浏览器环境下创建文件输入
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            setLoading(true);
            const text = await file.text();
            const data = JSON.parse(text);
            const success = await db.importData(data);
            if (success) {
              await loadTasks();
              setMessage('数据导入成功');
            } else {
              setMessage('数据导入失败');
            }
          } catch (error) {
            console.error('导入数据失败:', error);
            setMessage('导入数据失败');
          } finally {
            setLoading(false);
          }
        }
      };
      input.click();
    }
  };

  /**
   * 测试通知
   */
  const testNotification = async () => {
    await showNotification('测试通知', '这是一个测试通知消息');
    setMessage('通知已发送');
  };

  /**
   * 清空所有任务
   */
  const clearAllTasks = async () => {
    if (confirm('确定要清空所有任务吗？此操作不可撤销。')) {
      try {
        setLoading(true);
        const success = await db.clearTasks();
        if (success) {
          setTasks([]);
          setMessage('所有任务已清空');
        } else {
          setMessage('清空任务失败');
        }
      } catch (error) {
        console.error('清空任务失败:', error);
        setMessage('清空任务失败');
      } finally {
        setLoading(false);
      }
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadTasks();
    getAppInfo().then(setAppInfo);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">数据库功能演示</h1>
        <p className="text-gray-600">
          这个组件演示了如何在不同环境下使用统一的数据库API
        </p>
      </div>

      {/* 应用信息 */}
      {appInfo && (
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5" />
            <h2 className="text-lg font-semibold">应用信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">环境:</span>
              <Badge variant={appInfo.isElectron ? 'default' : 'secondary'}>
                {appInfo.isElectron ? 'Electron桌面应用' : '浏览器Web应用'}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-500">版本:</span>
              <span className="ml-2 font-mono">{appInfo.version}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">平台:</span>
              <span className="ml-2">{appInfo.platform}</span>
            </div>
          </div>
        </Card>
      )}

      {/* 操作按钮 */}
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">数据库操作</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={loadTasks} disabled={loading}>
            刷新任务
          </Button>
          <Button onClick={addSampleTask} disabled={loading}>
            添加示例任务
          </Button>
          <Button onClick={exportData} disabled={loading}>
            <Download className="w-4 h-4 mr-1" />
            导出数据
          </Button>
          <Button onClick={importData} disabled={loading}>
            <Upload className="w-4 h-4 mr-1" />
            导入数据
          </Button>
          <Button onClick={testNotification}>
            <Bell className="w-4 h-4 mr-1" />
            测试通知
          </Button>
          <Button 
            onClick={clearAllTasks} 
            disabled={loading || tasks.length === 0}
            variant="destructive"
          >
            清空所有任务
          </Button>
        </div>
      </Card>

      {/* 状态消息 */}
      {message && (
        <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-blue-800">{message}</p>
        </Card>
      )}

      {/* 任务列表 */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">任务列表 ({tasks.length})</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无任务</p>
            <p className="text-sm mt-1">点击"添加示例任务"来创建一个任务</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`p-3 border rounded-lg flex items-center justify-between ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <h3 className={`font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-500">{task.description}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" size="sm">
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => deleteTask(task.id)}
                  variant="destructive"
                  size="sm"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}