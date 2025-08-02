import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Priority, TimeRange, TaskFormData, Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';

interface TaskFormProps {
  editingTask?: Task | null;
  onCancel?: () => void;
  className?: string;
}

/**
 * 任务表单组件 - 用于添加和编辑任务
 */
export const TaskForm: React.FC<TaskFormProps> = ({ 
  editingTask, 
  onCancel, 
  className = '' 
}) => {
  const { addTask, updateTask } = useTaskStore();
  
  // 表单状态
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    deadline: '',
    priority: Priority.MEDIUM,
    timeRange: TimeRange.DAY,
    description: ''
  });

  /**
   * 当编辑任务变化时，更新表单数据
   */
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        deadline: editingTask.deadline || '',
        priority: editingTask.priority,
        timeRange: editingTask.timeRange,
        description: editingTask.description || ''
      });
    } else {
      // 重置表单
      setFormData({
        title: '',
        deadline: '',
        priority: Priority.MEDIUM,
        timeRange: TimeRange.DAY,
        description: ''
      });
    }
  }, [editingTask]);

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 提交表单
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    if (editingTask) {
      // 更新任务
      updateTask(editingTask.id, formData);
      onCancel?.();
    } else {
      // 添加新任务
      addTask(formData);
      // 重置表单
      setFormData({
        title: '',
        deadline: '',
        priority: Priority.MEDIUM,
        timeRange: TimeRange.DAY,
        description: ''
      });
    }
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    onCancel?.();
  };

  /**
   * 获取优先级显示文本
   */
  const getPriorityText = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return '高优先级';
      case Priority.MEDIUM:
        return '中优先级';
      case Priority.LOW:
        return '低优先级';
      default:
        return '中优先级';
    }
  };

  /**
   * 获取时间维度显示文本
   */
  const getTimeRangeText = (timeRange: TimeRange): string => {
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
        return '日任务';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {editingTask ? '编辑任务' : '添加新任务'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 任务标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            任务标题 *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="请输入任务标题"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* 截止时间和优先级 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              截止时间
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={Priority.LOW}>{getPriorityText(Priority.LOW)}</option>
              <option value={Priority.MEDIUM}>{getPriorityText(Priority.MEDIUM)}</option>
              <option value={Priority.HIGH}>{getPriorityText(Priority.HIGH)}</option>
            </select>
          </div>
        </div>

        {/* 时间维度 */}
        <div>
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
            时间维度
          </label>
          <select
            id="timeRange"
            value={formData.timeRange}
            onChange={(e) => handleInputChange('timeRange', e.target.value as TimeRange)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={TimeRange.DAY}>{getTimeRangeText(TimeRange.DAY)}</option>
            <option value={TimeRange.WEEK}>{getTimeRangeText(TimeRange.WEEK)}</option>
            <option value={TimeRange.MONTH}>{getTimeRangeText(TimeRange.MONTH)}</option>
            <option value={TimeRange.YEAR}>{getTimeRangeText(TimeRange.YEAR)}</option>
          </select>
        </div>

        {/* 任务描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="请输入任务描述（可选）"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingTask ? (
              <>
                <Save className="w-4 h-4" />
                保存修改
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                添加任务
              </>
            )}
          </button>
          
          {editingTask && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};