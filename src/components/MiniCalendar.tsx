import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Clock, Flag, Heart, Gift, Star, List } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { useTaskStore } from '@/store/taskStore';
import { useSpecialDateStore } from '@/store/specialDateStore';
import { Task, TimeRange, FilterType, Priority } from '@/types';
import { SpecialDateType } from '@/types/specialDate';

interface MiniCalendarProps {
  activeTimeRange?: TimeRange | null;
  onDateClick?: (date: Date, timeRange?: TimeRange) => void;
}

/**
 * 小型日历组件 - 显示当月日历和任务标记
 */
export const MiniCalendar: React.FC<MiniCalendarProps> = ({ activeTimeRange, onDateClick }) => {
  const { tasks, setFilter } = useTaskStore();
  const { specialDates } = useSpecialDateStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

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
   * 获取指定日期的特殊日期
   */
  const getSpecialDatesForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    return specialDates.filter(specialDate => {
      const specialDateObj = new Date(specialDate.date);
      
      if (specialDate.isRecurring) {
        // 重复事件：比较月日
        return (
          specialDateObj.getMonth() === targetDate.getMonth() &&
          specialDateObj.getDate() === targetDate.getDate()
        );
      } else {
        // 非重复事件：比较完整日期
        const specialDateStr = specialDateObj.toISOString().split('T')[0];
        const targetDateStr = targetDate.toISOString().split('T')[0];
        return specialDateStr === targetDateStr;
      }
    });
  };

  /**
   * 获取特殊日期类型的图标
   */
  const getSpecialDateIcon = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.BIRTHDAY:
        return <Gift className="w-2 h-2" />;
      case SpecialDateType.ANNIVERSARY:
        return <Heart className="w-2 h-2" />;
      case SpecialDateType.COUNTDOWN:
        return <Star className="w-2 h-2" />;
      default:
        return <Calendar className="w-2 h-2" />;
    }
  };

  /**
   * 获取特殊日期类型的颜色
   */
  const getSpecialDateColor = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.BIRTHDAY:
        return 'text-pink-500';
      case SpecialDateType.ANNIVERSARY:
        return 'text-red-500';
      case SpecialDateType.COUNTDOWN:
        return 'text-yellow-500';
      default:
        return 'text-purple-500';
    }
  };

  /**
   * 获取优先级颜色
   */
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case Priority.MEDIUM:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case Priority.LOW:
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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
      case TimeRange.TODAY:
        return isToday(day);
      case TimeRange.TOMORROW:
        const tomorrow = new Date(referenceDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
          targetDate.getFullYear() === tomorrow.getFullYear() &&
          targetDate.getMonth() === tomorrow.getMonth() &&
          targetDate.getDate() === tomorrow.getDate()
        );
      case TimeRange.THIS_WEEK:
        const startOfWeek = new Date(referenceDate);
        startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return targetDate >= startOfWeek && targetDate <= endOfWeek;
      case TimeRange.NEXT_WEEK:
        const nextWeekStart = new Date(referenceDate);
        nextWeekStart.setDate(referenceDate.getDate() - referenceDate.getDay() + 7);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return targetDate >= nextWeekStart && targetDate <= nextWeekEnd;
      case TimeRange.THIS_MONTH:
        return (
          targetDate.getFullYear() === referenceDate.getFullYear() &&
          targetDate.getMonth() === referenceDate.getMonth()
        );
      case TimeRange.NEXT_MONTH:
        const nextMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
        return (
          targetDate.getFullYear() === nextMonth.getFullYear() &&
          targetDate.getMonth() === nextMonth.getMonth()
        );
      default:
        return false;
    }
  };

  /**
   * 处理日期点击
   */
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 清除之前的定时器
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    
    // 设置新的定时器来区分单击和双击
    const timeout = setTimeout(() => {
      // 单击：显示任务弹窗
      setModalDate(clickedDate);
      setShowTaskModal(true);
      setClickTimeout(null);
    }, 200);
    
    setClickTimeout(timeout);
  };

  /**
   * 处理日期双击
   */
  const handleDateDoubleClick = (day: number) => {
    // 清除单击定时器
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    // 如果有回调函数，调用它
    if (onDateClick) {
      onDateClick(clickedDate, activeTimeRange || undefined);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
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
          
          const tasksCount = getTasksForDate(day).length;
          const specialDatesForDay = getSpecialDatesForDate(day);
          const taskStatus = getDayTaskStatus(day);
          const isCurrentDay = isToday(day);
          const isInRange = isInSelectedTimeRange(day);
          
          return (
            <button
              key={`day-${day}`}
              onClick={() => handleDateClick(day)}
              onDoubleClick={() => handleDateDoubleClick(day)}
              className={`
                relative h-8 text-xs rounded transition-colors
                ${
                  isCurrentDay
                    ? 'bg-blue-500 text-white font-medium'
                    : isInRange
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${
                  taskStatus === 'completed'
                    ? 'ring-1 ring-green-500'
                    : taskStatus === 'partial'
                    ? 'ring-1 ring-yellow-500'
                    : taskStatus === 'pending'
                    ? 'ring-1 ring-red-500'
                    : ''
                }
              `}
            >
              {day}
              
              {/* 任务数量指示器 */}
              {tasksCount > 0 && (
                <div className="absolute top-0 left-0 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
              
              {/* 特殊日期指示器 */}
              {specialDatesForDay.length > 0 && (
                <div className="absolute top-0 right-0 flex flex-col gap-0.5">
                  {specialDatesForDay.slice(0, 2).map((specialDate, specialIndex) => (
                    <div
                      key={`special-${day}-${specialDate.id}-${specialIndex}`}
                      className={`${getSpecialDateColor(specialDate.type)} opacity-80`}
                      title={specialDate.title}
                    >
                      {getSpecialDateIcon(specialDate.type)}
                    </div>
                  ))}
                  {specialDatesForDay.length > 2 && (
                    <div key={`more-indicator-${day}`} className="text-purple-500 opacity-60">
                      <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 任务弹窗 */}
      {showTaskModal && modalDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {modalDate.toLocaleDateString('zh-CN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 的安排
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* 内容列表 */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {(() => {
                const dayTasks = getTasksForDate(modalDate.getDate());
                const daySpecialDates = getSpecialDatesForDate(modalDate.getDate());
                
                if (dayTasks.length === 0 && daySpecialDates.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>这一天没有安排任务和特殊日期</p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-4">
                    {/* 特殊日期列表 */}
                    {daySpecialDates.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          特殊日期
                        </h4>
                        <div className="space-y-2">
                          {daySpecialDates.map((specialDate) => (
                            <div
                              key={specialDate.id}
                              className={`p-3 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700/50 border-l-current`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={getSpecialDateColor(specialDate.type)}>
                                  {getSpecialDateIcon(specialDate.type)}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {specialDate.title}
                                  </h5>
                                  {specialDate.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                      {specialDate.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-1 mt-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                                      specialDate.type === SpecialDateType.BIRTHDAY
                                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                                        : specialDate.type === SpecialDateType.ANNIVERSARY
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    }`}>
                                      {getSpecialDateIcon(specialDate.type)}
                                      {specialDate.type === SpecialDateType.BIRTHDAY ? '生日' :
                                       specialDate.type === SpecialDateType.ANNIVERSARY ? '纪念日' : '倒计时'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 任务列表 */}
                    {dayTasks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <List className="w-4 h-4" />
                          任务安排
                        </h4>
                        <div className="space-y-2">
                          {dayTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-3 rounded-lg border-l-4 ${
                                task.completed
                                  ? 'bg-gray-50 dark:bg-gray-700/50 border-l-green-500'
                                  : task.priority === Priority.HIGH
                                  ? 'bg-red-50 dark:bg-red-900/20 border-l-red-500'
                                  : task.priority === Priority.MEDIUM
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500'
                                  : 'bg-green-50 dark:bg-green-900/20 border-l-green-500'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-medium text-sm ${
                                    task.completed
                                      ? 'text-gray-500 dark:text-gray-400 line-through'
                                      : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {task.title}
                                  </h4>
                                  
                                  {task.description && (
                                    <p className={`text-xs mt-1 ${
                                      task.completed
                                        ? 'text-gray-400 dark:text-gray-500'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}>
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    {/* 优先级标签 */}
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                                      getPriorityColor(task.priority)
                                    }`}>
                                      <Flag className="w-3 h-3" />
                                      {getPriorityText(task.priority)}
                                    </span>
                                    
                                    {/* 截止时间 */}
                                    {task.deadline && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.deadline).toLocaleTimeString('zh-CN', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* 完成状态 */}
                                <div className="ml-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    task.completed
                                      ? 'bg-green-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};