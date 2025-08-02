import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Task, TimeRange, FilterType } from '@/types';

interface MiniCalendarProps {
  activeTimeRange?: TimeRange | null;
  onDateClick?: (date: Date, timeRange?: TimeRange) => void;
}

/**
 * 小型日历组件 - 显示当月日历和任务标记
 */
export const MiniCalendar: React.FC<MiniCalendarProps> = ({ activeTimeRange, onDateClick }) => {
  const { tasks, setFilter } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null);

  /**
   * 获取当前月份的第一天
   */
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  /**
   * 获取当前月份的最后一天
   */
  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }, [currentDate]);

  /**
   * 获取月份开始的星期几（0=周日，1=周一...）
   */
  const startDayOfWeek = useMemo(() => {
    return firstDayOfMonth.getDay();
  }, [firstDayOfMonth]);

  /**
   * 获取当月的天数
   */
  const daysInMonth = useMemo(() => {
    return lastDayOfMonth.getDate();
  }, [lastDayOfMonth]);

  /**
   * 生成日历网格数据
   */
  const calendarDays = useMemo(() => {
    const days = [];
    
    // 添加上个月的空白天数
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [startDayOfWeek, daysInMonth]);

  /**
   * 获取指定日期的任务
   */
  const getTasksForDate = (day: number): Task[] => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const targetDateStr = targetDate.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline).toISOString().split('T')[0];
      return taskDate === targetDateStr;
    });
  };

  /**
   * 获取日期的任务状态样式
   */
  const getDayTaskStatus = (day: number) => {
    const dayTasks = getTasksForDate(day);
    if (dayTasks.length === 0) return null;
    
    const completedTasks = dayTasks.filter(task => task.completed).length;
    const totalTasks = dayTasks.length;
    
    if (completedTasks === totalTasks) {
      return 'completed'; // 全部完成
    } else if (completedTasks > 0) {
      return 'partial'; // 部分完成
    } else {
      return 'pending'; // 待完成
    }
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
   * 检查是否是今天
   */
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day
    );
  };

  /**
   * 检查日期是否在当前选中的时间范围内
   */
  const isInSelectedTimeRange = (day: number): boolean => {
    if (!activeTimeRange) return false;
    
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 如果有选中的日期，使用选中的日期作为基准；否则使用今天
    const referenceDate = selectedDate || new Date();
    
    switch (activeTimeRange) {
      case TimeRange.DAY:
        // 日任务模式：只高亮选中的日期
        if (selectedDate) {
          return (
            targetDate.getFullYear() === selectedDate.getFullYear() &&
            targetDate.getMonth() === selectedDate.getMonth() &&
            targetDate.getDate() === selectedDate.getDate()
          );
        }
        // 如果没有选中日期，高亮今天
        const today = new Date();
        return (
          targetDate.getFullYear() === today.getFullYear() &&
          targetDate.getMonth() === today.getMonth() &&
          targetDate.getDate() === today.getDate()
        );
      
      case TimeRange.WEEK:
        // 获取参考日期所在周的开始和结束日期（周一到周日）
        const startOfWeek = new Date(referenceDate);
        const dayOfWeek = referenceDate.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日为0，需要特殊处理
        startOfWeek.setDate(referenceDate.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return targetDate >= startOfWeek && targetDate <= endOfWeek;
      
      case TimeRange.MONTH:
        return (
          targetDate.getFullYear() === referenceDate.getFullYear() &&
          targetDate.getMonth() === referenceDate.getMonth()
        );
      
      case TimeRange.YEAR:
        return targetDate.getFullYear() === referenceDate.getFullYear();
      
      default:
        return false;
    }
  };

  /**
   * 处理日期点击事件
   */
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 如果当前是周任务或月任务模式
    if (activeTimeRange === TimeRange.WEEK || activeTimeRange === TimeRange.MONTH) {
      // 第一次点击：切换到对应的时间范围
      if (!selectedDate || !isSameDate(selectedDate, clickedDate)) {
        setSelectedDate(clickedDate);
        setSelectedTimeRange(activeTimeRange);
        
        // 设置筛选器显示对应时间范围的任务
        if (activeTimeRange === TimeRange.WEEK) {
          setFilter({ type: FilterType.TIME_RANGE, timeRange: TimeRange.WEEK, date: clickedDate });
        } else if (activeTimeRange === TimeRange.MONTH) {
          setFilter({ type: FilterType.TIME_RANGE, timeRange: TimeRange.MONTH, date: clickedDate });
        }
        
        // 通知父组件
        onDateClick?.(clickedDate, activeTimeRange);
      } else {
        // 第二次点击同一天：显示当天的任务
        setSelectedTimeRange(TimeRange.DAY);
        setFilter({ type: FilterType.TIME_RANGE, timeRange: TimeRange.DAY, date: clickedDate });
        onDateClick?.(clickedDate, TimeRange.DAY);
      }
    } else {
      // 日任务模式或其他模式：直接显示当天任务
      setSelectedDate(clickedDate);
      setSelectedTimeRange(TimeRange.DAY);
      setFilter({ type: FilterType.TIME_RANGE, timeRange: TimeRange.DAY, date: clickedDate });
      onDateClick?.(clickedDate, TimeRange.DAY);
    }
  };

  /**
   * 检查两个日期是否是同一天
   */
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">
            {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8"></div>;
          }

          const taskStatus = getDayTaskStatus(day);
          const today = isToday(day);
          const tasksCount = getTasksForDate(day).length;

          const isInRange = isInSelectedTimeRange(day);
          const isSelected = selectedDate && isSameDate(selectedDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
          
          return (
            <button
              key={`day-${day}`}
              onClick={() => handleDateClick(day)}
              className={`h-8 flex items-center justify-center text-xs relative rounded transition-colors cursor-pointer ${
                today
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : isSelected
                  ? 'bg-indigo-100 text-indigo-700 font-semibold ring-2 ring-indigo-300'
                  : isInRange
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${
                tasksCount > 0 ? 'hover:bg-blue-50' : ''
              }`}
            >
              <span>{day}</span>
              
              {/* 任务状态指示器 */}
              {taskStatus && (
                <div
                  className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${
                    taskStatus === 'completed'
                      ? 'bg-green-500'
                      : taskStatus === 'partial'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                ></div>
              )}
              
              {/* 任务数量指示器 */}
              {tasksCount > 0 && (
                <div className="absolute top-0 left-0 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
    </div>
  );
};