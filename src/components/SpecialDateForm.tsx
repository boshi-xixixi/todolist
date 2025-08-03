import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Gift, Heart, Bell } from 'lucide-react';
import { SpecialDate, SpecialDateType } from '@/types/specialDate';
import { useSpecialDateStore } from '@/store/specialDateStore';

interface SpecialDateFormProps {
  specialDate?: SpecialDate | null;
  onClose: () => void;
}

/**
 * 特殊日期表单组件
 */
export function SpecialDateForm({ specialDate, onClose }: SpecialDateFormProps) {
  const { addSpecialDate, updateSpecialDate } = useSpecialDateStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: SpecialDateType.COUNTDOWN,
    isRecurring: false,
    reminderDays: 0,
    color: '#3B82F6'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 编辑模式时填充表单数据
  useEffect(() => {
    if (specialDate) {
      setFormData({
        title: specialDate.title,
        description: specialDate.description || '',
        date: specialDate.date,
        type: specialDate.type,
        isRecurring: specialDate.isRecurring,
        reminderDays: specialDate.reminderDays || 0,
        color: specialDate.color || '#3B82F6'
      });
    }
  }, [specialDate]);
  
  /**
   * 处理表单输入变化
   */
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  /**
   * 验证表单
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    }
    
    if (!formData.date) {
      newErrors.date = '请选择日期';
    }
    
    if (formData.reminderDays < 0) {
      newErrors.reminderDays = '提醒天数不能为负数';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * 提交表单
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (specialDate) {
      // 编辑模式
      updateSpecialDate(specialDate.id, formData);
    } else {
      // 添加模式
      addSpecialDate(formData);
    }
    
    onClose();
  };
  
  /**
   * 获取类型选项
   */
  const typeOptions = [
    {
      value: SpecialDateType.COUNTDOWN,
      label: '倒数日',
      icon: Clock,
      description: '倒数重要事件的日子'
    },
    {
      value: SpecialDateType.BIRTHDAY,
      label: '生日',
      icon: Gift,
      description: '记录生日和庆祝日期'
    },
    {
      value: SpecialDateType.ANNIVERSARY,
      label: '纪念日',
      icon: Heart,
      description: '纪念特殊的日子和里程碑'
    }
  ];
  
  /**
   * 获取颜色选项
   */
  const colorOptions = [
    { value: '#3B82F6', label: '蓝色' },
    { value: '#10B981', label: '绿色' },
    { value: '#F59E0B', label: '橙色' },
    { value: '#EF4444', label: '红色' },
    { value: '#8B5CF6', label: '紫色' },
    { value: '#EC4899', label: '粉色' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {specialDate ? '编辑特殊日期' : '添加特殊日期'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="输入特殊日期的标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>
          
          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="添加描述（可选）"
            />
          </div>
          
          {/* 类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              类型
            </label>
            <div className="space-y-2">
              {typeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={formData.type === option.value}
                      onChange={(e) => handleInputChange('type', e.target.value as SpecialDateType)}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 mr-3 ${
                      formData.type === option.value
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`font-medium ${
                        formData.type === option.value
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* 日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
            )}
          </div>
          
          {/* 每年重复 */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                每年重复
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                每年在同一日期重复此事件
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* 提醒设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              提前提醒（天）
            </label>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                min="0"
                max="365"
                value={formData.reminderDays}
                onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 0)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.reminderDays ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">天</span>
            </div>
            {errors.reminderDays && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reminderDays}</p>
            )}
          </div>
          
          {/* 颜色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              颜色标识
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          
          {/* 按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {specialDate ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}