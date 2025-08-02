import React, { useState, useEffect } from 'react';
import { Plus, List, BarChart3 } from 'lucide-react';
import { Task, TimeRange, FilterType } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { TaskFilter } from '@/components/TaskFilter';
import { TaskStats } from '@/components/TaskStats';
import { TaskSidebar } from '@/components/TaskSidebar';
import { MiniCalendar } from '@/components/MiniCalendar';
import { Empty } from '@/components/Empty';

/**
 * 主页面组件 - TodoList 待办事项管理
 */
export const Home: React.FC = () => {
  const { getFilteredTasks, loadTasks, setFilter } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats'>('tasks');
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [calendarTimeRange, setCalendarTimeRange] = useState<TimeRange | null>(null);

  // 获取筛选后的任务列表
  const filteredTasks = getFilteredTasks();

  /**
   * 组件挂载时加载任务数据
   */
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * 开始编辑任务
   */
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };

  /**
   * 取消编辑
   */
  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowAddForm(false);
  };

  /**
   * 切换添加表单显示
   */
  const toggleAddForm = () => {
    if (showAddForm && editingTask) {
      // 如果正在编辑，先取消编辑
      handleCancelEdit();
    } else {
      setShowAddForm(!showAddForm);
    }
  };

  /**
   * 处理时间范围变化
   */
  const handleTimeRangeChange = (timeRange: TimeRange | null) => {
    setActiveTimeRange(timeRange);
    // 清除日历选择状态
    setSelectedCalendarDate(null);
    setCalendarTimeRange(null);
    
    if (timeRange) {
      setFilter({ type: FilterType.TIME_RANGE, timeRange });
    } else {
      setFilter({ type: FilterType.ALL });
    }
  };

  /**
   * 处理日历日期点击
   */
  const handleCalendarDateClick = (date: Date, timeRange?: TimeRange) => {
    setSelectedCalendarDate(date);
    setCalendarTimeRange(timeRange || null);
    // 日历点击时的筛选已在MiniCalendar组件内部处理
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TodoList 待办事项</h1>
              <p className="text-gray-600 mt-1">高效管理您的日常任务</p>
            </div>
            
            {/* 添加任务按钮 */}
            {activeTab === 'tasks' && (
              <button
                onClick={toggleAddForm}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? '取消' : '添加任务'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 */}
          <div className="w-64 flex-shrink-0">
            <TaskSidebar
              activeTimeRange={activeTimeRange}
              onTimeRangeChange={handleTimeRangeChange}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* 右侧主内容区域 */}
          <div className="flex-1 min-w-0">
            {activeTab === 'tasks' ? (
              <>
                {/* 日历视图 */}
                <div className="mb-6">
                  <MiniCalendar 
                    activeTimeRange={activeTimeRange} 
                    onDateClick={handleCalendarDateClick}
                  />
                </div>

                {/* 任务添加表单 */}
                {showAddForm && (
                  <div className="mb-6">
                    <TaskForm
                      editingTask={editingTask}
                      onCancel={handleCancelEdit}
                    />
                  </div>
                )}

                {/* 任务筛选器 */}
                <div className="mb-6">
                  <TaskFilter />
                </div>

                {/* 任务列表 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <List className="w-5 h-5" />
                      任务列表
                      {selectedCalendarDate && calendarTimeRange && (
                        <span className="text-sm font-normal text-blue-600">
                          - {calendarTimeRange === TimeRange.DAY ? '当日' : 
                             calendarTimeRange === TimeRange.WEEK ? '本周' : 
                             calendarTimeRange === TimeRange.MONTH ? '本月' : '本年'}
                          ({selectedCalendarDate.toLocaleDateString()})
                        </span>
                      )}
                      <span className="text-sm font-normal text-gray-500">
                        ({filteredTasks.length} 个任务)
                      </span>
                    </h2>
                  </div>
                  
                  <div className="p-4">
                    {filteredTasks.length > 0 ? (
                      <div className="space-y-4">
                        {filteredTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEditTask}
                          />
                        ))}
                      </div>
                    ) : (
                      <Empty
                        title="暂无任务"
                        description="还没有任务，点击上方按钮添加第一个任务吧！"
                        actionText="添加任务"
                        onAction={toggleAddForm}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* 统计分析页面 */
              <TaskStats />
            )}
          </div>
        </div>
      </div>
     </div>
   );
 };