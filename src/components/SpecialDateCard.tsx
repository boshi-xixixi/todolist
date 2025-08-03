import React from 'react';
import { Calendar, Clock, Gift, Heart, Edit, Trash2, Bell } from 'lucide-react';
import { SpecialDate, SpecialDateType } from '@/types/specialDate';
import { useSpecialDateStore } from '@/store/specialDateStore';

interface SpecialDateCardProps {
  specialDate: SpecialDate;
  onEdit: (specialDate: SpecialDate) => void;
  onDelete: (id: string) => void;
}

/**
 * 特殊日期卡片组件
 */
export function SpecialDateCard({ specialDate, onEdit, onDelete }: SpecialDateCardProps) {
  const { calculateSpecialDate } = useSpecialDateStore();
  const calculation = calculateSpecialDate(specialDate);
  
  /**
   * 获取类型图标
   */
  const getTypeIcon = () => {
    switch (specialDate.type) {
      case SpecialDateType.COUNTDOWN:
        return Clock;
      case SpecialDateType.BIRTHDAY:
        return Gift;
      case SpecialDateType.ANNIVERSARY:
        return Heart;
      default:
        return Calendar;
    }
  };
  
  /**
   * 获取类型标签
   */
  const getTypeLabel = () => {
    switch (specialDate.type) {
      case SpecialDateType.COUNTDOWN:
        return '倒数日';
      case SpecialDateType.BIRTHDAY:
        return '生日';
      case SpecialDateType.ANNIVERSARY:
        return '纪念日';
      default:
        return '特殊日期';
    }
  };
  
  /**
   * 获取类型颜色
   */
  const getTypeColor = () => {
    switch (specialDate.type) {
      case SpecialDateType.COUNTDOWN:
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case SpecialDateType.BIRTHDAY:
        return 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30';
      case SpecialDateType.ANNIVERSARY:
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  /**
   * 获取状态颜色
   */
  const getStatusColor = () => {
    if (calculation.isToday) {
      return 'text-green-600 dark:text-green-400';
    } else if (calculation.daysUntil > 0 && calculation.daysUntil <= 7) {
      return 'text-orange-600 dark:text-orange-400';
    } else if (calculation.isPast) {
      return 'text-red-600 dark:text-red-400';
    } else {
      return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  /**
   * 格式化日期显示
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      ...(specialDate.isRecurring ? {} : { year: 'numeric' })
    });
  };
  
  const TypeIcon = getTypeIcon();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* 头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {specialDate.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getTypeLabel()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(specialDate)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(specialDate.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 描述 */}
      {specialDate.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {specialDate.description}
        </p>
      )}
      
      {/* 日期信息 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">日期</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(specialDate.date)}
          </span>
        </div>
        
        {specialDate.isRecurring && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">重复</span>
            <span className="text-sm text-blue-600 dark:text-blue-400">每年</span>
          </div>
        )}
        
        {specialDate.reminderDays && specialDate.reminderDays > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">提醒</span>
            <div className="flex items-center space-x-1">
              <Bell className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                提前 {specialDate.reminderDays} 天
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* 倒数信息 */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">状态</span>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {calculation.displayText}
          </span>
        </div>
        
        {calculation.nextOccurrence !== specialDate.date && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">下次</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(calculation.nextOccurrence)}
            </span>
          </div>
        )}
      </div>
      
      {/* 今天标识 */}
      {calculation.isToday && (
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              今天是这个特殊的日子！
            </span>
          </div>
        </div>
      )}
    </div>
  );
}