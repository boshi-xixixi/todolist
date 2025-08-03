import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle2, Circle, Calendar, AlertCircle, Plus, ArrowLeft, Settings } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { TaskForm } from '@/components/TaskForm';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

/**
 * 今日任务页面组件 - 显示今天的所有任务，包含时间线视图
 */
export const TodayTasks: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, toggleTask, deleteTask } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');

  /**
   * 获取今日任务列表
   */
  const todayTasks = useMemo(() => {
    const today = new Date();
    // 使用本地时间格式化，避免时区问题
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 调试信息
    console.log('=== 今日任务调试信息 ===');
    console.log('今日日期字符串:', todayStr);
    console.log('所有任务数量:', tasks.length);
    console.log('所有任务:', tasks.map(t => ({ id: t.id, title: t.title, deadline: t.deadline })));
    
    const filtered = tasks.filter(task => {
      if (!task.deadline) {
        console.log(`任务 "${task.title}" 没有截止日期，跳过`);
        return false;
      }
      const taskDate = new Date(task.deadline);
      const taskDateStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
      const isToday = taskDateStr === todayStr;
      console.log(`任务 "${task.title}": deadline=${task.deadline}, taskDateStr=${taskDateStr}, isToday=${isToday}`);
      return isToday;
    });
    
    console.log('过滤后的今日任务数量:', filtered.length);
    console.log('今日任务:', filtered.map(t => ({ id: t.id, title: t.title, deadline: t.deadline })));
    console.log('=== 调试信息结束 ===');
    
    return filtered.sort((a, b) => {
      // 按时间排序，没有时间的任务排在最后
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks]);

  /**
   * 按时间段分组的任务
   */
  const tasksByTimeSlot = useMemo(() => {
    const slots = {
      morning: [] as Task[],
      afternoon: [] as Task[],
      evening: [] as Task[],
      noTime: [] as Task[]
    };

    todayTasks.forEach(task => {
      if (!task.deadline) {
        slots.noTime.push(task);
        return;
      }

      const hour = new Date(task.deadline!).getHours();
      if (hour < 12) {
        slots.morning.push(task);
      } else if (hour < 18) {
        slots.afternoon.push(task);
      } else {
        slots.evening.push(task);
      }
    });

    return slots;
  }, [todayTasks]);

  /**
   * 获取任务统计信息
   */
  const taskStats = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [todayTasks]);

  /**
   * 处理任务点击
   */
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  /**
   * 处理任务状态切换
   */
  const handleToggleTask = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleTask(taskId);
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  /**
   * 获取优先级颜色
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
    }
  };

  /**
   * 获取优先级标签
   */
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '无';
    }
  };

  /**
   * 渲染任务卡片
   */
  const renderTaskCard = (task: Task, showTime = true) => (
    <div
      key={task.id}
      onClick={() => handleTaskClick(task)}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        task.completed
          ? 'border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {/* 任务状态按钮 */}
      <button
        onClick={(e) => handleToggleTask(task.id, e)}
        className="absolute top-4 right-4 p-1 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        )}
      </button>

      {/* 任务内容 */}
      <div className="pr-8">
        <h3 className={`font-medium text-lg mb-2 ${
          task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
        }`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={`text-sm mb-3 ${
            task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
          }`}>
            {task.description}
          </p>
        )}

        {/* 任务元信息 */}
        <div className="flex items-center gap-4 text-xs">
          {showTime && task.deadline && (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Clock className="w-3 h-3" />
              <span>{formatTime(task.deadline)}</span>
            </div>
          )}
          

          
          {task.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
              getPriorityColor(task.priority)
            }`}>
              {getPriorityLabel(task.priority)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  /**
   * 渲染时间线视图
   */
  const renderTimelineView = () => (
    <div className="space-y-8">
      {/* 上午任务 */}
      {tasksByTimeSlot.morning.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">上午 (06:00 - 12:00)</h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="space-y-3 ml-6">
            {tasksByTimeSlot.morning.map(task => renderTaskCard(task))}
          </div>
        </div>
      )}

      {/* 下午任务 */}
      {tasksByTimeSlot.afternoon.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">下午 (12:00 - 18:00)</h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="space-y-3 ml-6">
            {tasksByTimeSlot.afternoon.map(task => renderTaskCard(task))}
          </div>
        </div>
      )}

      {/* 晚上任务 */}
      {tasksByTimeSlot.evening.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">晚上 (18:00 - 24:00)</h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="space-y-3 ml-6">
            {tasksByTimeSlot.evening.map(task => renderTaskCard(task))}
          </div>
        </div>
      )}

      {/* 无时间任务 */}
      {tasksByTimeSlot.noTime.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">待安排时间</h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="space-y-3 ml-6">
            {tasksByTimeSlot.noTime.map(task => renderTaskCard(task, false))}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * 渲染列表视图
   */
  const renderListView = () => (
    <div className="space-y-3">
      {todayTasks.map(task => renderTaskCard(task))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="返回主页"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回</span>
              </button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">今日任务</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 设置按钮 */}
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title="设置"
                aria-label="设置"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              {/* 主题切换按钮 */}
              <ThemeToggle />
              
              {/* 视图切换 */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  时间线
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  列表
                </button>
              </div>
              
              {/* 添加任务按钮 */}
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加任务
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总任务</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">待完成</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{taskStats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">完成率</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{taskStats.completionRate}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{taskStats.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 任务内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">今天还没有任务</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">添加一些任务来开始您的一天吧！</p>
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加第一个任务
              </button>
            </div>
          ) : (
            <div>
              {viewMode === 'timeline' ? renderTimelineView() : renderListView()}
            </div>
          )}
        </div>
      </div>

      {/* 任务表单弹窗 */}
      {showTaskForm && (
        <TaskForm
          className="mb-6"
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* 任务详情弹窗 */}
      {showTaskDetail && selectedTask && (
        <TaskDetailModal
          isOpen={showTaskDetail}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }}
          selectedDate={selectedTask.deadline ? new Date(selectedTask.deadline) : null}
          selectedTimeRange={null}
          tasks={[selectedTask]}
        />
      )}
    </div>
  );
};