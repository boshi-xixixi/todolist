/**
 * 任务优先级枚举
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * 时间维度枚举
 */
export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'thisWeek',
  NEXT_WEEK = 'nextWeek',
  THIS_MONTH = 'thisMonth',
  NEXT_MONTH = 'nextMonth'
}

/**
 * 任务筛选类型枚举
 */
export enum FilterType {
  ALL = 'all',
  TODAY = 'today',
  THIS_WEEK = 'thisWeek',
  THIS_MONTH = 'thisMonth',
  PENDING = 'pending',
  COMPLETED = 'completed',
  UNCOMPLETED = 'uncompleted',
  TIME_RANGE = 'timeRange'
}

/**
 * 任务数据结构
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  startDate?: string;
  deadline?: string;
  priority: Priority;
  timeRange: TimeRange;
  description?: string;
}

/**
 * 任务表单数据结构
 */
export interface TaskFormData {
  title: string;
  startDate?: string;
  deadline?: string;
  priority: Priority;
  timeRange: TimeRange;
  description?: string;
}

/**
 * 统计数据结构
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byTimeRange: Record<TimeRange, { total: number; completed: number }>;
  byPriority: Record<Priority, { total: number; completed: number }>;
}

// 导出特殊日期相关类型
export * from './specialDate';