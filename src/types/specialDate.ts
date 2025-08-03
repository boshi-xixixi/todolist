/**
 * 特殊日期类型定义
 */

/**
 * 特殊日期类别
 */
export enum SpecialDateType {
  COUNTDOWN = 'countdown',    // 倒数日
  BIRTHDAY = 'birthday',      // 生日
  ANNIVERSARY = 'anniversary' // 纪念日
}

/**
 * 特殊日期接口
 */
export interface SpecialDate {
  id: string;
  title: string;              // 标题
  description?: string;       // 描述
  date: string;              // 日期 (YYYY-MM-DD)
  type: SpecialDateType;     // 类型
  isRecurring: boolean;      // 是否每年重复
  reminderDays?: number;     // 提前提醒天数
  color?: string;            // 颜色标识
  createdAt: string;         // 创建时间
  updatedAt: string;         // 更新时间
}

/**
 * 特殊日期统计信息
 */
export interface SpecialDateStats {
  total: number;
  upcoming: number;          // 即将到来的
  today: number;            // 今天的
  overdue: number;          // 已过期的（仅针对倒数日）
}

/**
 * 特殊日期筛选类型
 */
export enum SpecialDateFilter {
  ALL = 'all',
  COUNTDOWN = 'countdown',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  UPCOMING = 'upcoming',     // 即将到来
  TODAY = 'today'           // 今天
}

/**
 * 特殊日期计算结果
 */
export interface SpecialDateCalculation {
  daysUntil: number;        // 距离天数（负数表示已过）
  isToday: boolean;         // 是否是今天
  isPast: boolean;          // 是否已过
  nextOccurrence: string;   // 下次发生日期
  displayText: string;      // 显示文本
}