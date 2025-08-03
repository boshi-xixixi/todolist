import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react';

interface DatePickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

/**
 * 年份月份快速切换组件
 * 提供年份和月份的下拉选择器，以及快速跳转到今天的功能
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  currentDate,
  onDateChange,
  className = ''
}) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  // 当外部传入的日期变化时，更新内部状态
  useEffect(() => {
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth());
  }, [currentDate]);

  /**
   * 生成年份选项（当前年份前后各5年）
   */
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  /**
   * 月份选项
   */
  const monthOptions = [
    { value: 0, label: '一月' },
    { value: 1, label: '二月' },
    { value: 2, label: '三月' },
    { value: 3, label: '四月' },
    { value: 4, label: '五月' },
    { value: 5, label: '六月' },
    { value: 6, label: '七月' },
    { value: 7, label: '八月' },
    { value: 8, label: '九月' },
    { value: 9, label: '十月' },
    { value: 10, label: '十一月' },
    { value: 11, label: '十二月' }
  ];

  /**
   * 处理年份选择
   */
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    const newDate = new Date(year, selectedMonth, 1);
    onDateChange(newDate);
  };

  /**
   * 处理月份选择
   */
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    const newDate = new Date(selectedYear, month, 1);
    onDateChange(newDate);
  };

  /**
   * 快速跳转到今天
   */
  const goToToday = () => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setIsYearOpen(false);
    setIsMonthOpen(false);
    onDateChange(today);
  };

  /**
   * 关闭所有下拉菜单
   */
  const closeAllDropdowns = () => {
    setIsYearOpen(false);
    setIsMonthOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.date-picker-dropdown')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const yearOptions = generateYearOptions();
  const currentMonthLabel = monthOptions[selectedMonth]?.label || '一月';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 日历图标 */}
      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      
      {/* 年份选择器 */}
      <div className="relative date-picker-dropdown">
        <button
          onClick={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span>{selectedYear}年</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* 年份下拉菜单 */}
        {isYearOpen && (
          <div className="absolute top-full left-0 mt-1 w-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {yearOptions.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  year === selectedYear
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {year}年
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 月份选择器 */}
      <div className="relative date-picker-dropdown">
        <button
          onClick={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsYearOpen(false);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span>{currentMonthLabel}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMonthOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* 月份下拉菜单 */}
        {isMonthOpen && (
          <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {monthOptions.map((month) => (
              <button
                key={month.value}
                onClick={() => handleMonthSelect(month.value)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  month.value === selectedMonth
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

      {/* 快速跳转到今天按钮 */}
      <button
        onClick={goToToday}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        title="跳转到今天"
      >
        <RotateCcw className="w-3 h-3" />
        <span>今天</span>
      </button>
    </div>
  );
};