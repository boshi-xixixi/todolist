import React from 'react';
import { Filter, Calendar, CheckCircle, Flag } from 'lucide-react';
import { FilterType, TimeRange, Priority } from '@/types';
import { useTaskStore } from '@/store/taskStore';

/**
 * 任务筛选组件 - 提供多维度的任务筛选功能
 */
export const TaskFilter: React.FC = () => {
  const { filter, setFilter } = useTaskStore();

  /**
   * 获取筛选类型显示文本
   */
  const getFilterTypeText = (filterType: FilterType): string => {
    switch (filterType) {
      case FilterType.ALL:
        return '全部任务';
      case FilterType.PENDING:
        return '待完成';
      case FilterType.COMPLETED:
        return '已完成';
      default:
        return '全部任务';
    }
  };

  /**
   * 获取时间维度显示文本
   */
  const getTimeRangeText = (timeRange?: TimeRange): string => {
    if (!timeRange) return '全部时间';
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
        return '全部时间';
    }
  };

  /**
   * 获取优先级显示文本
   */
  const getPriorityText = (priority?: Priority): string => {
    if (!priority) return '全部优先级';
    switch (priority) {
      case Priority.HIGH:
        return '高优先级';
      case Priority.MEDIUM:
        return '中优先级';
      case Priority.LOW:
        return '低优先级';
      default:
        return '全部优先级';
    }
  };

  /**
   * 更新筛选条件
   */
  const updateFilter = (updates: Partial<typeof filter>) => {
    setFilter({ ...filter, ...updates });
  };

  /**
   * 重置筛选条件
   */
  const resetFilter = () => {
    setFilter({
      type: FilterType.ALL,
      timeRange: undefined,
      priority: undefined
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">筛选条件</h3>
        <button
          onClick={resetFilter}
          className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          重置
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 完成状态筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CheckCircle className="w-4 h-4" />
            完成状态
          </label>
          <select
            value={filter.type}
            onChange={(e) => updateFilter({ type: e.target.value as FilterType })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value={FilterType.ALL}>{getFilterTypeText(FilterType.ALL)}</option>
            <option value={FilterType.PENDING}>{getFilterTypeText(FilterType.PENDING)}</option>
            <option value={FilterType.COMPLETED}>{getFilterTypeText(FilterType.COMPLETED)}</option>
          </select>
        </div>

        {/* 时间维度筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            时间维度
          </label>
          <select
            value={filter.timeRange || ''}
            onChange={(e) => updateFilter({ 
              timeRange: e.target.value ? e.target.value as TimeRange : undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">{getTimeRangeText()}</option>
            <option value={TimeRange.DAY}>{getTimeRangeText(TimeRange.DAY)}</option>
            <option value={TimeRange.WEEK}>{getTimeRangeText(TimeRange.WEEK)}</option>
            <option value={TimeRange.MONTH}>{getTimeRangeText(TimeRange.MONTH)}</option>
            <option value={TimeRange.YEAR}>{getTimeRangeText(TimeRange.YEAR)}</option>
          </select>
        </div>

        {/* 优先级筛选 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Flag className="w-4 h-4" />
            优先级
          </label>
          <select
            value={filter.priority || ''}
            onChange={(e) => updateFilter({ 
              priority: e.target.value ? e.target.value as Priority : undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">{getPriorityText()}</option>
            <option value={Priority.HIGH}>{getPriorityText(Priority.HIGH)}</option>
            <option value={Priority.MEDIUM}>{getPriorityText(Priority.MEDIUM)}</option>
            <option value={Priority.LOW}>{getPriorityText(Priority.LOW)}</option>
          </select>
        </div>
      </div>

      {/* 当前筛选状态显示 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">当前筛选：</span>
          
          {/* 完成状态标签 */}
          {filter.type !== FilterType.ALL && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <CheckCircle className="w-3 h-3" />
              {getFilterTypeText(filter.type)}
            </span>
          )}
          
          {/* 时间维度标签 */}
          {filter.timeRange && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Calendar className="w-3 h-3" />
              {getTimeRangeText(filter.timeRange)}
            </span>
          )}
          
          {/* 优先级标签 */}
          {filter.priority && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              filter.priority === Priority.HIGH
                ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                : filter.priority === Priority.MEDIUM
                  ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30'
                  : 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30'
            }`}>
              <Flag className="w-3 h-3" />
              {getPriorityText(filter.priority)}
            </span>
          )}
          
          {/* 无筛选条件时的提示 */}
          {filter.type === FilterType.ALL && !filter.timeRange && !filter.priority && (
            <span className="text-xs text-gray-500 dark:text-gray-400">显示全部任务</span>
          )}
        </div>
      </div>
    </div>
  );
};