import React, { useState, useEffect } from 'react';
import { Plus, List, BarChart3, Settings, Droplets, Calendar, Gift, Heart, Star, ChevronRight, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task, TimeRange, FilterType } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { useSpecialDateStore } from '@/store/specialDateStore';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { TaskFilter } from '@/components/TaskFilter';
import { TaskStats } from '@/components/TaskStats';
import { TaskSidebar } from '@/components/TaskSidebar';
import { MiniCalendar } from '@/components/MiniCalendar';
import { Empty } from '@/components/Empty';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WaterTracker } from '@/components/WaterTracker';
import { FoodWheel } from '@/components/FoodWheel';
import { SpecialDateType } from '@/types/specialDate';
import { toast } from 'sonner';

/**
 * 主页面组件 - TodoList 待办事项管理
 */
export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredTasks, loadTasks, setFilter } = useTaskStore();
  const { getTodaySpecialDates } = useSpecialDateStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats' | 'today'>('tasks');
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [calendarTimeRange, setCalendarTimeRange] = useState<TimeRange | null>(null);
  const [showWaterTracker, setShowWaterTracker] = useState(false);
  const [showFoodWheel, setShowFoodWheel] = useState(false);
  const [waterCount, setWaterCount] = useState(0);

  // 获取筛选后的任务列表
  const filteredTasks = getFilteredTasks();
  
  // 获取今日特殊日期
  const todaySpecialDates = getTodaySpecialDates();

  /**
   * 获取今日日期字符串
   */
  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  /**
   * 加载今日喝水数据
   */
  const loadWaterCount = () => {
    const today = getTodayDateString();
    const savedData = localStorage.getItem(`water-tracker-${today}`);
    if (savedData) {
      setWaterCount(parseInt(savedData, 10));
    } else {
      setWaterCount(0);
    }
  };

  /**
   * 组件挂载时加载任务数据和喝水数据
   */
  useEffect(() => {
    loadTasks();
    loadWaterCount();
    
    // 添加测试数据（仅在开发环境）
    const addTestData = async () => {
      const { tasks, addTask } = useTaskStore.getState();
      const { specialDates, addSpecialDate } = useSpecialDateStore.getState();
      
      // 如果已经有任务数据，不添加测试数据
      if (tasks.length > 0) {
        console.log('已有任务数据，跳过添加测试数据');
      } else {
        console.log('添加测试任务数据...');
        
        // 获取今天的日期字符串
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        // 添加今天的测试任务
        await addTask({
          title: '测试任务1 - 今天上午',
          description: '这是一个测试任务，用于验证今日任务显示功能',
          deadline: `${todayStr}T09:00:00.000Z`,
          priority: 'high',
          timeRange: 'day'
        });
        
        await addTask({
          title: '测试任务2 - 今天下午',
          description: '另一个测试任务',
          deadline: `${todayStr}T14:30:00.000Z`,
          priority: 'medium',
          timeRange: 'day'
        });
        
        await addTask({
          title: '测试任务3 - 今天晚上',
          description: '第三个测试任务',
          deadline: `${todayStr}T19:00:00.000Z`,
          priority: 'low',
          timeRange: 'day'
        });
        
        console.log('测试任务数据添加完成');
      }
      
      // 添加测试特殊日期数据
      if (specialDates.length === 0) {
        console.log('添加测试特殊日期数据...');
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        // 添加今天的特殊日期
        addSpecialDate({
          title: '今日生日',
          description: '小明的生日',
          date: todayStr,
          type: SpecialDateType.BIRTHDAY,
          isRecurring: true
        });
        
        // 添加明天的特殊日期
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        
        addSpecialDate({
          title: '结婚纪念日',
          description: '我们的结婚纪念日',
          date: tomorrowStr,
          type: SpecialDateType.ANNIVERSARY,
          isRecurring: true
        });
        
        // 添加下周的倒计时
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;
        
        addSpecialDate({
          title: '项目截止日',
          description: '重要项目的截止日期',
          date: nextWeekStr,
          type: SpecialDateType.COUNTDOWN,
          isRecurring: false
        });
        
        console.log('测试特殊日期数据添加完成');
      }
    };
    
    // 延迟添加测试数据，确保loadTasks完成
    setTimeout(addTestData, 1000);
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

  /**
   * 处理喝水按钮点击
   */
  const handleWaterClick = () => {
    setShowWaterTracker(true);
  };

  /**
   * 处理喝水追踪器关闭，重新加载喝水数据
   */
  const handleWaterTrackerClose = () => {
    setShowWaterTracker(false);
    loadWaterCount(); // 重新加载喝水数据
  };

  /**
   * 处理今天吃什么按钮点击
   */
  const handleFoodWheelClick = () => {
    setShowFoodWheel(true);
  };

  /**
   * 获取特殊日期类型的图标
   */
  const getSpecialDateIcon = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.BIRTHDAY:
        return <Gift className="w-4 h-4" />;
      case SpecialDateType.ANNIVERSARY:
        return <Heart className="w-4 h-4" />;
      case SpecialDateType.COUNTDOWN:
        return <Star className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  /**
   * 获取特殊日期类型的颜色
   */
  const getSpecialDateColor = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.BIRTHDAY:
        return 'text-pink-500 bg-pink-50 dark:bg-pink-900/20';
      case SpecialDateType.ANNIVERSARY:
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case SpecialDateType.COUNTDOWN:
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TodoList 待办事项</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">高效管理您的日常任务</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 今日喝水按钮 */}
              <button
                onClick={handleWaterClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title="今日喝水"
                aria-label="今日喝水"
              >
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{waterCount}</span>
              </button>

              {/* 今天吃什么按钮 */}
              <button
                onClick={handleFoodWheelClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 hover:from-orange-200 hover:to-red-200 dark:hover:from-orange-800/60 dark:hover:to-red-800/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm"
                title="今天吃什么"
                aria-label="今天吃什么"
              >
                <ChefHat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">吃什么</span>
              </button>
              
              {/* 设置按钮 */}
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title="设置"
                aria-label="设置"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              {/* 主题切换按钮 */}
              <ThemeToggle />
              
              {/* 添加任务按钮 */}
              {activeTab === 'tasks' && (
                <button
                  onClick={toggleAddForm}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? '取消' : '添加任务'}
                </button>
              )}
            </div>
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
                {/* 今日特殊日期提醒 */}
                {todaySpecialDates.length > 0 && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          今日特殊日期
                        </h3>
                        <button
                          onClick={() => navigate('/special-dates')}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-1 text-sm font-medium transition-colors"
                        >
                          查看全部
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {todaySpecialDates.map((specialDate) => {
                          const calculation = specialDate.calculation;
                          return (
                            <div
                              key={specialDate.id}
                              className={`flex items-center gap-3 p-3 rounded-lg ${getSpecialDateColor(specialDate.type)} border border-current/20`}
                            >
                              <div className={getSpecialDateColor(specialDate.type).split(' ')[0]}>
                                {getSpecialDateIcon(specialDate.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {specialDate.title}
                                </h4>
                                {specialDate.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {specialDate.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  {calculation?.isToday && (
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                                      今天
                                    </span>
                                  )}
                                  {calculation?.daysUntil !== undefined && calculation.daysUntil > 0 && (
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                      还有 {calculation.daysUntil} 天
                                    </span>
                                  )}
                                  {calculation?.daysPassed !== undefined && calculation.daysPassed > 0 && (
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                      已过 {calculation.daysPassed} 天
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
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
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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

      {/* 喝水追踪弹窗 */}
      <WaterTracker 
        isOpen={showWaterTracker} 
        onClose={handleWaterTrackerClose} 
      />

      {/* 今天吃什么转盘弹窗 */}
      <FoodWheel 
        isOpen={showFoodWheel} 
        onClose={() => setShowFoodWheel(false)} 
      />
     </div>
   );
 };