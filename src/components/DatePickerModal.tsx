import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  selectedDate?: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  title?: string;
  minDate?: string;
  maxDate?: string;
}

/**
 * 自定义日期选择器模态框组件
 * 提供日期选择功能，包含确定和取消按钮
 */
export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  selectedDate,
  onConfirm,
  onCancel,
  title = '选择日期和时间',
  minDate,
  maxDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  // 初始化选中日期和时间
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const date = new Date(selectedDate);
        setCurrentDate(date);
        setTempSelectedDate(selectedDate.split('T')[0]);
        setSelectedHour(date.getHours());
        setSelectedMinute(date.getMinutes());
      } else {
        const today = new Date();
        setCurrentDate(today);
        setTempSelectedDate(today.toISOString().split('T')[0]);
        setSelectedHour(9);
        setSelectedMinute(0);
      }
    }
  }, [isOpen, selectedDate]);

  /**
   * 获取当月的天数
   */
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  /**
   * 获取当月第一天是星期几
   */
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  /**
   * 生成日历天数数组
   */
  const generateCalendarDays = (): (number | null)[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (number | null)[] = [];

    // 添加空白天数（上个月的尾部）
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  /**
   * 切换到上个月
   */
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  /**
   * 切换到下个月
   */
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  /**
   * 选择日期
   */
  const selectDate = (day: number) => {
    // 使用本地时间格式，避免时区转换问题
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const selectedDateStr = `${year}-${month}-${dayStr}`;
    
    // 检查日期限制
    if (minDate && selectedDateStr < minDate) return;
    if (maxDate && selectedDateStr > maxDate) return;
    
    setTempSelectedDate(selectedDateStr);
  };

  /**
   * 确认选择
   */
  const handleConfirm = () => {
    if (tempSelectedDate) {
      // 组合日期和时间，使用本地时间避免时区问题
      const [year, month, day] = tempSelectedDate.split('-').map(Number);
      const dateTime = new Date(year, month - 1, day, selectedHour, selectedMinute, 0, 0);
      
      // 格式化为本地时间字符串
      const isoString = dateTime.getFullYear() + '-' +
        (dateTime.getMonth() + 1).toString().padStart(2, '0') + '-' +
        dateTime.getDate().toString().padStart(2, '0') + 'T' +
        dateTime.getHours().toString().padStart(2, '0') + ':' +
        dateTime.getMinutes().toString().padStart(2, '0') + ':00';
      
      onConfirm(isoString);
    }
  };

  /**
   * 生成小时选项
   */
  const generateHourOptions = (): number[] => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  /**
   * 生成分钟选项
   */
  const generateMinuteOptions = (): number[] => {
    return Array.from({ length: 60 }, (_, i) => i);
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  /**
   * 检查日期是否被禁用
   */
  const isDateDisabled = (day: number): boolean => {
    // 使用本地时间格式
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    
    return false;
  };

  /**
   * 检查日期是否被选中
   */
  const isDateSelected = (day: number): boolean => {
    if (!tempSelectedDate) return false;
    
    // 使用本地时间格式
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    return dateStr === tempSelectedDate;
  };

  /**
   * 检查是否是今天
   */
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-w-sm mx-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 日历内容 */}
        <div className="p-4">
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
            </div>
            
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calendarDays.map((day, index) => (
              <div key={index} className="h-8">
                {day && (
                  <button
                    onClick={() => selectDate(day)}
                    disabled={isDateDisabled(day)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded transition-colors ${
                      isDateSelected(day)
                        ? 'bg-blue-600 text-white'
                        : isToday(day)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : isDateDisabled(day)
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 时间选择 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">选择时间</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 小时选择 */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">小时</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {generateHourOptions().map((hour) => (
                    <option key={hour} value={hour}>
                      {formatTime(hour)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-gray-500 dark:text-gray-400 text-lg font-bold pt-4">:</div>
              
              {/* 分钟选择 */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">分钟</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {generateMinuteOptions().map((minute) => (
                    <option key={minute} value={minute}>
                      {formatTime(minute)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 时间预览 */}
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">选择的时间：</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white ml-1">
                {formatTime(selectedHour)}:{formatTime(selectedMinute)}
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >取消</button>
          <button
            onClick={handleConfirm}
            disabled={!tempSelectedDate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            确定
          </button>
        </div>
      </div>
    </div>
  );
};