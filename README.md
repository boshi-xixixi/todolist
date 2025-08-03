<div align="center">

# 📝 TodoList - 多功能生产力管理应用

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Electron-28.x-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-5.x-FF6B6B?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/yourusername/todolist?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/yourusername/todolist?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/yourusername/todolist?style=for-the-badge" alt="Forks" />
  <img src="https://img.shields.io/github/issues/yourusername/todolist?style=for-the-badge" alt="Issues" />
</p>

<p align="center">
  一个功能丰富的生产力管理应用，集成任务管理、记事本、特殊日期提醒、健康追踪等多种功能<br>
  基于 React + TypeScript + Electron 构建，支持 Web 和桌面端，让您的工作生活更加高效有序
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-技术栈">技术栈</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#-贡献指南">贡献指南</a>
</p>

</div>

---

## 🎯 项目亮点

- 🚀 **现代化技术栈**：React 18 + TypeScript + Vite + Electron，Web 和桌面端双支持
- 📊 **数据可视化**：集成 ECharts 和 Recharts，提供丰富的统计图表
- 🎨 **精美UI设计**：基于 Tailwind CSS，支持明暗主题切换，响应式设计
- ⚡ **高性能**：使用 Zustand 轻量级状态管理，性能优化到位
- 💾 **数据持久化**：本地存储 + IndexedDB，数据安全不丢失
- 🔍 **智能筛选**：多维度任务筛选，快速找到目标任务
- 🎯 **多功能集成**：任务管理、记事本、日期提醒、健康追踪一体化
- 🌙 **主题支持**：明暗主题无缝切换，护眼模式

## 📸 应用预览

### 🏠 主界面
<div align="center">
  <img src="./docs/images/preview-main.png" alt="主界面预览" width="800" />
  <p><em>主界面 - 任务管理、迷你日历、侧边栏导航一览</em></p>
</div>

### 📊 数据统计
<div align="center">
  <img src="./docs/images/preview-stats.png" alt="统计页面预览" width="800" />
  <p><em>统计分析 - ECharts 和 Recharts 数据可视化展示</em></p>
</div>

### 📒 记事本功能
<div align="center">
  <img src="./docs/images/preview-notes.png" alt="记事本页面预览" width="800" />
  <p><em>记事本 - 支持标签分类、颜色标记、搜索排序</em></p>
</div>

### 📅 特殊日期管理
<div align="center">
  <img src="./docs/images/preview-special-dates.png" alt="特殊日期页面预览" width="800" />
  <p><em>特殊日期 - 生日、纪念日、重要事件管理</em></p>
</div>

### 🌙 主题切换
<div align="center">
  <img src="./docs/images/preview-theme.png" alt="主题切换预览" width="800" />
  <p><em>明暗主题 - 无缝切换，护眼模式</em></p>
</div>

### 💻 桌面应用
<div align="center">
  <img src="./docs/images/preview-desktop.png" alt="桌面应用预览" width="800" />
  <p><em>Electron 桌面应用 - 跨平台支持</em></p>
</div>

## 🌟 在线演示

<div align="center">
  <a href="https://your-demo-url.com" target="_blank">
    <img src="https://img.shields.io/badge/🌐_在线演示-立即体验-4CAF50?style=for-the-badge&logoColor=white" alt="在线演示" />
  </a>
</div>

## ✨ 功能特性

### 📝 任务管理
- **任务创建**：支持添加任务标题、描述、截止日期、优先级等信息
- **任务编辑**：可修改任务的所有属性
- **任务状态**：一键切换完成/未完成状态
- **任务删除**：支持删除不需要的任务
- **任务详情**：点击查看任务完整信息
- **迷你日历**：直观的日历视图，显示任务分布和特殊日期

### 📒 记事本功能
- **富文本编辑**：支持 Markdown 格式的记事本编辑
- **标签管理**：为记事本添加标签，便于分类管理
- **颜色分类**：支持多种颜色标记，视觉化分类
- **搜索功能**：快速搜索记事本内容
- **置顶功能**：重要记事本可置顶显示
- **排序选项**：按创建时间、更新时间、标题排序

### 📅 特殊日期管理
- **日期提醒**：添加生日、纪念日、重要事件等特殊日期
- **图标标识**：为不同类型的日期设置专属图标
- **颜色区分**：用不同颜色区分日期类型
- **日历集成**：在迷你日历中直观显示特殊日期
- **提醒功能**：重要日期临近时的提醒通知

### 💧 健康追踪
- **喝水记录**：记录每日饮水量，培养健康习惯
- **目标设定**：设置每日饮水目标
- **进度显示**：直观的进度条显示完成情况
- **历史统计**：查看历史饮水记录和趋势

### 🎲 趣味功能
- **美食转盘**：随机选择美食，解决选择困难症
- **自定义选项**：可自定义转盘选项内容
- **动画效果**：流畅的转盘动画效果

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
- **可视化图表**：使用 ECharts 和 Recharts 展示数据

### 🎨 用户体验
- **响应式设计**：适配桌面和移动设备
- **主题切换**：支持明暗主题无缝切换
- **现代化UI**：简洁美观的界面设计
- **交互友好**：流畅的动画和反馈
- **数据持久化**：本地存储 + IndexedDB，数据安全
- **空状态提示**：友好的空数据提示界面
- **桌面应用**：支持 Electron 桌面端应用

## 🛠️ 技术栈

### 前端框架
- **React 18** - 用户界面构建
- **TypeScript** - 类型安全的 JavaScript
- **Vite 6** - 快速的构建工具
- **Electron 28** - 跨平台桌面应用框架

### 状态管理
- **Zustand 5** - 轻量级状态管理库

### UI 组件
- **Tailwind CSS 3** - 原子化 CSS 框架
- **Lucide React** - 现代化图标库
- **clsx** - 条件类名工具
- **tailwind-merge** - Tailwind 类名合并
- **Sonner** - 优雅的 Toast 通知组件

### 数据可视化
- **ECharts 5** - 专业的数据可视化库
- **echarts-for-react** - React ECharts 组件
- **Recharts 3** - React 图表库

### 路由
- **React Router DOM 7** - 客户端路由

### 数据存储
- **localStorage** - 浏览器本地存储
- **IndexedDB** - 浏览器数据库存储

### 主题系统
- **React Context** - 主题状态管理
- **CSS Variables** - 动态主题切换

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - TypeScript 代码规范
- **Concurrently** - 并行运行脚本
- **Electron Builder** - Electron 应用打包

## 🚀 快速开始

### 📋 环境要求

<div align="center">
  <img src="https://img.shields.io/badge/Node.js->=16.0.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/npm->=7.0.0-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm" />
</div>

### 📦 安装依赖

```bash
# 1️⃣ 克隆项目
git clone https://github.com/yourusername/todolist.git
cd todolist

# 2️⃣ 安装依赖（推荐使用国内镜像）
npm install
# 或使用 yarn
yarn install
# 或使用 pnpm
pnpm install
```

### 🛠️ 开发运行

#### Web 版本
```bash
# 启动开发服务器
npm run dev

# 🌐 访问 http://localhost:5173
```

#### 桌面应用
```bash
# 启动 Electron 开发环境
npm run electron:dev

# 或者分别启动
npm run dev          # 启动 Web 服务
npm run electron     # 启动 Electron 应用
```

### 🏗️ 构建部署

#### Web 版本构建
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

#### 桌面应用打包
```bash
# 打包桌面应用（开发版）
npm run electron:pack

# 构建发布版本
npm run electron:dist
```

#### 支持的平台
- **Windows**: NSIS 安装包 + 便携版
- **macOS**: DMG 安装包 + ZIP 压缩包（支持 Intel 和 Apple Silicon）
- **Linux**: AppImage + DEB 安装包

### 🐳 Docker 部署

```bash
# 构建镜像
docker build -t todolist .

# 运行容器
docker run -p 3000:3000 todolist
```

## 📁 项目结构

```
todolist/
├── public/                 # 静态资源
│   └── favicon.svg
├── electron/               # Electron 主进程文件
│   ├── main.js            # Electron 主进程
│   └── preload.js         # 预加载脚本
├── src/
│   ├── components/         # React 组件
│   │   ├── ConfirmDialog.tsx    # 确认对话框
│   │   ├── DatabaseDemo.tsx     # 数据库演示
│   │   ├── DateInput.tsx        # 日期输入组件
│   │   ├── DatePicker.tsx       # 日期选择器
│   │   ├── DatePickerModal.tsx  # 日期选择弹窗
│   │   ├── Empty.tsx            # 空状态组件
│   │   ├── FoodWheel.tsx        # 美食转盘
│   │   ├── MiniCalendar.tsx     # 迷你日历
│   │   ├── NoteCard.tsx         # 记事本卡片
│   │   ├── NoteForm.tsx         # 记事本表单
│   │   ├── SpecialDateCard.tsx  # 特殊日期卡片
│   │   ├── SpecialDateForm.tsx  # 特殊日期表单
│   │   ├── TaskDetailModal.tsx  # 任务详情弹窗
│   │   ├── TaskFilter.tsx       # 任务筛选器
│   │   ├── TaskForm.tsx         # 任务表单
│   │   ├── TaskItem.tsx         # 任务项组件
│   │   ├── TaskSidebar.tsx      # 侧边栏
│   │   ├── TaskStats.tsx        # 统计分析
│   │   ├── ThemeToggle.tsx      # 主题切换
│   │   ├── WaterTracker.tsx     # 喝水追踪
│   │   └── ui/                  # UI 基础组件
│   │       ├── Badge.tsx        # 徽章组件
│   │       ├── Button.tsx       # 按钮组件
│   │       └── Card.tsx         # 卡片组件
│   ├── contexts/           # React Context
│   │   └── ThemeContext.tsx     # 主题上下文
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── database.ts          # 数据库工具
│   │   └── utils.ts             # 通用工具函数
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx             # 主页面
│   │   ├── Notes.tsx            # 记事本页面
│   │   ├── Settings.tsx         # 设置页面
│   │   ├── SpecialDates.tsx     # 特殊日期页面
│   │   └── TodayTasks.tsx       # 今日任务页面
│   ├── store/              # 状态管理
│   │   ├── noteStore.ts         # 记事本状态管理
│   │   ├── specialDateStore.ts  # 特殊日期状态管理
│   │   └── taskStore.ts         # 任务状态管理
│   ├── types/              # TypeScript 类型定义
│   │   ├── index.ts             # 基础类型声明
│   │   ├── note.ts              # 记事本类型
│   │   └── specialDate.ts       # 特殊日期类型
│   ├── utils/              # 工具函数
│   │   └── database.ts          # 数据库操作工具
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # 应用入口
│   ├── index.css           # 全局样式
│   └── vite-env.d.ts       # Vite 环境类型
├── .gitignore              # Git 忽略文件
├── package.json            # 项目配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── electron.vite.config.ts # Electron Vite 配置
└── README.md               # 项目文档
```

## 🎯 核心功能实现

### 状态管理架构
使用 Zustand 进行模块化状态管理：
- **taskStore.ts** - 任务 CRUD 操作、筛选搜索、统计计算
- **noteStore.ts** - 记事本管理、标签分类、搜索排序
- **specialDateStore.ts** - 特殊日期管理、提醒功能
- 数据持久化到 localStorage 和 IndexedDB

### 数据可视化
集成多种图表库实现丰富的数据展示：
- **ECharts** - 任务状态分布饼图、完成率趋势折线图
- **Recharts** - 任务创建趋势图、按时间/优先级统计柱状图
- **自定义组件** - 进度条、统计卡片、迷你图表

### 主题系统
基于 React Context 和 CSS Variables 实现：
- 明暗主题无缝切换
- 系统主题自动检测
- 主题状态持久化
- 所有组件主题适配

### 桌面应用
使用 Electron 实现跨平台桌面应用：
- 主进程和渲染进程分离
- 原生菜单和快捷键支持
- 系统托盘集成
- 自动更新机制

### 数据存储
多层次数据存储方案：
- **localStorage** - 轻量级配置和缓存
- **IndexedDB** - 大量结构化数据存储
- **数据库工具类** - 统一的数据操作接口
- **数据迁移** - 版本升级时的数据兼容

### 响应式设计
使用 Tailwind CSS 实现：
- 移动端适配（sm/md/lg/xl 断点）
- 灵活的网格布局系统
- 现代化的视觉效果和动画
- 组件级响应式设计

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

### v1.0.0 (2025-01-02)
- ✅ 基础任务管理功能
- ✅ 任务筛选和搜索
- ✅ 数据统计和可视化
- ✅ 响应式设计
- ✅ 本地数据持久化
- ✅ 记事本功能（支持标签、颜色分类、搜索）
- ✅ 特殊日期管理（生日、纪念日提醒）
- ✅ 喝水追踪功能
- ✅ 美食转盘趣味功能
- ✅ 明暗主题切换
- ✅ Electron 桌面应用支持
- ✅ IndexedDB 数据存储
- ✅ 迷你日历集成

## 🚀 未来规划

### v1.1.0 (计划中)
- 🔄 云端数据同步
- 📱 移动端 PWA 支持
- 🔔 系统通知和提醒
- 📊 更多统计图表类型
- 🎨 自定义主题色彩

### v1.2.0 (计划中)
- 🤖 AI 功能集成
  - 任务智能建议
  - 任务优先级推荐
  - 任务完成时间预测
  - 智能日程安排
- 👥 多用户支持
- 🔗 第三方服务集成（日历、邮件等）

### v2.0.0 (远期规划)
- 🌐 Web 端多人协作
- 📱 原生移动应用
- 🔄 实时同步
- 🎯 项目管理功能
- 📈 高级分析报告

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是报告 bug、提出新功能建议，还是提交代码改进。

### 🔧 开发流程

1. **Fork 本仓库** 到你的 GitHub 账户
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开 Pull Request**

### 📝 提交规范

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 🐛 问题反馈

发现 bug？有新想法？欢迎 [提交 Issue](https://github.com/yourusername/todolist/issues/new)！

## 👥 贡献者

<div align="center">
  <a href="https://github.com/yourusername/todolist/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=yourusername/todolist" alt="贡献者" />
  </a>
</div>

## 📊 项目统计

<div align="center">
  <img src="https://repobeats.axiom.co/api/embed/your-repo-id.svg" alt="Repobeats analytics" />
</div>

<div align="center">
  <img src="https://starchart.cc/yourusername/todolist.svg" alt="Star History Chart" width="600" />
</div>

## 📄 许可证

<div align="center">
  <img src="https://img.shields.io/github/license/yourusername/todolist?style=for-the-badge" alt="License" />
</div>

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情。

## 🙏 致谢

<div align="center">

### 🛠️ 技术栈致谢

<table>
  <tr>
    <td align="center"><a href="https://reactjs.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40" height="40"/><br><sub><b>React</b></sub></a></td>
    <td align="center"><a href="https://www.typescriptlang.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40"/><br><sub><b>TypeScript</b></sub></a></td>
    <td align="center"><a href="https://vitejs.dev/"><img src="https://vitejs.dev/logo.svg" width="40" height="40"/><br><sub><b>Vite</b></sub></a></td>
    <td align="center"><a href="https://www.electronjs.org/"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/electron/electron-original.svg" width="40" height="40"/><br><sub><b>Electron</b></sub></a></td>
    <td align="center"><a href="https://tailwindcss.com/"><img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="40" height="40"/><br><sub><b>Tailwind CSS</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/pmndrs/zustand"><img src="https://raw.githubusercontent.com/pmndrs/zustand/main/docs/bear.jpg" width="40" height="40"/><br><sub><b>Zustand</b></sub></a></td>
    <td align="center"><a href="https://echarts.apache.org/"><img src="https://echarts.apache.org/en/images/favicon.png" width="40" height="40"/><br><sub><b>ECharts</b></sub></a></td>
    <td align="center"><a href="https://recharts.org/"><img src="https://recharts.org/statics/logo.svg" width="40" height="40"/><br><sub><b>Recharts</b></sub></a></td>
    <td align="center"><a href="https://lucide.dev/"><img src="https://lucide.dev/logo.dark.svg" width="40" height="40"/><br><sub><b>Lucide</b></sub></a></td>
    <td align="center"><a href="https://reactrouter.com/"><img src="https://reactrouter.com/favicon-light.png" width="40" height="40"/><br><sub><b>React Router</b></sub></a></td>
  </tr>
</table>

</div>

## 🌟 支持项目

<div align="center">

如果这个项目对你有帮助，请考虑给个 ⭐️ Star 支持一下！

<a href="https://github.com/yourusername/todolist/stargazers">
  <img src="https://img.shields.io/github/stars/yourusername/todolist?style=social" alt="GitHub stars" />
</a>

### 📱 关注我们

<a href="https://twitter.com/yourusername" target="_blank">
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
</a>
<a href="https://github.com/yourusername" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="mailto:your.email@example.com" target="_blank">
  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
</a>

</div>

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/boshi-xixixi">Your Name</a></p>
  <p>© 2024 TodoList. All rights reserved.</p>
</div>