import React from 'react';
import { ArrowLeft, Info, Palette, Bell, Shield, HelpCircle, Monitor, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

/**
 * 设置页面组件
 * 提供应用的各种设置选项
 */
export function Settings() {
  const navigate = useNavigate();
  const { themeMode, setThemeMode } = useTheme();

  /**
   * 返回上一页
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="返回"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              设置
            </h1>
          </div>
        </div>
      </div>

      {/* 设置内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* 外观设置 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  外观设置
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  主题模式
                </label>
                <div className="space-y-2">
                  {/* 自动跟随系统 */}
                  <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="themeMode"
                      value="auto"
                      checked={themeMode === 'auto'}
                      onChange={() => setThemeMode('auto')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex items-center">
                      <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          跟随系统
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          自动根据系统设置切换主题
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* 手动浅色 */}
                  <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="themeMode"
                      value="light"
                      checked={themeMode === 'light'}
                      onChange={() => setThemeMode('light')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex items-center">
                      <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          浅色模式
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          始终使用浅色主题
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* 手动深色 */}
                  <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="themeMode"
                      value="dark"
                      checked={themeMode === 'dark'}
                      onChange={() => setThemeMode('dark')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex items-center">
                      <Moon className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          深色模式
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          始终使用深色主题
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  通知设置
                </h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    任务提醒
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    在任务到期时发送通知
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    每日总结
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    每天晚上发送任务完成总结
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 隐私与安全 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  隐私与安全
                </h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  数据导出
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  导出您的所有任务数据
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  清除数据
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  删除所有本地存储的数据
                </p>
              </button>
            </div>
          </div>

          {/* 关于应用 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  关于应用
                </h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">版本</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">开发者</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">TodoList Team</span>
              </div>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      帮助与支持
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      查看使用指南和常见问题
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;