import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, SortAsc, Pin, Edit3, Trash2, Tag, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '@/store/noteStore';
import { Note, NoteFilterType, NoteSortType, NOTE_COLORS } from '@/types/note';
import { NoteForm } from '@/components/NoteForm';
import { NoteCard } from '@/components/NoteCard';
import { Empty } from '@/components/Empty';

/**
 * 记事本页面组件
 */
export const Notes: React.FC = () => {
  const navigate = useNavigate();
  const {
    notes,
    filterType,
    sortType,
    searchKeyword,
    selectedTag,
    setFilterType,
    setSortType,
    setSearchKeyword,
    setSelectedTag,
    getFilteredNotes,
    getAllTags,
    loadNotes,
    deleteNote,
    togglePin
  } = useNoteStore();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 获取筛选后的记事本列表
  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  /**
   * 处理添加记事本
   */
  const handleAddNote = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  /**
   * 处理编辑记事本
   */
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  /**
   * 处理删除记事本
   */
  const handleDeleteNote = (id: string) => {
    if (window.confirm('确定要删除这条记事本吗？')) {
      deleteNote(id);
    }
  };

  /**
   * 处理置顶切换
   */
  const handleTogglePin = (id: string) => {
    togglePin(id);
  };

  /**
   * 处理筛选类型变更
   */
  const handleFilterChange = (newFilterType: NoteFilterType) => {
    setFilterType(newFilterType);
    setShowFilterMenu(false);
    if (newFilterType !== NoteFilterType.BY_TAG) {
      setSelectedTag(null);
    }
  };

  /**
   * 处理排序类型变更
   */
  const handleSortChange = (newSortType: NoteSortType) => {
    setSortType(newSortType);
    setShowSortMenu(false);
  };

  /**
   * 处理标签选择
   */
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setFilterType(NoteFilterType.BY_TAG);
  };

  /**
   * 处理返回首页
   */
  const handleGoBack = () => {
    navigate('/');
  };

  /**
   * 获取筛选类型显示文本
   */
  const getFilterText = () => {
    switch (filterType) {
      case NoteFilterType.PINNED:
        return '置顶';
      case NoteFilterType.RECENT:
        return '最近';
      case NoteFilterType.BY_TAG:
        return selectedTag ? `标签: ${selectedTag}` : '按标签';
      default:
        return '全部';
    }
  };

  /**
   * 获取排序类型显示文本
   */
  const getSortText = () => {
    switch (sortType) {
      case NoteSortType.CREATED_ASC:
        return '创建时间 ↑';
      case NoteSortType.CREATED_DESC:
        return '创建时间 ↓';
      case NoteSortType.UPDATED_ASC:
        return '更新时间 ↑';
      case NoteSortType.UPDATED_DESC:
        return '更新时间 ↓';
      case NoteSortType.TITLE_ASC:
        return '标题 A-Z';
      case NoteSortType.TITLE_DESC:
        return '标题 Z-A';
      default:
        return '排序';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="返回首页"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Edit3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                记事本
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({filteredNotes.length} 条记录)
              </span>
            </div>
            
            <button
              onClick={handleAddNote}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建记事
            </button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索记事本..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 筛选和排序 */}
          <div className="flex items-center gap-2">
            {/* 筛选菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {getFilterText()}
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleFilterChange(NoteFilterType.ALL)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        filterType === NoteFilterType.ALL
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      全部记事
                    </button>
                    <button
                      onClick={() => handleFilterChange(NoteFilterType.PINNED)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        filterType === NoteFilterType.PINNED
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      置顶记事
                    </button>
                    <button
                      onClick={() => handleFilterChange(NoteFilterType.RECENT)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        filterType === NoteFilterType.RECENT
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      最近记事
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 排序菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <SortAsc className="w-4 h-4" />
                {getSortText()}
              </button>
              
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                  <div className="py-1">
                    {[
                      { type: NoteSortType.UPDATED_DESC, label: '更新时间 ↓' },
                      { type: NoteSortType.UPDATED_ASC, label: '更新时间 ↑' },
                      { type: NoteSortType.CREATED_DESC, label: '创建时间 ↓' },
                      { type: NoteSortType.CREATED_ASC, label: '创建时间 ↑' },
                      { type: NoteSortType.TITLE_ASC, label: '标题 A-Z' },
                      { type: NoteSortType.TITLE_DESC, label: '标题 Z-A' }
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => handleSortChange(type)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          sortType === type
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                标签:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 记事本列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredNotes.length === 0 ? (
          <Empty
            icon={Edit3}
            title="暂无记事本"
            description={searchKeyword ? '没有找到匹配的记事本' : '开始创建你的第一条记事吧'}
            action={
              !searchKeyword ? (
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新建记事
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note.id)}
                onTogglePin={() => handleTogglePin(note.id)}
                onTagClick={handleTagSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* 记事本表单弹窗 */}
      {showNoteForm && (
        <NoteForm
          note={editingNote}
          onClose={() => {
            setShowNoteForm(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};