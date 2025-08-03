import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题上下文提供者组件
 * 提供全局主题状态管理
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode || 'auto';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode === 'light') return 'light';
    if (savedMode === 'dark') return 'dark';
    
    // auto 模式或没有保存的模式，检查系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
    
    if (mode === 'light') {
      setTheme('light');
    } else if (mode === 'dark') {
      setTheme('dark');
    } else {
      // auto 模式，根据系统偏好设置
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  };

  useEffect(() => {
    // 监听系统主题变化（仅在 auto 模式下）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (themeMode === 'auto') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    if (themeMode === 'auto') {
      // 如果当前是自动模式，切换到手动模式
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setThemeMode(newTheme);
    } else {
      // 如果是手动模式，在浅色和深色之间切换
      const newTheme = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newTheme);
    }
  };

  const value = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题的自定义Hook
 * 提供主题状态和切换功能
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}