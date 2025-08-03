import React, { useState } from 'react';
import { Task, Priority, TimeRange } from '../types';
import { useTaskStore } from '../store/taskStore';
import { Calendar, Clock, Edit, Flag, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'sonner';

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
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case Priority.MEDIUM:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case Priority.LOW:
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
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
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      case TimeRange.WEEK:
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700';
      case TimeRange.MONTH:
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700';
      case TimeRange.YEAR:
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
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
   * 检查是否为自动设置的截止日期（23:59:59）
   */
  const isAutoSetDeadline = (startDate?: string, deadline?: string): boolean => {
    if (!startDate || !deadline) return false;
    
    const start = new Date(startDate);
    const end = new Date(deadline);
    
    // 检查是否为同一天且截止时间为23:59:59
    return start.toDateString() === end.toDateString() && 
           end.getHours() === 23 && 
           end.getMinutes() === 59 && 
           end.getSeconds() === 59;
  };

  /**
   * 格式化开始时间显示
   */
  const formatStartTime = (startDate?: string): string => {
    if (!startDate) return '';
    
    const date = new Date(startDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
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
    if (!deadline) return 'text-gray-500 dark:text-gray-400';
    
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'text-red-600 dark:text-red-400'; // 已逾期
    } else if (diffDays <= 1) {
      return 'text-orange-600 dark:text-orange-400'; // 即将到期
    } else {
      return 'text-gray-600 dark:text-gray-400'; // 正常
    }
  };

  /**
   * 鼓励语句数组
   */
  const encouragementMessages = [
    '🎉 太棒了！又完成了一个任务！',
    '✨ 继续保持，你真厉害！',
    '🚀 干得漂亮！效率满分！',
    '💪 你真是个行动派！',
    '🌟 完美！离目标又近了一步！',
    '🎯 精准完成！你是最棒的！',
    '⚡ 速度与激情！任务完成！',
    '🏆 又一个胜利！为你点赞！',
    '🎊 成就解锁！继续加油！',
    '💎 质量与效率并存！赞！'
  ];

  /**
   * 获取随机鼓励语句
   */
  const getRandomEncouragement = () => {
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  };

  /**
   * 切换任务完成状态
   */
  const handleToggleComplete = async () => {
    try {
      const wasCompleted = task.completed;
      await toggleTaskComplete(task.id);
      
      // 如果任务从未完成变为完成，显示鼓励语句
      if (!wasCompleted) {
        toast.success(getRandomEncouragement(), {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('切换任务状态失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * 显示删除确认弹窗
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🗑️ 删除按钮被点击，任务ID:', task.id, '任务标题:', task.title);
    setShowDeleteConfirm(true);
  };

  /**
   * 确认删除任务
   */
  const handleConfirmDelete = async () => {
    console.log('用户确认删除:', task.id);
    setShowDeleteConfirm(false);
    
    try {
      console.log('🚀 开始删除任务:', task.id);
      const result = await deleteTask(task.id);
      console.log('✅ 任务删除成功:', task.id, '删除结果:', result);
      
      // 可选：显示成功提示
      console.log(`任务"${task.title}"已成功删除`);
    } catch (error) {
      console.error('❌ 删除任务失败:', error);
      console.error('错误详情:', {
        taskId: task.id,
        taskTitle: task.title,
        error: error
      });
      alert(`删除任务"${task.title}"失败，请重试。\n\n错误信息：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  /**
   * 取消删除
   */
  const handleCancelDelete = () => {
    console.log('用户取消删除操作');
    setShowDeleteConfirm(false);
  };

  /**
   * 编辑任务
   */
  const handleEdit = () => {
    onEdit(task);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'border-l-green-500 bg-gray-50 dark:bg-gray-700/50' 
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
              className="w-5 h-5 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <h3 className={`text-lg font-medium truncate ${
              task.completed 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
          </div>

          {/* 任务描述 */}
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
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

            {/* 时间显示 */}
            {task.startDate && isAutoSetDeadline(task.startDate, task.deadline) ? (
              // 对于自动设置截止日期的任务，只显示开始时间
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-700 border border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3" />
                开始时间 {formatStartTime(task.startDate)}
              </span>
            ) : (
              // 对于有明确截止日期的任务，显示截止时间
              task.deadline && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 ${
                  getDeadlineColor(task.deadline)
                }`}>
                  <Clock className="w-3 h-3" />
                  {formatDeadline(task.deadline)}
                </span>
              )
            )}
          </div>

          {/* 创建时间 */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            创建于 {new Date(task.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="编辑任务"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-800"
            title="删除任务"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="删除任务"
        message={`确定要删除任务"${task.title}"吗？\n\n此操作无法撤销，请谨慎操作。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
};