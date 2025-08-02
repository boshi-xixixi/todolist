import React from 'react';
import { Edit, Trash2, Clock, Calendar, Flag } from 'lucide-react';
import { Task, Priority, TimeRange } from '@/types';
import { useTaskStore } from '@/store/taskStore';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

/**
 * 任务列表项组件 - 显示单个任务的详细信息
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, toggleTaskComplete } = useTaskStore();

  /**
   * 获取优先级颜色样式
   */
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return 'text-red-600 bg-red-50 border-red-200';
      case Priority.MEDIUM:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Priority.LOW:
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  /**
   * 获取优先级显示文本
   */
  const getPriorityText = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return '高';
      case Priority.MEDIUM:
        return '中';
      case Priority.LOW:
        return '低';
      default:
        return '中';
    }
  };

  /**
   * 获取时间维度颜色样式
   */
  const getTimeRangeColor = (timeRange: TimeRange): string => {
    switch (timeRange) {
      case TimeRange.DAY:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case TimeRange.WEEK:
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case TimeRange.MONTH:
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case TimeRange.YEAR:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  /**
   * 获取时间维度显示文本
   */
  const getTimeRangeText = (timeRange: TimeRange): string => {
    switch (timeRange) {
      case TimeRange.DAY:
        return '日';
      case TimeRange.WEEK:
        return '周';
      case TimeRange.MONTH:
        return '月';
      case TimeRange.YEAR:
        return '年';
      default:
        return '日';
    }
  };

  /**
   * 格式化截止时间显示
   */
  const formatDeadline = (deadline?: string): string => {
    if (!deadline) return '';
    
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `已逾期 ${Math.abs(diffDays)} 天`;
    } else if (diffDays === 0) {
      return '今天到期';
    } else if (diffDays === 1) {
      return '明天到期';
    } else {
      return `${diffDays} 天后到期`;
    }
  };

  /**
   * 获取截止时间颜色样式
   */
  const getDeadlineColor = (deadline?: string): string => {
    if (!deadline) return 'text-gray-500';
    
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'text-red-600'; // 已逾期
    } else if (diffDays <= 1) {
      return 'text-orange-600'; // 即将到期
    } else {
      return 'text-gray-600'; // 正常
    }
  };

  /**
   * 切换任务完成状态
   */
  const handleToggleComplete = () => {
    toggleTaskComplete(task.id);
  };

  /**
   * 删除任务
   */
  const handleDelete = () => {
    if (window.confirm('确定要删除这个任务吗？')) {
      deleteTask(task.id);
    }
  };

  /**
   * 编辑任务
   */
  const handleEdit = () => {
    onEdit(task);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'border-l-green-500 bg-gray-50' 
        : getPriorityColor(task.priority).includes('red') 
          ? 'border-l-red-500'
          : getPriorityColor(task.priority).includes('yellow')
            ? 'border-l-yellow-500'
            : 'border-l-green-500'
    }`}>
      <div className="flex items-start justify-between">
        {/* 任务主要信息 */}
        <div className="flex-1 min-w-0">
          {/* 任务标题和完成状态 */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <h3 className={`text-lg font-medium truncate ${
              task.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </div>

          {/* 任务描述 */}
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* 任务标签和信息 */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* 优先级标签 */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
              getPriorityColor(task.priority)
            }`}>
              <Flag className="w-3 h-3" />
              {getPriorityText(task.priority)}优先级
            </span>

            {/* 时间维度标签 */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
              getTimeRangeColor(task.timeRange)
            }`}>
              <Calendar className="w-3 h-3" />
              {getTimeRangeText(task.timeRange)}任务
            </span>

            {/* 截止时间 */}
            {task.deadline && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-50 border border-gray-200 ${
                getDeadlineColor(task.deadline)
              }`}>
                <Clock className="w-3 h-3" />
                {formatDeadline(task.deadline)}
              </span>
            )}
          </div>

          {/* 创建时间 */}
          <p className="text-xs text-gray-400">
            创建于 {new Date(task.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="编辑任务"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="删除任务"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};