import React, { useState, useEffect } from 'react';
import { Droplets, X } from 'lucide-react';
import { toast } from 'sonner';

interface WaterTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 今日喝水追踪组件
 */
export const WaterTracker: React.FC<WaterTrackerProps> = ({ isOpen, onClose }) => {
  const [waterCount, setWaterCount] = useState(0);
  const [todayDate, setTodayDate] = useState('');

  /**
   * 鼓励喝水的语句
   */
  const waterEncouragements = [
    '💧 太棒了！保持水分充足！',
    '🌊 干得好！身体需要水分！',
    '💙 继续保持！健康从喝水开始！',
    '✨ 很棒！你的身体会感谢你的！',
    '🎯 完美！达到今日喝水目标！',
    '🌟 坚持得很好！水是生命之源！',
    '💪 加油！每一杯水都很重要！',
    '🏆 喝水达人！为健康点赞！',
    '🎉 太好了！保持这个好习惯！',
    '💎 优秀！你真是个健康达人！'
  ];

  /**
   * 获取今日日期字符串
   */
  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  /**
   * 从本地存储加载今日喝水数据
   */
  const loadWaterData = () => {
    const today = getTodayDateString();
    const savedData = localStorage.getItem(`water-tracker-${today}`);
    if (savedData) {
      setWaterCount(parseInt(savedData, 10));
    } else {
      setWaterCount(0);
    }
    setTodayDate(today);
  };

  /**
   * 保存喝水数据到本地存储
   */
  const saveWaterData = (count: number) => {
    const today = getTodayDateString();
    localStorage.setItem(`water-tracker-${today}`, count.toString());
  };

  /**
   * 获取随机鼓励语句
   */
  const getRandomEncouragement = () => {
    return waterEncouragements[Math.floor(Math.random() * waterEncouragements.length)];
  };

  /**
   * 增加喝水次数
   */
  const addWater = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    saveWaterData(newCount);
    
    // 显示鼓励语句
    toast.success(getRandomEncouragement(), {
      duration: 2000,
      position: 'top-center',
    });
  };

  /**
   * 减少喝水次数
   */
  const removeWater = () => {
    if (waterCount > 0) {
      const newCount = waterCount - 1;
      setWaterCount(newCount);
      saveWaterData(newCount);
    }
  };

  /**
   * 重置今日喝水记录
   */
  const resetWater = () => {
    setWaterCount(0);
    saveWaterData(0);
    toast.info('今日喝水记录已重置', {
      duration: 2000,
      position: 'top-center',
    });
  };

  /**
   * 获取喝水状态文本
   */
  const getWaterStatus = () => {
    if (waterCount >= 8) {
      return { text: '优秀！已达到推荐量', color: 'text-green-600 dark:text-green-400' };
    } else if (waterCount >= 6) {
      return { text: '很好！接近目标了', color: 'text-blue-600 dark:text-blue-400' };
    } else if (waterCount >= 4) {
      return { text: '不错！继续保持', color: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { text: '加油！多喝水有益健康', color: 'text-orange-600 dark:text-orange-400' };
    }
  };

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    if (isOpen) {
      loadWaterData();
    }
  }, [isOpen]);

  /**
   * 检查日期变化，重置数据
   */
  useEffect(() => {
    const today = getTodayDateString();
    if (todayDate && todayDate !== today) {
      loadWaterData();
    }
  }, [todayDate]);

  if (!isOpen) return null;

  const waterStatus = getWaterStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">今日喝水</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 喝水统计 */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {waterCount}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-1">
              杯水 / 8杯 (推荐)
            </div>
            <div className={`text-sm font-medium ${waterStatus.color}`}>
              {waterStatus.text}
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((waterCount / 8) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={addWater}
              className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              + 喝了一杯水
            </button>
            <button
              onClick={removeWater}
              disabled={waterCount === 0}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              - 撤销
            </button>
          </div>

          <button
            onClick={resetWater}
            className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            重置今日记录
          </button>
        </div>

        {/* 小贴士 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 喝水小贴士
          </h3>
          <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
            <li>• 成人每日建议饮水量为 1.5-2 升</li>
            <li>• 运动后要及时补充水分</li>
            <li>• 少量多次饮水比一次大量饮水更好</li>
            <li>• 起床后喝一杯温水有助于新陈代谢</li>
          </ul>
        </div>
      </div>
    </div>
  );
};