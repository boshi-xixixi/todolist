/**
 * 记事本备忘录相关类型定义
 */

/**
 * 记事本条目接口
 */
export interface Note {
  /** 唯一标识符 */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 是否置顶 */
  isPinned: boolean;
  /** 标签 */
  tags: string[];
  /** 颜色标记 */
  color?: string;
}

/**
 * 记事本筛选类型
 */
export enum NoteFilterType {
  ALL = 'all',
  PINNED = 'pinned',
  RECENT = 'recent',
  BY_TAG = 'by_tag'
}

/**
 * 记事本排序类型
 */
export enum NoteSortType {
  CREATED_DESC = 'created_desc',
  CREATED_ASC = 'created_asc',
  UPDATED_DESC = 'updated_desc',
  UPDATED_ASC = 'updated_asc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc'
}

/**
 * 记事本颜色选项
 */
export const NOTE_COLORS = [
  '#fef3c7', // 黄色
  '#fecaca', // 红色
  '#bbf7d0', // 绿色
  '#bfdbfe', // 蓝色
  '#e9d5ff', // 紫色
  '#fed7d7', // 粉色
  '#f3f4f6'  // 灰色
] as const;

export type NoteColor = typeof NOTE_COLORS[number];