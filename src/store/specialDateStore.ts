import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpecialDate, SpecialDateType, SpecialDateFilter, SpecialDateStats, SpecialDateCalculation } from '@/types/specialDate';

/**
 * 特殊日期存储接口
 */
interface SpecialDateStore {
  specialDates: SpecialDate[];
  filter: SpecialDateFilter;
  
  // 基础操作
  addSpecialDate: (specialDate: Omit<SpecialDate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpecialDate: (id: string, updates: Partial<SpecialDate>) => void;
  deleteSpecialDate: (id: string) => void;
  getSpecialDateById: (id: string) => SpecialDate | undefined;
  
  // 筛选和查询
  setFilter: (filter: SpecialDateFilter) => void;
  getFilteredSpecialDates: () => SpecialDate[];
  getSpecialDatesByType: (type: SpecialDateType) => SpecialDate[];
  
  // 统计信息
  getStats: () => SpecialDateStats;
  getStatsForType: (type: SpecialDateType) => SpecialDateStats;
  
  // 日期计算
  calculateSpecialDate: (specialDate: SpecialDate) => SpecialDateCalculation;
  getTodaySpecialDates: () => SpecialDate[];
  getUpcomingSpecialDates: (days?: number) => SpecialDate[];
}

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 计算特殊日期信息
 */
const calculateSpecialDate = (specialDate: SpecialDate): SpecialDateCalculation => {
  const today = new Date();
  const targetDate = new Date(specialDate.date);
  
  // 如果是重复事件，计算今年的日期
  if (specialDate.isRecurring) {
    const currentYear = today.getFullYear();
    const thisYearDate = new Date(currentYear, targetDate.getMonth(), targetDate.getDate());
    
    // 如果今年的日期已过，计算明年的
    if (thisYearDate < today) {
      targetDate.setFullYear(currentYear + 1);
    } else {
      targetDate.setFullYear(currentYear);
    }
  }
  
  const timeDiff = targetDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const isToday = daysUntil === 0;
  const isPast = daysUntil < 0;
  
  let displayText = '';
  if (isToday) {
    displayText = '今天';
  } else if (daysUntil > 0) {
    displayText = `还有 ${daysUntil} 天`;
  } else {
    displayText = `已过 ${Math.abs(daysUntil)} 天`;
  }
  
  return {
    daysUntil,
    isToday,
    isPast,
    nextOccurrence: targetDate.toISOString().split('T')[0],
    displayText
  };
};

/**
 * 特殊日期存储
 */
export const useSpecialDateStore = create<SpecialDateStore>()(persist(
  (set, get) => ({
    specialDates: [],
    filter: SpecialDateFilter.ALL,
    
    addSpecialDate: (specialDateData) => {
      const now = new Date().toISOString();
      const newSpecialDate: SpecialDate = {
        ...specialDateData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        specialDates: [...state.specialDates, newSpecialDate]
      }));
    },
    
    updateSpecialDate: (id, updates) => {
      set((state) => ({
        specialDates: state.specialDates.map((specialDate) =>
          specialDate.id === id
            ? { ...specialDate, ...updates, updatedAt: new Date().toISOString() }
            : specialDate
        )
      }));
    },
    
    deleteSpecialDate: (id) => {
      set((state) => ({
        specialDates: state.specialDates.filter((specialDate) => specialDate.id !== id)
      }));
    },
    
    getSpecialDateById: (id) => {
      return get().specialDates.find((specialDate) => specialDate.id === id);
    },
    
    setFilter: (filter) => {
      set({ filter });
    },
    
    getFilteredSpecialDates: () => {
      const { specialDates, filter } = get();
      
      switch (filter) {
        case SpecialDateFilter.ALL:
          return specialDates;
        case SpecialDateFilter.COUNTDOWN:
          return specialDates.filter(sd => sd.type === SpecialDateType.COUNTDOWN);
        case SpecialDateFilter.BIRTHDAY:
          return specialDates.filter(sd => sd.type === SpecialDateType.BIRTHDAY);
        case SpecialDateFilter.ANNIVERSARY:
          return specialDates.filter(sd => sd.type === SpecialDateType.ANNIVERSARY);
        case SpecialDateFilter.TODAY:
          return get().getTodaySpecialDates();
        case SpecialDateFilter.UPCOMING:
          return get().getUpcomingSpecialDates(7);
        default:
          return specialDates;
      }
    },
    
    getSpecialDatesByType: (type) => {
      return get().specialDates.filter((specialDate) => specialDate.type === type);
    },
    
    getStats: () => {
      const specialDates = get().specialDates;
      const today = get().getTodaySpecialDates();
      const upcoming = get().getUpcomingSpecialDates(7);
      
      return {
        total: specialDates.length,
        upcoming: upcoming.length,
        today: today.length,
        overdue: specialDates.filter(sd => {
          const calc = calculateSpecialDate(sd);
          return sd.type === SpecialDateType.COUNTDOWN && calc.isPast;
        }).length
      };
    },
    
    getStatsForType: (type) => {
      const specialDates = get().getSpecialDatesByType(type);
      const today = specialDates.filter(sd => {
        const calc = calculateSpecialDate(sd);
        return calc.isToday;
      });
      const upcoming = specialDates.filter(sd => {
        const calc = calculateSpecialDate(sd);
        return calc.daysUntil > 0 && calc.daysUntil <= 7;
      });
      
      return {
        total: specialDates.length,
        upcoming: upcoming.length,
        today: today.length,
        overdue: type === SpecialDateType.COUNTDOWN ? specialDates.filter(sd => {
          const calc = calculateSpecialDate(sd);
          return calc.isPast;
        }).length : 0
      };
    },
    
    calculateSpecialDate,
    
    getTodaySpecialDates: () => {
      return get().specialDates.filter((specialDate) => {
        const calc = calculateSpecialDate(specialDate);
        return calc.isToday;
      });
    },
    
    getUpcomingSpecialDates: (days = 7) => {
      return get().specialDates.filter((specialDate) => {
        const calc = calculateSpecialDate(specialDate);
        return calc.daysUntil > 0 && calc.daysUntil <= days;
      }).sort((a, b) => {
        const calcA = calculateSpecialDate(a);
        const calcB = calculateSpecialDate(b);
        return calcA.daysUntil - calcB.daysUntil;
      });
    },
  }),
  {
    name: 'special-date-storage',
    version: 1,
  }
));