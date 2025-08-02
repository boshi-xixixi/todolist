<div align="center">

# 📝 TodoList - 现代化任务管理应用

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-4.x-FF6B6B?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/yourusername/todolist?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/yourusername/todolist?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/yourusername/todolist?style=for-the-badge" alt="Forks" />
  <img src="https://img.shields.io/github/issues/yourusername/todolist?style=for-the-badge" alt="Issues" />
</p>

<p align="center">
  一个现代化的待办事项管理应用，基于 React + TypeScript + Vite 构建<br>
  提供直观的任务管理和数据统计功能，让您的工作更加高效有序
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

- 🚀 **现代化技术栈**：React 18 + TypeScript + Vite，开发体验极佳
- 📊 **数据可视化**：集成 ECharts，提供丰富的统计图表
- 🎨 **精美UI设计**：基于 Tailwind CSS，响应式设计适配各种设备
- ⚡ **高性能**：使用 Zustand 轻量级状态管理，性能优化到位
- 💾 **数据持久化**：本地存储，数据不丢失
- 🔍 **智能筛选**：多维度任务筛选，快速找到目标任务

## 📸 应用预览

<div align="center">
  <img src="./docs/images/preview-main.png" alt="主界面预览" width="800" />
  <p><em>主界面 - 任务管理与统计一览</em></p>
</div>

<div align="center">
  <img src="./docs/images/preview-stats.png" alt="统计页面预览" width="800" />
  <p><em>统计分析 - 数据可视化展示</em></p>
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

```bash
# 启动开发服务器
npm run dev

# 🌐 访问 http://localhost:5173
```

### 🏗️ 构建部署

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
    <td align="center"><a href="https://tailwindcss.com/"><img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="40" height="40"/><br><sub><b>Tailwind CSS</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/pmndrs/zustand"><img src="https://raw.githubusercontent.com/pmndrs/zustand/main/docs/bear.jpg" width="40" height="40"/><br><sub><b>Zustand</b></sub></a></td>
    <td align="center"><a href="https://echarts.apache.org/"><img src="https://echarts.apache.org/en/images/favicon.png" width="40" height="40"/><br><sub><b>ECharts</b></sub></a></td>
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
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
  <p>© 2024 TodoList. All rights reserved.</p>
</div>