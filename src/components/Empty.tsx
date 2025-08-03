import React from 'react';
import { FileX, Plus } from 'lucide-react';

interface EmptyProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 空状态组件 - 当没有数据时显示
 */
export const Empty: React.FC<EmptyProps> = ({
  title = '暂无数据',
  description = '还没有任何内容',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* 图标 */}
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <FileX className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      
      {/* 标题 */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      
      {/* 描述 */}
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      
      {/* 操作按钮 */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

// 保持默认导出以兼容现有代码
export default Empty;