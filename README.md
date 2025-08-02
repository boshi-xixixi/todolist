一个现代化的待办事项管理应用，基于 React + TypeScript + Vite 构建，提供直观的任务管理和数据统计功能。

## ✨ 功能特性

### 📝 任务管理
- **任务创建**：支持添加任务标题、描述、截止日期、优先级等信息
- **任务编辑**：可修改任务的所有属性
- **任务状态**：一键切换完成/未完成状态
- **任务删除**：支持删除不需要的任务
- **任务详情**：点击查看任务完整信息

### 🔍 智能筛选
- **时间筛选**：今日任务、本周任务、本月任务
- **状态筛选**：全部、已完成、未完成、逾期任务
- **优先级筛选**：高、中、低优先级任务
- **日期选择**：通过日历选择特定日期的任务

### 📊 数据统计
- **任务概览**：总任务数、完成数、待完成数、逾期数
- **完成率统计**：实时计算任务完成率
- **趋势分析**：完成率趋势图、任务创建趋势
- **分布统计**：按状态、时间、优先级的任务分布
- **平均完成时间**：统计任务平均完成耗时

### 🎨 用户体验
- **响应式设计**：适配桌面和移动设备
- **现代化UI**：简洁美观的界面设计
- **交互友好**：流畅的动画和反馈
- **数据持久化**：本地存储，刷新不丢失
- **空状态提示**：友好的空数据提示界面

## 🛠️ 技术栈

### 前端框架
- **React 18** - 用户界面构建
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具

### 状态管理
- **Zustand** - 轻量级状态管理库

### UI 组件
- **Tailwind CSS** - 原子化 CSS 框架
- **Lucide React** - 现代化图标库
- **clsx** - 条件类名工具
- **tailwind-merge** - Tailwind 类名合并

### 数据可视化
- **ECharts** - 专业的数据可视化库
- **echarts-for-react** - React ECharts 组件

### 路由
- **React Router DOM** - 客户端路由

### 数据存储
- **localStorage** - 浏览器本地存储

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
# 克隆项目
git clone <your-repo-url>
cd todolist

# 安装依赖
npm install
```

### 开发运行
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建部署
```bash
# 类型检查
npm run check

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
todolist/
├── public/                 # 静态资源
│   └── favicon.svg
├── src/
│   ├── components/         # React 组件
│   │   ├── Empty.tsx       # 空状态组件
│   │   ├── MiniCalendar.tsx # 迷你日历
│   │   ├── TaskDetailModal.tsx # 任务详情弹窗
│   │   ├── TaskFilter.tsx  # 任务筛选器
│   │   ├── TaskForm.tsx    # 任务表单
│   │   ├── TaskItem.tsx    # 任务项组件
│   │   ├── TaskSidebar.tsx # 侧边栏
│   │   └── TaskStats.tsx   # 统计分析
│   ├── hooks/              # 自定义 Hooks
│   │   └── useTheme.ts     # 主题管理
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数
│   ├── pages/              # 页面组件
│   │   └── Home.tsx        # 主页面
│   ├── store/              # 状态管理
│   │   └── taskStore.ts    # 任务状态管理
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 类型声明
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── .gitignore              # Git 忽略文件
├── package.json            # 项目配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置
```

## 🎯 核心功能实现

### 任务状态管理
使用 Zustand 进行状态管理，提供：
- 任务 CRUD 操作
- 筛选和搜索功能
- 数据持久化
- 统计计算

### 数据可视化
集成 ECharts 实现：
- 任务状态分布饼图
- 完成率趋势折线图
- 任务创建趋势图
- 按时间/优先级统计柱状图

### 响应式设计
使用 Tailwind CSS 实现：
- 移动端适配
- 灵活的布局系统
- 现代化的视觉效果

## 🔧 开发说明

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 TypeScript 确保类型安全
- 遵循 React Hooks 最佳实践

### 组件设计
- 函数式组件 + Hooks
- 组件职责单一
- 良好的可复用性

### 性能优化
- 使用 useMemo 优化计算
- 合理的组件拆分
- 懒加载和代码分割

## 📝 更新日志

### v1.0.0 (2025-08-02)
- ✅ 基础任务管理功能
- ✅ 任务筛选和搜索
- ✅ 数据统计和可视化
- ✅ 响应式设计
- ✅ 本地数据持久化

## 📝 之后期望
- 桌面端
- 移动端
- 加入 AI 功能
  - 任务智能建议
  - 任务优先级推荐
  - 任务完成时间预测
- 本地数据持久化
- 云端同步

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [ECharts](https://echarts.apache.org/)
- [Lucide](https://lucide.dev/)

---

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**