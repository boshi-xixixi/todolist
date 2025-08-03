import React, { useEffect, useRef, useMemo } from 'react';
import { BarChart3, CheckCircle, Clock, AlertTriangle, Calendar, PieChart, TrendingUp, Target, Activity, Award } from 'lucide-react';
import * as echarts from 'echarts';
import { useTaskStore } from '@/store/taskStore';
import { TimeRange, Priority } from '@/types';

/**
 * 任务统计组件 - 显示任务的统计信息和进度分析
 */
export const TaskStats: React.FC = () => {
  const { getTaskStats, tasks } = useTaskStore();
  const stats = getTaskStats();
  
  // ECharts 图表引用
  const pieChartRef = useRef<HTMLDivElement>(null);
  const timeRangeChartRef = useRef<HTMLDivElement>(null);
  const priorityChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const creationTrendRef = useRef<HTMLDivElement>(null);

  /**
   * 计算真实的统计数据
   */
  const realStats = useMemo(() => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });
    
    // 计算每日完成率趋势
    const dailyCompletionTrend = last7Days.map(date => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });
      
      const completedTasks = dayTasks.filter(task => task.completed).length;
      const rate = dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0;
      
      return {
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        rate: Math.round(rate),
        total: dayTasks.length,
        completed: completedTasks
      };
    });
    
    // 计算任务创建趋势
    const creationTrend = last7Days.map(date => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const createdCount = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      }).length;
      
      return {
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        count: createdCount
      };
    });
    
    // 计算平均完成时间
    const completedTasks = tasks.filter(task => task.completed);
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(); // 假设完成时间是现在，实际应该有completedAt字段
          return sum + (completed.getTime() - created.getTime());
        }, 0) / completedTasks.length / (1000 * 60 * 60 * 24) // 转换为天数
      : 0;
    
    return {
      dailyCompletionTrend,
      creationTrend,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10
    };
  }, [tasks]);

  /**
   * 计算完成率百分比
   */
  const getCompletionRate = (): number => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  /**
   * 获取完成率颜色
   */
  const getCompletionRateColor = (rate: number): string => {
    if (rate >= 80) return 'text-emerald-600';
    if (rate >= 60) return 'text-amber-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  /**
   * 获取进度条颜色
   */
  const getProgressBarColor = (rate: number): string => {
    if (rate >= 80) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (rate >= 60) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    if (rate >= 40) return 'bg-gradient-to-r from-orange-500 to-red-400';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const completionRate = getCompletionRate();

  /**
   * 获取当前主题是否为深色模式
   */
  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
  };

  /**
   * 初始化饼图
   */
  const initPieChart = () => {
    if (!pieChartRef.current) return;
    
    const chart = echarts.init(pieChartRef.current);
    const pieData = [
      { name: '已完成', value: stats.completed },
      { name: '待完成', value: stats.pending },
      { name: '已逾期', value: stats.overdue }
    ].filter(item => item.value > 0);
    
    const darkMode = isDarkMode();
    
    const option = {
      title: {
        text: '任务状态分布',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: darkMode ? '#f3f4f6' : '#374151'
        },
        formatter: '{b}: {c} 个 ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        textStyle: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12
        },
        itemGap: 20
      },
      series: [{
        name: '任务状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          scaleSize: 5
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 12,
          color: darkMode ? '#d1d5db' : '#374151'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        color: [
          {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#10b981' },
              { offset: 1, color: '#059669' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#f59e0b' },
              { offset: 1, color: '#d97706' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#ef4444' },
              { offset: 1, color: '#dc2626' }
            ]
          }
        ]
      }]
    };
    
    chart.setOption(option);
    return chart;
  };

  /**
   * 初始化时间维度柱状图
   */
  const initTimeRangeChart = () => {
    if (!timeRangeChartRef.current) return;
    
    const chart = echarts.init(timeRangeChartRef.current);
    const darkMode = isDarkMode();
    
    const option = {
      title: {
        text: '按时间维度统计',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: darkMode ? '#f3f4f6' : '#374151'
        },
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      legend: {
        data: ['已完成', '待完成'],
        top: 50,
        textStyle: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['日任务', '周任务', '月任务', '年任务'],
        axisLine: {
          lineStyle: {
            color: darkMode ? '#4b5563' : '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          stack: 'total',
          data: [
            stats.byTimeRange[TimeRange.DAY]?.completed || 0,
            stats.byTimeRange[TimeRange.WEEK]?.completed || 0,
            stats.byTimeRange[TimeRange.MONTH]?.completed || 0,
            stats.byTimeRange[TimeRange.YEAR]?.completed || 0
          ],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#10b981' },
                { offset: 1, color: '#059669' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: '待完成',
          type: 'bar',
          stack: 'total',
          data: [
            (stats.byTimeRange[TimeRange.DAY]?.total || 0) - (stats.byTimeRange[TimeRange.DAY]?.completed || 0),
            (stats.byTimeRange[TimeRange.WEEK]?.total || 0) - (stats.byTimeRange[TimeRange.WEEK]?.completed || 0),
            (stats.byTimeRange[TimeRange.MONTH]?.total || 0) - (stats.byTimeRange[TimeRange.MONTH]?.completed || 0),
            (stats.byTimeRange[TimeRange.YEAR]?.total || 0) - (stats.byTimeRange[TimeRange.YEAR]?.completed || 0)
          ],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: '#d97706' }
              ]
            },
            borderRadius: [0, 0, 4, 4]
          }
        }
      ]
    };
    
    chart.setOption(option);
    return chart;
  };

  /**
   * 初始化优先级柱状图
   */
  const initPriorityChart = () => {
    if (!priorityChartRef.current) return;
    
    const chart = echarts.init(priorityChartRef.current);
    const darkMode = isDarkMode();
    
    const option = {
      title: {
        text: '按优先级统计',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: darkMode ? '#f3f4f6' : '#374151'
        },
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      legend: {
        data: ['已完成', '待完成'],
        top: 50,
        textStyle: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['高优先级', '中优先级', '低优先级'],
        axisLine: {
          lineStyle: {
            color: darkMode ? '#4b5563' : '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          stack: 'total',
          data: [
            stats.byPriority[Priority.HIGH]?.completed || 0,
            stats.byPriority[Priority.MEDIUM]?.completed || 0,
            stats.byPriority[Priority.LOW]?.completed || 0
          ],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#10b981' },
                { offset: 1, color: '#059669' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: '待完成',
          type: 'bar',
          stack: 'total',
          data: [
            (stats.byPriority[Priority.HIGH]?.total || 0) - (stats.byPriority[Priority.HIGH]?.completed || 0),
            (stats.byPriority[Priority.MEDIUM]?.total || 0) - (stats.byPriority[Priority.MEDIUM]?.completed || 0),
            (stats.byPriority[Priority.LOW]?.total || 0) - (stats.byPriority[Priority.LOW]?.completed || 0)
          ],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: '#d97706' }
              ]
            },
            borderRadius: [0, 0, 4, 4]
          }
        }
      ]
    };
    
    chart.setOption(option);
    return chart;
  };

  /**
   * 初始化完成率趋势折线图
   */
  const initTrendChart = () => {
    if (!trendChartRef.current) return;
    
    const chart = echarts.init(trendChartRef.current);
    const darkMode = isDarkMode();
    
    const option = {
      title: {
        text: '7日完成率趋势',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: '500',
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: darkMode ? '#f3f4f6' : '#374151'
        },
        formatter: function(params: any) {
          const data = params[0];
          const trend = realStats.dailyCompletionTrend[data.dataIndex];
          return `${data.name}<br/>完成率: ${data.value}%<br/>完成: ${trend.completed}/${trend.total}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: realStats.dailyCompletionTrend.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: darkMode ? '#4b5563' : '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: darkMode ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [{
        name: '完成率',
        type: 'line',
        data: realStats.dailyCompletionTrend.map(item => item.rate),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#10b981',
          width: 3
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(16, 185, 129, 0.2)'
            }, {
              offset: 1, color: 'rgba(16, 185, 129, 0.05)'
            }]
          }
        }
      }]
    };
    
    chart.setOption(option);
    return chart;
  };

  /**
   * 初始化任务创建趋势图
   */
  const initCreationTrendChart = () => {
    if (!creationTrendRef.current) return;
    
    const chart = echarts.init(creationTrendRef.current);
    const darkMode = isDarkMode();
    
    const option = {
      title: {
        text: '7日任务创建趋势',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: '500',
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: darkMode ? '#f3f4f6' : '#374151'
        },
        formatter: '{b}: {c} 个任务'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: realStats.creationTrend.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: darkMode ? '#4b5563' : '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
          color: darkMode ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [{
        name: '创建数量',
        type: 'bar',
        data: realStats.creationTrend.map(item => item.count),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#3b82f6'
            }, {
              offset: 1, color: '#1d4ed8'
            }]
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#60a5fa'
              }, {
                offset: 1, color: '#3b82f6'
              }]
            }
          }
        }
      }]
    };
    
    chart.setOption(option);
    return chart;
  };

  /**
   * 初始化所有图表
   */
  useEffect(() => {
    const charts = [
      initPieChart(),
      initTimeRangeChart(),
      initPriorityChart(),
      initTrendChart(),
      initCreationTrendChart()
    ].filter(Boolean);
    
    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      charts.forEach(chart => chart?.resize());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      charts.forEach(chart => chart?.dispose());
    };
  }, [stats, completionRate, realStats]);

  /**
   * 空数据状态组件
   */
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
      <Activity className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">暂无任务数据</h3>
      <p className="text-sm text-center max-w-md text-gray-600 dark:text-gray-400">
        开始创建您的第一个任务，我们将为您展示详细的统计分析
      </p>
    </div>
  );

  // 如果没有任务数据，显示空状态
  if (stats.total === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <EmptyState />
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              任务统计分析
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">深入了解您的任务完成情况和工作效率</p>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 总任务数 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">总任务</div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>

          {/* 已完成任务 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.completed}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">已完成</div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"></div>
          </div>

          {/* 待完成任务 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.pending}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">待完成</div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </div>

          {/* 逾期任务 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.overdue}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">已逾期</div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* 完成率和平均完成时间 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 完成率进度 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">整体完成率</h3>
            </div>
            <div className="text-center mb-6">
              <div className={`text-5xl font-bold mb-2 ${getCompletionRateColor(completionRate)}`}>
                {completionRate}%
              </div>
              <p className="text-gray-600 dark:text-gray-300">当前完成进度</p>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(completionRate)}`}
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* 平均完成时间 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">平均完成时间</h3>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {realStats.avgCompletionTime}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">天</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  基于已完成任务的平均用时计算
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 任务分布饼图 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="h-96" ref={pieChartRef}></div>
          </div>

          {/* 时间维度统计 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="h-96" ref={timeRangeChartRef}></div>
          </div>

          {/* 优先级统计 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="h-96" ref={priorityChartRef}></div>
          </div>

          {/* 完成率趋势 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="h-96" ref={trendChartRef}></div>
          </div>
        </div>

        {/* 任务创建趋势 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="h-96" ref={creationTrendRef}></div>
        </div>
      </div>
    </div>
  );
};