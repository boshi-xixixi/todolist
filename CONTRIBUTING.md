# 贡献指南

感谢您对 TodoList 项目的关注！我们欢迎所有形式的贡献，无论是报告 bug、提出新功能建议，还是提交代码改进。

## 🤝 如何贡献

### 报告 Bug

如果您发现了 bug，请通过以下步骤报告：

1. 检查 [Issues](https://github.com/yourusername/todolist/issues) 确保该问题尚未被报告
2. 创建新的 Issue，包含以下信息：
   - 清晰的标题和描述
   - 重现步骤
   - 预期行为和实际行为
   - 环境信息（浏览器、操作系统等）
   - 截图或错误日志（如果适用）

### 提出功能建议

我们欢迎新功能的建议！请：

1. 检查现有的 Issues 和 Pull Requests
2. 创建新的 Feature Request Issue
3. 详细描述功能的用途和实现方式
4. 解释为什么这个功能对项目有价值

### 提交代码

#### 开发环境设置

1. Fork 本仓库
2. 克隆您的 fork：
   ```bash
   git clone https://github.com/yourusername/todolist.git
   cd todolist
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

#### 开发流程

1. 创建新分支：
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

2. 进行开发并确保：
   - 代码符合项目的编码规范
   - 添加必要的测试
   - 更新相关文档

3. 提交更改：
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. 推送到您的 fork：
   ```bash
   git push origin feature/your-feature-name
   ```

5. 创建 Pull Request

## 📝 编码规范

### 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动
- `perf:` 性能优化

示例：
```
feat: add task priority filtering
fix: resolve calendar date selection issue
docs: update installation instructions
```

### 代码风格

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 使用 Prettier 进行代码格式化
- 组件使用函数式组件 + Hooks
- 使用有意义的变量和函数名
- 添加适当的注释，特别是复杂逻辑

### 文件命名

- 组件文件使用 PascalCase：`TaskItem.tsx`
- 工具函数文件使用 camelCase：`utils.ts`
- 常量文件使用 UPPER_SNAKE_CASE：`CONSTANTS.ts`

## 🧪 测试

在提交 PR 之前，请确保：

1. 运行类型检查：
   ```bash
   npm run check
   ```

2. 运行代码检查：
   ```bash
   npm run lint
   ```

3. 构建项目：
   ```bash
   npm run build
   ```

## 📋 Pull Request 指南

### PR 标题

使用清晰、描述性的标题，遵循提交信息规范：
- `feat: add dark mode toggle`
- `fix: resolve memory leak in task store`
- `docs: update README with new features`

### PR 描述

请在 PR 描述中包含：

1. **变更摘要**：简要描述您的更改
2. **相关 Issue**：如果适用，引用相关的 Issue 编号
3. **测试**：描述您如何测试这些更改
4. **截图**：如果是 UI 更改，请提供截图
5. **破坏性更改**：如果有，请明确说明

### PR 模板

```markdown
## 📝 变更摘要
<!-- 简要描述您的更改 -->

## 🔗 相关 Issue
<!-- 如果适用，请引用相关的 Issue -->
Closes #123

## 🧪 测试
<!-- 描述您如何测试这些更改 -->
- [ ] 手动测试
- [ ] 自动化测试
- [ ] 跨浏览器测试

## 📸 截图
<!-- 如果是 UI 更改，请提供截图 -->

## ⚠️ 破坏性更改
<!-- 如果有破坏性更改，请在此说明 -->

## ✅ 检查清单
- [ ] 代码遵循项目的编码规范
- [ ] 自我审查了代码
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试通过
```

## 🎯 开发重点

### 优先级

1. **Bug 修复**：优先处理影响用户体验的 bug
2. **性能优化**：提升应用性能和用户体验
3. **新功能**：添加有价值的新功能
4. **代码质量**：重构和改进代码质量
5. **文档**：完善文档和示例

### 技术债务

我们重视代码质量，欢迎以下类型的贡献：
- 重构复杂的组件
- 改进类型定义
- 优化性能瓶颈
- 增加测试覆盖率
- 改进错误处理

## 🌟 认可贡献者

我们会在以下地方认可您的贡献：
- README.md 中的贡献者列表
- 发布说明中的感谢
- 项目的 Contributors 页面

## 📞 联系我们

如果您有任何问题或需要帮助：

- 创建 [Issue](https://github.com/yourusername/todolist/issues/new)
- 发送邮件至：your.email@example.com
- 在 [Discussions](https://github.com/yourusername/todolist/discussions) 中讨论

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](LICENSE) 下授权。

---

再次感谢您的贡献！🎉