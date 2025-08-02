import { create } from 'zustand';
import { Task, TaskFormData, FilterType, Priority, TimeRange, TaskStats } from '@/types';

/**
 * 任务状态管理接口
 */
interface TaskStore {
  // 状态
  tasks: Task[];
  filter: { type: FilterType; timeRange?: TimeRange; priority?: Priority; date?: Date };
  isLoading: boolean;
  
  // 任务操作方法
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // 筛选方法
  setFilter: (filter: { type: FilterType; timeRange?: TimeRange; priority?: Priority; date?: Date }) => void;
  getFilteredTasks: () => Task[];
  getTasksByTimeRange: (timeRange: TimeRange) => Task[];
  
  // 统计方法
  getTaskStats: () => TaskStats;
  
  // 数据持久化方法
  loadTasks: () => void;
  saveTasks: () => void;
}

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 检查任务是否在指定时间范围内
 */
const isTaskInTimeRange = (task: Task, filter: FilterType): boolean => {
  const now = new Date();
  const taskDate = task.deadline ? new Date(task.deadline) : new Date(task.createdAt);
  
  switch (filter) {
    case FilterType.TODAY:
      return taskDate.toDateString() === now.toDateString();
    case FilterType.THIS_WEEK:
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return taskDate >= weekStart && taskDate <= weekEnd;
    case FilterType.THIS_MONTH:
      return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
    default:
      return true;
  }
};

/**
 * 创建任务状态管理store
 */
export const useTaskStore = create<TaskStore>((set, get) => ({
  // 初始状态
  tasks: [],
  filter: { type: FilterType.ALL },
  isLoading: false,

  /**
   * 添加新任务
   */
  addTask: (taskData: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: taskData.deadline,
      priority: taskData.priority,
      timeRange: taskData.timeRange,
      description: taskData.description,
    };
    
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }));
    
    get().saveTasks();
  },

  /**
   * 更新任务
   */
  updateTask: (id: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
    
    get().saveTasks();
  },

  /**
   * 删除任务
   */
  deleteTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
    
    get().saveTasks();
  },

  /**
   * 切换任务完成状态
   */
  toggleTaskComplete: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
    
    get().saveTasks();
  },

  /**
   * 切换任务状态（别名方法，用于兼容）
   */
  toggleTask: (id: string) => {
    get().toggleTaskComplete(id);
  },

  /**
   * 设置筛选条件
   */
  setFilter: (filter: { type: FilterType; timeRange?: TimeRange; priority?: Priority; date?: Date }) => {
    set({ filter });
  },

  /**
   * 获取筛选后的任务列表
   */
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    
    return tasks.filter(task => {
      // 根据完成状态筛选
      if (filter.type === FilterType.COMPLETED && !task.completed) {
        return false;
      }
      if (filter.type === FilterType.UNCOMPLETED && task.completed) {
        return false;
      }
      
      // 根据时间维度筛选
      if (filter.timeRange && filter.date) {
        // 基于日期的时间范围筛选
        const taskDate = task.deadline ? new Date(task.deadline) : new Date(task.createdAt);
        const filterDate = filter.date;
        
        switch (filter.timeRange) {
          case TimeRange.DAY:
            // 筛选指定日期的任务
            if (taskDate.toDateString() !== filterDate.toDateString()) {
              return false;
            }
            break;
          case TimeRange.WEEK:
            // 筛选指定日期所在周的任务
            const weekStart = new Date(filterDate);
            const dayOfWeek = weekStart.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            weekStart.setDate(weekStart.getDate() + diff);
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            
            if (taskDate < weekStart || taskDate > weekEnd) {
              return false;
            }
            break;
          case TimeRange.MONTH:
            // 筛选指定日期所在月的任务
            if (taskDate.getMonth() !== filterDate.getMonth() || 
                taskDate.getFullYear() !== filterDate.getFullYear()) {
              return false;
            }
            break;
          case TimeRange.YEAR:
            // 筛选指定日期所在年的任务
            if (taskDate.getFullYear() !== filterDate.getFullYear()) {
              return false;
            }
            break;
        }
      } else if (filter.timeRange && task.timeRange !== filter.timeRange) {
        // 基于任务时间维度的筛选
        return false;
      }
      
      // 根据优先级筛选
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      
      // 根据时间范围筛选
      if (filter.type === FilterType.TODAY || filter.type === FilterType.THIS_WEEK || filter.type === FilterType.THIS_MONTH) {
        return isTaskInTimeRange(task, filter.type);
      }
      
      return true;
    });
  },

  /**
   * 根据时间范围获取任务列表
   */
  getTasksByTimeRange: (timeRange: TimeRange) => {
    const tasks = get().tasks;
    return tasks.filter(task => task.timeRange === timeRange);
  },

  /**
   * 获取任务统计数据
   */
  getTaskStats: (): TaskStats => {
    const tasks = get().tasks;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    
    // 计算逾期任务数量
    const now = new Date();
    const overdue = tasks.filter(task => {
      if (!task.deadline || task.completed) return false;
      return new Date(task.deadline) < now;
    }).length;
    
    // 按时间维度统计
    const byTimeRange = {
      [TimeRange.DAY]: { total: 0, completed: 0 },
      [TimeRange.WEEK]: { total: 0, completed: 0 },
      [TimeRange.MONTH]: { total: 0, completed: 0 },
      [TimeRange.YEAR]: { total: 0, completed: 0 }
    };
    
    // 按优先级统计
    const byPriority = {
      [Priority.HIGH]: { total: 0, completed: 0 },
      [Priority.MEDIUM]: { total: 0, completed: 0 },
      [Priority.LOW]: { total: 0, completed: 0 }
    };
    
    tasks.forEach(task => {
      // 时间维度统计
      byTimeRange[task.timeRange].total++;
      if (task.completed) {
        byTimeRange[task.timeRange].completed++;
      }
      
      // 优先级统计
      byPriority[task.priority].total++;
      if (task.completed) {
        byPriority[task.priority].completed++;
      }
    });
    
    const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
    
    return {
      total: tasks.length,
      completed,
      pending,
      overdue,
      completionRate,
      byTimeRange,
      byPriority
    };
  },

  /**
   * 从localStorage加载任务数据
   */
  loadTasks: () => {
    try {
      const savedTasks = localStorage.getItem('todolist-tasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        set({ tasks });
      }
    } catch (error) {
      console.error('加载任务数据失败:', error);
    }
  },

  /**
   * 保存任务数据到localStorage
   */
  saveTasks: () => {
    try {
      const { tasks } = get();
      localStorage.setItem('todolist-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('保存任务数据失败:', error);
    }
  }
}));