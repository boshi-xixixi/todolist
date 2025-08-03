import React, { useState } from 'react';
import { Calendar, Clock, CalendarDays, CalendarRange, BarChart3, Eye, CalendarCheck, Heart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TimeRange, Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { TaskDetailModal } from './TaskDetailModal';
import { ThemeToggleSimple } from './ThemeToggle';

interface TaskSidebarProps {
  activeTimeRange: TimeRange | null;
  onTimeRangeChange: (timeRange: TimeRange | null) => void;
  activeTab: 'tasks' | 'stats' | 'today';
  onTabChange: (tab: 'tasks' | 'stats' | 'today') => void;
}

/**
 * 任务分类侧边栏组件 - 显示任务分类和导航
 */
export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  activeTimeRange,
  onTimeRangeChange,
  activeTab,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const { getTaskStats, getTasksByTimeRange, tasks } = useTaskStore();
  const stats = getTaskStats();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalTasks, setModalTasks] = useState<Task[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null);

  /**
   * 获取时间范围的任务统计
   */
  const getTimeRangeStats = (timeRange: TimeRange) => {
    return stats.byTimeRange[timeRange] || { total: 0, completed: 0 };
  };

  /**
   * 获取全部任务统计
   */
  const getAllTasksStats = () => {
    return { total: stats.total, completed: stats.completed };
  };

  /**
   * 获取指定时间范围的任务列表
   */
  const getTasksForTimeRange = (timeRange: TimeRange | null): Task[] => {
    if (timeRange === null) {
      return tasks;
    }
    return getTasksByTimeRange(timeRange);
  };

  /**
   * 处理查看任务详情
   */
  const handleViewTasks = (timeRange: TimeRange | null, event: React.MouseEvent) => {
    event.stopPropagation();
    const timeRangeTasks = getTasksForTimeRange(timeRange);
    setModalTasks(timeRangeTasks);
    setSelectedTimeRange(timeRange);
    setShowTaskModal(true);
  };

  /**
   * 关闭任务详情弹窗
   */
  const handleCloseModal = () => {
    setShowTaskModal(false);
    setModalTasks([]);
    setSelectedTimeRange(null);
  };

  /**
   * 获取激活状态的背景类名
   */
  const getActiveBackgroundClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700';
      case 'green': return 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700';
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700';
      default: return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  /**
   * 获取激活状态的文本类名
   */
  const getActiveTextClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-700 dark:text-blue-300';
      case 'green': return 'text-green-700 dark:text-green-300';
      case 'purple': return 'text-purple-700 dark:text-purple-300';
      case 'indigo': return 'text-indigo-700 dark:text-indigo-300';
      case 'orange': return 'text-orange-700 dark:text-orange-300';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  /**
   * 获取激活状态的按钮类名
   */
  const getActiveButtonClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50';
      case 'green': return 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50';
      case 'purple': return 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50';
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50';
      case 'orange': return 'text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800/50';
      default: return 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';
    }
  };

  const timeRangeItems = [
    {
      key: null,
      label: '全部任务',
      icon: Calendar,
      stats: getAllTasksStats(),
      color: 'blue',
    },
    {
      key: TimeRange.DAY,
      label: '日任务',
      icon: Clock,
      stats: getTimeRangeStats(TimeRange.DAY),
      color: 'green',
    },
    {
      key: TimeRange.WEEK,
      label: '周任务',
      icon: CalendarDays,
      stats: getTimeRangeStats(TimeRange.WEEK),
      color: 'purple',
    },
    {
      key: TimeRange.MONTH,
      label: '月任务',
      icon: CalendarDays,
      stats: getTimeRangeStats(TimeRange.MONTH),
      color: 'indigo',
    },
    {
      key: TimeRange.YEAR,
      label: '年任务',
      icon: CalendarRange,
      stats: getTimeRangeStats(TimeRange.YEAR),
      color: 'orange',
    },
  ];

  const tabItems = [
    {
      key: 'tasks' as const,
      label: '任务管理',
      icon: Calendar,
    },
    {
      key: 'today' as const,
      label: '今日任务',
      icon: CalendarDays,
    },
    {
      key: 'special-dates' as const,
      label: '特殊日',
      icon: Heart,
    },
    {
      key: 'notes' as const,
      label: '记事本',
      icon: BookOpen,
    },
    {
      key: 'stats' as const,
      label: '统计分析',
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full">
      {/* 侧边栏头部 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">TodoList</h2>
          <ThemeToggleSimple />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">任务管理系统</p>
      </div>

      {/* 主要导航 */}
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          主要功能
        </h3>
        <div className="space-y-1">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === 'today') {
                    navigate('/today');
                  } else if (item.key === 'special-dates') {
                    navigate('/special-dates');
                  } else if (item.key === 'notes') {
                    navigate('/notes');
                  } else {
                    onTabChange(item.key);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 任务分类 */}
      {activeTab === 'tasks' && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            任务分类
          </h3>
          <div className="space-y-1">
            {timeRangeItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTimeRange === item.key;
              const { total, completed } = item.stats;
              const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={item.key || 'all'}
                  className={`flex items-center gap-1 rounded-lg ${
                    isActive
                      ? getActiveBackgroundClass(item.color)
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <button
                    onClick={() => onTimeRangeChange(item.key)}
                    className={`flex-1 flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? getActiveTextClass(item.color)
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{total}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{completionRate}%</div>
                    </div>
                  </button>
                  
                  {/* 查看任务详情按钮 */}
                  {total > 0 && (
                    <button
                      onClick={(e) => handleViewTasks(item.key, e)}
                      className={`p-2 rounded-r-lg transition-colors ${
                        isActive
                          ? getActiveButtonClass(item.color)
                          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={`查看${item.label}详情`}
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 任务详情弹窗 */}
      <TaskDetailModal
        isOpen={showTaskModal}
        onClose={handleCloseModal}
        selectedDate={null}
        selectedTimeRange={selectedTimeRange}
        tasks={modalTasks}
      />
    </div>
  );
};