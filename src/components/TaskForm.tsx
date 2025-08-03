import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, X, Sparkles } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskFormData, Priority, TimeRange, Task } from '../types';
import { DateInput } from './DateInput';

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
  const { addTask, updateTask, isLoading } = useTaskStore();
  
  // 表单状态
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    startDate: new Date().toISOString(), // 默认为今天的当前时间
    deadline: '',
    priority: Priority.MEDIUM,
    timeRange: TimeRange.DAY,
    description: ''
  });

  // 日期验证错误状态
  const [dateError, setDateError] = useState<string>('');
  
  // 自然语言输入状态
  const [naturalInput, setNaturalInput] = useState<string>('');
  const [isParsingNatural, setIsParsingNatural] = useState<boolean>(false);
  
  // 用于防止useEffect重复触发的标记
  const isInitializedRef = useRef<boolean>(false);

  /**
   * 当编辑任务变化时，更新表单数据
   */
  useEffect(() => {
    if (editingTask && !isInitializedRef.current) {
      setFormData({
        title: editingTask.title,
        startDate: editingTask.startDate || new Date().toISOString(),
        deadline: editingTask.deadline || '',
        priority: editingTask.priority,
        timeRange: editingTask.timeRange,
        description: editingTask.description || ''
      });
      isInitializedRef.current = true;
    } else if (!editingTask) {
      // 重置表单
      setFormData({
        title: '',
        startDate: new Date().toISOString(), // 默认为今天的当前时间
        deadline: '',
        priority: Priority.MEDIUM,
        timeRange: TimeRange.DAY,
        description: ''
      });
      isInitializedRef.current = false;
    }
    setDateError(''); // 清除日期错误
  }, [editingTask]);

  /**
   * 根据截止日期自动计算时间维度
   */
  const calculateTimeRange = (deadline: string): TimeRange => {
    if (!deadline) return TimeRange.DAY;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    // 计算天数差
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 根据时间差自动判断时间维度
    if (diffDays <= 2) {
      return TimeRange.DAY; // 今天或明天
    } else if (diffDays <= 7) {
      return TimeRange.WEEK; // 本周内
    } else if (diffDays <= 30) {
      return TimeRange.MONTH; // 本月内
    } else {
      return TimeRange.YEAR; // 更长时间
    }
  };

  /**
   * 验证日期逻辑
   */
  const validateDates = (startDate: string, deadline: string): string => {
    if (!startDate || !deadline) return '';
    
    const start = new Date(startDate);
    const end = new Date(deadline);
    
    if (start > end) {
      return '开始日期不能晚于截止日期';
    }
    
    return '';
  };

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // 如果修改的是截止时间，自动计算时间维度
      if (field === 'deadline' && value) {
        newData.timeRange = calculateTimeRange(value);
      }
      
      // 验证日期
      const error = validateDates(
        field === 'startDate' ? value : prev.startDate || '',
        field === 'deadline' ? value : prev.deadline || ''
      );
      setDateError(error);
      
      return newData;
    });
  };

  /**
   * 提交表单
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    // 检查日期验证错误
    if (dateError) {
      alert(dateError);
      return;
    }

    try {
      // 处理截止日期逻辑：如果只设置了开始日期而没有设置截止日期，自动设置为当天的23:59:59
      let processedFormData = { ...formData };
      
      if (formData.startDate && !formData.deadline) {
        const startDate = new Date(formData.startDate);
        const endOfDay = new Date(startDate);
        endOfDay.setHours(23, 59, 59, 999);
        processedFormData.deadline = endOfDay.toISOString();
        console.log('自动设置截止日期为当天23:59:59:', processedFormData.deadline);
      }
      
      if (editingTask) {
        // 更新任务
        await updateTask(editingTask.id, processedFormData);
        onCancel?.();
      } else {
        // 添加新任务
        await addTask(processedFormData);
        // 重置表单
        setFormData({
          title: '',
          startDate: new Date().toISOString(), // 默认为今天的当前时间
          deadline: '',
          priority: Priority.MEDIUM,
          timeRange: TimeRange.DAY,
          description: ''
        });
        setDateError(''); // 清除错误
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert(editingTask ? '更新任务失败，请重试' : '添加任务失败，请重试');
    }
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    onCancel?.();
  };

  /**
   * 自然语言解析功能
   */
  const parseNaturalLanguage = (input: string): Partial<TaskFormData> => {
    const result: Partial<TaskFormData> = {};
    const now = new Date();
    
    // 提取任务标题（去除时间相关词汇后的主要内容）
    let title = input;
    const timeKeywords = ['明天', '后天', '下周', '下个月', '本周', '本月', '今天', '晚上', '上午', '下午', '中午', '早上'];
    const actionKeywords = ['开会', '会议', '提交', '完成', '做', '写', '看', '学习', '复习', '准备'];
    
    // 时间解析
    const timePatterns = [
      { pattern: /明天/g, days: 1 },
      { pattern: /后天/g, days: 2 },
      { pattern: /大后天/g, days: 3 },
      { pattern: /下周([一二三四五六日天])?/g, days: 7 },
      { pattern: /下个月/g, days: 30 },
      { pattern: /本周([一二三四五六日天])?/g, days: 3 },
      { pattern: /本月底/g, days: 25 },
      { pattern: /月底/g, days: 25 }
    ];
    
    // 时间点解析
    const timePointPatterns = [
      { pattern: /上午(\d{1,2})点?/g, hour: 'morning' },
      { pattern: /下午(\d{1,2})点?/g, hour: 'afternoon' },
      { pattern: /晚上(\d{1,2})点?/g, hour: 'evening' },
      { pattern: /(\d{1,2})点/g, hour: 'general' },
      { pattern: /中午/g, hour: 12 },
      { pattern: /早上/g, hour: 8 }
    ];
    
    // 优先级解析
    if (/紧急|重要|急|优先/.test(input)) {
      result.priority = Priority.HIGH;
    } else if (/一般|普通|正常/.test(input)) {
      result.priority = Priority.MEDIUM;
    } else if (/不急|低|次要/.test(input)) {
      result.priority = Priority.LOW;
    }
    
    // 解析时间
    let targetDate = new Date(now.getTime()); // 使用时间戳创建副本
    let hasTimeInfo = false;
    
    for (const timePattern of timePatterns) {
      if (timePattern.pattern.test(input)) {
        targetDate.setDate(now.getDate() + timePattern.days);
        hasTimeInfo = true;
        break;
      }
    }
    
    // 解析具体时间点
    let targetHour = 9; // 默认上午9点
    for (const timePoint of timePointPatterns) {
      const match = input.match(timePoint.pattern);
      if (match) {
        if (typeof timePoint.hour === 'number') {
          targetHour = timePoint.hour;
        } else if (timePoint.hour === 'morning') {
          const hour = parseInt(match[1]);
          targetHour = (hour >= 1 && hour <= 12) ? hour : 9;
        } else if (timePoint.hour === 'afternoon') {
          const hour = parseInt(match[1]);
          targetHour = (hour >= 1 && hour <= 12) ? hour + 12 : 14;
        } else if (timePoint.hour === 'evening') {
          const hour = parseInt(match[1]);
          targetHour = (hour >= 1 && hour <= 12) ? hour + 12 : 19;
        } else if (timePoint.hour === 'general') {
          const hour = parseInt(match[1]);
          targetHour = (hour >= 0 && hour <= 23) ? hour : 9;
        }
        break;
      }
    }
    
    // 设置时间并验证日期有效性
    if (hasTimeInfo) {
      try {
        // 确保小时数在有效范围内
        targetHour = Math.max(0, Math.min(23, targetHour));
        targetDate.setHours(targetHour, 0, 0, 0);
        
        // 验证日期是否有效
        if (isNaN(targetDate.getTime())) {
          console.warn('生成的日期无效，使用默认时间');
          targetDate = new Date(now.getTime());
          targetDate.setHours(targetHour, 0, 0, 0);
        }
        
        // 使用本地时间格式，避免时区问题
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        const seconds = String(targetDate.getSeconds()).padStart(2, '0');
        
        const localDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        result.deadline = localDateString;
        result.timeRange = calculateTimeRange(localDateString);
      } catch (error) {
        console.error('日期设置失败:', error);
        // 如果出错，不设置deadline
      }
    }
    
    // 清理标题（移除时间相关词汇）
    let cleanTitle = title;
    timeKeywords.forEach(keyword => {
      cleanTitle = cleanTitle.replace(new RegExp(keyword, 'g'), '');
    });
    
    // 移除时间点表达
    cleanTitle = cleanTitle.replace(/上午\d{1,2}点?/g, '');
    cleanTitle = cleanTitle.replace(/下午\d{1,2}点?/g, '');
    cleanTitle = cleanTitle.replace(/晚上\d{1,2}点?/g, '');
    cleanTitle = cleanTitle.replace(/\d{1,2}点/g, '');
    cleanTitle = cleanTitle.replace(/中午|早上/g, '');
    
    // 清理多余空格和标点
    cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
    cleanTitle = cleanTitle.replace(/^[，。、\s]+|[，。、\s]+$/g, '');
    
    if (cleanTitle) {
      result.title = cleanTitle;
    }
    
    return result;
  };
  
  /**
   * 处理自然语言解析
   */
  const handleNaturalLanguageParse = async () => {
    if (!naturalInput.trim() || isParsingNatural) return;
    
    setIsParsingNatural(true);
    
    try {
      // 添加短暂延迟以显示加载状态
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parsed = parseNaturalLanguage(naturalInput);
      
      setFormData(prev => ({
        ...prev,
        ...parsed,
        // 如果没有解析出标题，使用原始输入
        title: parsed.title || naturalInput
      }));
      
      // 显示解析成功的提示
      const parsedFields = [];
      if (parsed.title) parsedFields.push('任务标题');
      if (parsed.deadline) parsedFields.push('截止时间');
      if (parsed.priority) parsedFields.push('优先级');
      
      if (parsedFields.length > 0) {
        console.log(`✅ 智能解析成功！已自动填充：${parsedFields.join('、')}`);
      }
      
      setNaturalInput('');
    } catch (error) {
      console.error('自然语言解析失败:', error);
      alert('解析失败，请重试');
    } finally {
      setIsParsingNatural(false);
    }
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {editingTask ? '编辑任务' : '添加新任务'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 智能任务解析输入框 */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300">
              智能任务解析
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder="试试输入：明天下午3点开会、下周五提交报告、本月底完成项目..."
              className="flex-1 px-4 py-3 border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              onKeyPress={(e) => e.key === 'Enter' && !isParsingNatural && handleNaturalLanguageParse()}
              disabled={isParsingNatural}
            />
            <button
              type="button"
              onClick={handleNaturalLanguageParse}
              disabled={!naturalInput.trim() || isParsingNatural}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isParsingNatural ? '解析中...' : '一键解析'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-purple-600 dark:text-purple-400 font-medium">示例：</span>
            <button
              type="button"
              onClick={() => setNaturalInput('明天下午3点开会')}
              className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
            >
              明天下午3点开会
            </button>
            <span className="text-gray-400">•</span>
            <button
              type="button"
              onClick={() => setNaturalInput('下周五提交报告')}
              className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
            >
              下周五提交报告
            </button>
            <span className="text-gray-400">•</span>
            <button
              type="button"
              onClick={() => setNaturalInput('本月底完成项目')}
              className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
            >
              本月底完成项目
            </button>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-md px-3 py-2">
            💡 智能解析会自动提取任务标题、时间信息和优先级，并填充到下方表单中
          </p>
        </div>

        {/* 任务标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            任务标题 *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="请输入任务标题"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-offset-gray-800"
            required
          />
        </div>

        {/* 开始日期和截止时间 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              开始日期
            </label>
            <DateInput
               value={formData.startDate}
               onChange={(value) => handleInputChange('startDate', value)}
               className="w-full"
             />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              截止时间
            </label>
            <DateInput
               value={formData.deadline}
               onChange={(value) => handleInputChange('deadline', value)}
               className="w-full"
             />
          </div>
        </div>

        {/* 日期验证错误提示 */}
        {dateError && (
          <div className="text-red-500 text-sm mt-1">
            {dateError}
          </div>
        )}

        {/* 优先级 */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            优先级
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as Priority)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-offset-gray-800"
          >
            <option value={Priority.LOW}>{getPriorityText(Priority.LOW)}</option>
            <option value={Priority.MEDIUM}>{getPriorityText(Priority.MEDIUM)}</option>
            <option value={Priority.HIGH}>{getPriorityText(Priority.HIGH)}</option>
          </select>
        </div>

        {/* 时间维度显示（只读） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            时间维度（自动计算）
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
            {getTimeRangeText(formData.timeRange)}
            {formData.deadline && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                （基于截止时间自动判断）
              </span>
            )}
          </div>
        </div>

        {/* 任务描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            任务描述
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="请输入任务描述（可选）"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-offset-gray-800 resize-none"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
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