import React, { useState } from 'react';
import { Plus, Calendar, Gift, Heart, Clock, Filter, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpecialDateStore } from '@/store/specialDateStore';
import { SpecialDate, SpecialDateType, SpecialDateFilter } from '@/types/specialDate';
import { SpecialDateCard } from '@/components/SpecialDateCard';
import { SpecialDateForm } from '@/components/SpecialDateForm';
import { Empty } from '@/components/Empty';

/**
 * 特殊日期页面组件
 */
export function SpecialDates() {
  const navigate = useNavigate();
  const {
    getFilteredSpecialDates,
    filter,
    setFilter,
    getStats,
    deleteSpecialDate
  } = useSpecialDateStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingDate, setEditingDate] = useState<SpecialDate | null>(null);
  
  const specialDates = getFilteredSpecialDates();
  const stats = getStats();
  
  /**
   * 返回主页
   */
  const handleGoBack = () => {
    navigate('/');
  };
  
  /**
   * 打开添加表单
   */
  const handleAddDate = () => {
    setEditingDate(null);
    setShowForm(true);
  };
  
  /**
   * 编辑特殊日期
   */
  const handleEditDate = (specialDate: SpecialDate) => {
    setEditingDate(specialDate);
    setShowForm(true);
  };
  
  /**
   * 删除特殊日期
   */
  const handleDeleteDate = (id: string) => {
    if (window.confirm('确定要删除这个特殊日期吗？')) {
      deleteSpecialDate(id);
    }
  };
  
  /**
   * 关闭表单
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDate(null);
  };
  
  /**
   * 获取筛选器图标
   */
  const getFilterIcon = (filterType: SpecialDateFilter) => {
    switch (filterType) {
      case SpecialDateFilter.COUNTDOWN:
        return Clock;
      case SpecialDateFilter.BIRTHDAY:
        return Gift;
      case SpecialDateFilter.ANNIVERSARY:
        return Heart;
      case SpecialDateFilter.TODAY:
        return Calendar;
      case SpecialDateFilter.UPCOMING:
        return Calendar;
      default:
        return Filter;
    }
  };
  
  /**
   * 获取筛选器标签
   */
  const getFilterLabel = (filterType: SpecialDateFilter) => {
    switch (filterType) {
      case SpecialDateFilter.ALL:
        return '全部';
      case SpecialDateFilter.COUNTDOWN:
        return '倒数日';
      case SpecialDateFilter.BIRTHDAY:
        return '生日';
      case SpecialDateFilter.ANNIVERSARY:
        return '纪念日';
      case SpecialDateFilter.TODAY:
        return '今天';
      case SpecialDateFilter.UPCOMING:
        return '即将到来';
      default:
        return '全部';
    }
  };
  
  const filterOptions = [
    SpecialDateFilter.ALL,
    SpecialDateFilter.TODAY,
    SpecialDateFilter.UPCOMING,
    SpecialDateFilter.COUNTDOWN,
    SpecialDateFilter.BIRTHDAY,
    SpecialDateFilter.ANNIVERSARY,
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部导航 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  特殊日期
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  管理您的倒数日、生日和纪念日
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddDate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加特殊日期
              </button>
              
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总数</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今天</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.today}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">即将到来</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">已过期</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 筛选器 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filterOption) => {
              const Icon = getFilterIcon(filterOption);
              const isActive = filter === filterOption;
              
              return (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {getFilterLabel(filterOption)}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 特殊日期列表 */}
        {specialDates.length === 0 ? (
          <Empty
            title="暂无特殊日期"
            description="添加您的第一个特殊日期，开始管理重要的日子"
            actionText="添加特殊日期"
            onAction={handleAddDate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialDates.map((specialDate) => (
              <SpecialDateCard
                key={specialDate.id}
                specialDate={specialDate}
                onEdit={handleEditDate}
                onDelete={handleDeleteDate}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 添加/编辑表单 */}
      {showForm && (
        <SpecialDateForm
          specialDate={editingDate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}