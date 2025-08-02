import React from 'react';
import { X, Calendar, Clock, Flag, CheckCircle, Circle } from 'lucide-react';
import { Task, Priority, TimeRange } from '@/types';
import { useTaskStore } from '@/store/taskStore';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTimeRange: TimeRange | null;
  tasks: Task[];
}

/**
 * 任务详情弹窗组件 - 显示选中日期/时间范围的任务列表
 */
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeRange,
  tasks
}) => {
  const { toggleTask } = useTaskStore();

  if (!isOpen) return null;

  /**
   * 获取优先级颜色
   */
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'text-red-600 bg-red-50';
      case Priority.MEDIUM:
        return 'text-yellow-600 bg-yellow-50';
      case Priority.LOW:
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  /**
   * 获取优先级文本
   */
  const getPriorityText = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return '高';
      case Priority.MEDIUM:
        return '中';
      case Priority.LOW:
        return '低';
      default:
        return '无';
    }
  };

  /**
   * 获取时间范围文本
   */
  const getTimeRangeText = (timeRange: TimeRange) => {
    switch (timeRange) {
      case TimeRange.DAY:
        return '日任务';
      case TimeRange.WEEK:
        return '周任务';
      case TimeRange.MONTH:
        return '月任务';
      case TimeRange.YEAR:
        return '年任务';
      default:
        return '任务';
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  /**
   * 获取标题
   */
  const getTitle = () => {
    if (selectedTimeRange) {
      return `${getTimeRangeText(selectedTimeRange)} (${tasks.length}个)`;
    }
    if (selectedDate) {
      return `${formatDate(selectedDate)} 的任务 (${tasks.length}个)`;
    }
    return `任务详情 (${tasks.length}个)`;
  };

  /**
   * 处理任务完成状态切换
   */
  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 任务列表 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* 完成状态按钮 */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>

                  {/* 任务内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm mt-1 ${
                        task.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    {/* 任务元信息 */}
                    <div className="flex items-center gap-4 mt-2">
                      {/* 优先级 */}
                      <div className="flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          getPriorityColor(task.priority)
                        }`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </div>

                      {/* 时间维度 */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {getTimeRangeText(task.timeRange)}
                        </span>
                      </div>

                      {/* 截止时间 */}
                      {task.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {new Date(task.deadline).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
              <p className="text-gray-500">
                {selectedDate ? '这一天' : '这个时间范围内'}还没有安排任务
              </p>
            </div>
          )}
        </div>

        {/* 数据存储说明 */}
        <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>数据保存在浏览器本地存储中，请注意备份重要数据</span>
          </div>
        </div>
      </div>
    </div>
  );
};