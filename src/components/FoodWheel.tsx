import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface FoodWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 今天吃什么转盘游戏组件
 */
export const FoodWheel: React.FC<FoodWheelProps> = ({ isOpen, onClose }) => {
  const [foods, setFoods] = useState<string[]>([]);
  const [newFood, setNewFood] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  /**
   * 默认食物列表
   */
  const defaultFoods = [
    '麻辣烫', '火锅', '烤肉', '寿司', '拉面',
    '汉堡', '披萨', '炸鸡', '牛排', '意面',
    '中式炒菜', '韩式料理', '泰式料理', '日式料理', '西式简餐',
    '粥类', '面条', '饺子', '包子', '煎饼'
  ];

  /**
   * 从本地存储加载食物列表
   */
  const loadFoods = () => {
    const savedFoods = localStorage.getItem('food-wheel-items');
    if (savedFoods) {
      try {
        const parsedFoods = JSON.parse(savedFoods);
        if (Array.isArray(parsedFoods) && parsedFoods.length > 0) {
          setFoods(parsedFoods);
          return;
        }
      } catch (error) {
        console.error('Failed to parse saved foods:', error);
      }
    }
    // 如果没有保存的数据或解析失败，使用默认食物
    setFoods([...defaultFoods]);
  };

  /**
   * 保存食物列表到本地存储
   */
  const saveFoods = (foodList: string[]) => {
    localStorage.setItem('food-wheel-items', JSON.stringify(foodList));
  };

  /**
   * 添加新食物
   */
  const addFood = () => {
    if (newFood.trim() && !foods.includes(newFood.trim())) {
      const updatedFoods = [...foods, newFood.trim()];
      setFoods(updatedFoods);
      saveFoods(updatedFoods);
      setNewFood('');
      toast.success(`已添加 "${newFood.trim()}" 到转盘！`);
    } else if (foods.includes(newFood.trim())) {
      toast.error('这个食物已经在转盘中了！');
    }
  };

  /**
   * 删除食物
   */
  const removeFood = (foodToRemove: string) => {
    const updatedFoods = foods.filter(food => food !== foodToRemove);
    setFoods(updatedFoods);
    saveFoods(updatedFoods);
    toast.success(`已从转盘中移除 "${foodToRemove}"！`);
  };

  /**
   * 重置为默认食物
   */
  const resetToDefault = () => {
    setFoods([...defaultFoods]);
    saveFoods([...defaultFoods]);
    toast.success('已重置为默认食物列表！');
  };

  /**
   * 转动转盘
   */
  const spinWheel = () => {
    if (foods.length === 0) {
      toast.error('转盘中没有食物，请先添加一些食物！');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedFood(null);

    // 随机选择一个食物
    const randomIndex = Math.floor(Math.random() * foods.length);
    const selected = foods[randomIndex];

    // 计算转盘应该转到的角度
    const anglePerItem = 360 / foods.length;
    const targetAngle = randomIndex * anglePerItem;
    
    // 添加多圈旋转使效果更好
    const spins = 5; // 转5圈
    const finalRotation = rotation + (spins * 360) + (360 - targetAngle);
    
    setRotation(finalRotation);

    // 2.5秒后停止并显示结果
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedFood(selected);
      toast.success(`🎉 今天吃 "${selected}" 吧！`, {
        duration: 3000,
        position: 'top-center',
      });
    }, 2500);
  };

  /**
   * 处理回车键添加食物
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addFood();
    }
  };

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    if (isOpen) {
      loadFoods();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">今天吃什么</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* 转盘区域 */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-64 h-64 mb-6">
              {/* 转盘背景 */}
              <div 
                className="w-full h-full rounded-full border-4 border-gray-300 dark:border-gray-600 relative overflow-hidden transition-transform duration-[2500ms] ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {foods.length > 0 ? (
                  foods.map((food, index) => {
                    const angle = (360 / foods.length) * index;
                    const nextAngle = (360 / foods.length) * (index + 1);
                    const midAngle = (angle + nextAngle) / 2;
                    
                    // 为每个扇形生成不同的颜色
                    const colors = [
                      'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
                      'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400',
                      'bg-teal-400', 'bg-cyan-400', 'bg-lime-400', 'bg-rose-400',
                      'bg-violet-400', 'bg-amber-400', 'bg-emerald-400', 'bg-sky-400',
                      'bg-fuchsia-400', 'bg-slate-400', 'bg-zinc-400', 'bg-stone-400'
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={index}
                        className={`absolute w-full h-full ${colorClass} opacity-80`}
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                        }}
                      >
                        <div
                          className="absolute text-white text-xs font-medium whitespace-nowrap"
                          style={{
                            left: `${50 + 30 * Math.cos((midAngle - 90) * Math.PI / 180)}%`,
                            top: `${50 + 30 * Math.sin((midAngle - 90) * Math.PI / 180)}%`,
                            transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                          }}
                        >
                          {food}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    暂无食物
                  </div>
                )}
              </div>
              
              {/* 指针 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
            </div>

            {/* 转盘按钮 */}
            <button
              onClick={spinWheel}
              disabled={isSpinning || foods.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSpinning ? '转盘中...' : '开始转盘'}
            </button>

            {/* 结果显示 */}
            {selectedFood && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  🎉 今天吃：<span className="text-green-600 dark:text-green-400">{selectedFood}</span>
                </div>
              </div>
            )}
          </div>

          {/* 食物管理 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">管理食物</h3>
            
            {/* 添加食物 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入新的食物..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={addFood}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>

            {/* 食物列表 */}
            <div className="max-h-40 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {foods.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{food}</span>
                    <button
                      onClick={() => removeFood(food)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 重置按钮 */}
            <div className="flex justify-center">
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置为默认食物
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};