import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DatePickerModal } from './DatePickerModal';

interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
}

/**
 * 自定义日期输入组件
 * 点击后弹出日期选择器模态框
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = '选择日期',
  label,
  className = '',
  minDate,
  maxDate,
  required = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 格式化日期显示
   */
  const formatDateDisplay = (dateStr?: string): string => {
    if (!dateStr) return placeholder;
    
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
  };

  /**
   * 处理日期确认
   */
  const handleDateConfirm = (selectedDate: string) => {
    onChange(selectedDate);
    setIsModalOpen(false);
  };

  /**
   * 处理取消
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 清除日期
   */
  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={className}>
      {/* 标签 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 日期输入框 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full px-3 py-2 pr-10 text-left border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {formatDateDisplay(value)}
          </span>
        </button>
        
        {/* 日历图标 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* 清除按钮 */}
        {value && (
          <button
            type="button"
            onClick={clearDate}
            className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* 日期选择器模态框 */}
      <DatePickerModal
        isOpen={isModalOpen}
        selectedDate={value}
        onConfirm={handleDateConfirm}
        onCancel={handleCancel}
        title={label || '选择日期'}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};