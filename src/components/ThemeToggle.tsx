import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * 主题切换组件
 * 提供白天模式和深色模式的切换功能
 */
export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="
          relative flex items-center justify-center
          w-12 h-6 rounded-full
          bg-gray-200 dark:bg-gray-700
          transition-all duration-300 ease-in-out
          hover:bg-gray-300 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
        "
        title={isDark ? '切换到白天模式' : '切换到深色模式'}
        aria-label={isDark ? '切换到白天模式' : '切换到深色模式'}
      >
        {/* 滑动背景 */}
        <div
          className={`
            absolute top-0.5 left-0.5
            w-5 h-5 rounded-full
            bg-white dark:bg-gray-900
            shadow-md
            transition-transform duration-300 ease-in-out
            ${isDark ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
        
        {/* 太阳图标 */}
        <Sun
          className={`
            absolute left-1
            w-4 h-4
            text-yellow-500
            transition-all duration-300 ease-in-out
            ${isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
          `}
        />
        
        {/* 月亮图标 */}
        <Moon
          className={`
            absolute right-1
            w-4 h-4
            text-blue-400
            transition-all duration-300 ease-in-out
            ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
        />
      </button>
      
      {/* 工具提示 */}
      <div className="
        absolute -bottom-8 left-1/2 transform -translate-x-1/2
        px-2 py-1 text-xs
        bg-gray-800 dark:bg-gray-200
        text-white dark:text-gray-800
        rounded opacity-0 pointer-events-none
        transition-opacity duration-200
        group-hover:opacity-100
      ">
        {isDark ? '深色模式' : '白天模式'}
      </div>
    </div>
  );
}

/**
 * 简化版主题切换按钮
 * 适用于空间较小的场景
 */
export function ThemeToggleSimple() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      title={isDark ? '切换到白天模式' : '切换到深色模式'}
      aria-label={isDark ? '切换到白天模式' : '切换到深色模式'}
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-blue-400" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}

/**
 * 带文字的主题切换组件
 * 适用于设置页面等需要明确标识的场景
 */
export function ThemeToggleWithLabel() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {isDark ? (
            <Moon className="w-5 h-5 text-blue-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            主题模式
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            当前：{isDark ? '深色模式' : '白天模式'}
          </p>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  );
}