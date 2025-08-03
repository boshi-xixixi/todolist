import React from 'react';
import { Pin, Edit3, Trash2, Tag, Calendar, Clock } from 'lucide-react';
import { Note } from '@/types/note';

interface NoteCardProps {
  /** 记事本数据 */
  note: Note;
  /** 编辑回调 */
  onEdit: () => void;
  /** 删除回调 */
  onDelete: () => void;
  /** 置顶切换回调 */
  onTogglePin: () => void;
  /** 标签点击回调 */
  onTagClick: (tag: string) => void;
}

/**
 * 记事本卡片组件
 */
export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onTagClick
}) => {
  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  /**
   * 截取内容预览
   */
  const getContentPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
      style={{ backgroundColor: note.color || undefined }}
    >
      {/* 置顶标识 */}
      {note.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Pin className="w-4 h-4 text-orange-500 fill-current" />
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 pr-6 line-clamp-2">
          {note.title}
        </h3>

        {/* 内容预览 */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {getContentPreview(note.content).split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>

        {/* 标签 */}
        {note.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            <Tag className="w-3 h-3 text-gray-400" />
            {note.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tag}
              </button>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* 时间信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>创建: {formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>更新: {formatDate(note.updatedAt)}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onTogglePin}
            className={`p-1.5 rounded-md transition-colors ${
              note.isPinned
                ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={note.isPinned ? '取消置顶' : '置顶'}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};