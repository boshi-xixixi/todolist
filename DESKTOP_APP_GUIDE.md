# TodoList 桌面应用指南

## 概述

TodoList 现在支持两种运行方式：
1. **浏览器版本** - 在浏览器中访问，数据存储在 localStorage
2. **桌面应用** - 独立的桌面应用，数据存储在本地数据库文件

## 功能特性

### 共同特性
- ✅ 任务管理（添加、编辑、删除、标记完成）
- ✅ 任务分类和优先级
- ✅ 数据导入导出
- ✅ 响应式设计
- ✅ 现代化UI界面

### 桌面应用独有特性
- 🖥️ 原生桌面体验
- 💾 本地数据库存储（JSON格式）
- 🔔 系统通知支持
- 📁 文件系统集成（导入/导出）
- ⚡ 更好的性能
- 🔒 数据安全性更高

## 开发环境设置

### 1. 安装依赖

```bash
# 安装所有依赖（包括Electron）
npm install
```

### 2. 开发模式

#### 浏览器开发
```bash
# 启动Web开发服务器
npm run dev
```
然后在浏览器中访问 `http://localhost:5173`

#### 桌面应用开发
```bash
# 同时启动Web服务器和Electron应用
npm run electron:dev
```

### 3. 构建和打包

#### 构建Web版本
```bash
# 构建用于浏览器的版本
npm run build
```

#### 打包桌面应用
```bash
# 构建并打包桌面应用
npm run electron:pack

# 构建并生成安装包
npm run electron:dist
```

## 数据存储

### 浏览器版本
- 使用 `localStorage` 存储数据
- 数据存储在浏览器本地
- 清除浏览器数据会丢失任务

### 桌面应用版本
- 使用本地JSON文件存储数据
- 数据文件位置：
  - **macOS**: `~/Library/Application Support/TodoList/todolist.json`
  - **Windows**: `%APPDATA%/TodoList/todolist.json`
  - **Linux**: `~/.config/TodoList/todolist.json`

## 数据迁移

### 从浏览器版本迁移到桌面版本
1. 在浏览器版本中导出数据
2. 在桌面应用中导入数据

### 从桌面版本迁移到浏览器版本
1. 在桌面应用中导出数据
2. 在浏览器版本中导入数据

## 支持的平台

### 桌面应用
- **macOS**: Intel (x64) 和 Apple Silicon (arm64)
- **Windows**: 64位 (x64) 和 32位 (ia32)
- **Linux**: 64位 (x64)

### 安装包格式
- **macOS**: `.dmg` 和 `.zip`
- **Windows**: `.exe` (NSIS安装器) 和便携版
- **Linux**: `.AppImage` 和 `.deb`

## 项目结构

```
todolist/
├── electron/                 # Electron相关文件
│   ├── main.js              # 主进程文件
│   ├── preload.js           # 预加载脚本
│   └── database.js          # 数据库服务
├── src/                     # React应用源码
│   ├── utils/
│   │   └── database.ts      # 数据库适配器
│   └── ...
├── dist/                    # Web构建输出
├── dist-electron/           # 桌面应用构建输出
└── package.json             # 项目配置
```

## 开发注意事项

### 1. 环境检测
应用会自动检测运行环境：
```typescript
import { isElectron } from './utils/database';

if (isElectron()) {
  // 桌面应用环境
} else {
  // 浏览器环境
}
```

### 2. 数据库使用
```typescript
import { db } from './utils/database';

// 统一的API，自动适配环境
const tasks = await db.getTasks();
const newTask = await db.addTask({
  title: '新任务',
  completed: false,
  priority: 'medium',
  category: 'work'
});
```

### 3. 通知功能
```typescript
import { showNotification } from './utils/database';

// 自动选择系统通知或Web通知
await showNotification('任务完成', '恭喜完成一个任务！');
```

## 故障排除

### 常见问题

1. **Electron安装失败**
   ```bash
   # 使用中国镜像
   npm config set registry https://registry.npmmirror.com
   npm config set electron_mirror https://npmmirror.com/mirrors/electron/
   npm install
   ```

2. **构建失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **数据丢失**
   - 桌面应用：检查数据文件是否存在
   - 浏览器版本：检查localStorage是否被清除

### 调试

- **桌面应用调试**: 按 `Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows/Linux) 打开开发者工具
- **日志查看**: 检查控制台输出

## 更新和维护

### 依赖更新
```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update
```

### 版本发布
1. 更新 `package.json` 中的版本号
2. 运行 `npm run electron:dist` 生成安装包
3. 测试安装包
4. 发布到相应平台

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **桌面**: Electron
- **状态管理**: Zustand
- **图表**: Recharts + ECharts
- **构建**: electron-builder
- **开发工具**: ESLint + TypeScript

## 贡献指南

请参考 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何贡献代码。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。