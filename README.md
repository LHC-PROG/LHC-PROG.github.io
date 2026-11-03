# Li- 的个人主页

一个现代化、高级且美观的GitHub个人主页，展示你的技能、项目、成就和研究兴趣。

## ✨ 特性

- 🎨 **现代化设计**：采用渐变色、粒子动画和交互式卡片
- 📱 **完全响应式**：适配桌面、平板和移动设备
- ⚡ **流畅动效**：卡片悬停、鼠标追踪、3D粒子球动画
- 🎯 **内容丰富**：
  - Hero区域：大字标题 + 3D粒子球动画
  - 项目展示：展示你的科研项目和成果
  - 技能栈：分类展示你的技术能力
  - 成就荣誉：时间线式展示奖学金和荣誉
  - 研究兴趣：带交互效果的兴趣卡片
  - 活动经历：社团和活动参与经历
- ♿ **无障碍支持**：支持键盘导航和屏幕阅读器
- 🎭 **尊重用户偏好**：支持暂停动效和系统”减少动态效果”设置

## 🚀 快速开始

1. 双击 `index.html` 直接在浏览器中打开
2. 修改 `profile.js` 中的个人信息即可更新所有内容
3. 无需安装任何依赖或构建工具

## 📝 自定义内容

编辑 [profile.js](profile.js) 文件，更新以下信息：

```javascript
window.PROFILE = {
  name: '你的名字',
  handle: '你的GitHub用户名',
  bio: '个人简介',
  subtitle: '副标题',
  tags: ['技能1', '技能2', ...],
  github: 'https://github.com/你的用户名',
  
  skills: [...],      // 技能分类
  projects: [...],    // 项目列表
  achievements: [...], // 成就荣誉
  interests: [...],   // 研究兴趣
  activities: [...]   // 活动经历
};
```

## 📦 部署到 GitHub Pages

1. 创建一个名为 `你的用户名.github.io` 的仓库（或任意仓库）
2. 将以下文件上传到仓库根目录：
   - `index.html`
   - `style.css`
   - `script.js`
   - `profile.js`
   - `favicon.svg`
   - `.nojekyll`
3. 前往仓库 **Settings → Pages**
4. 在 “Source” 中选择 “Deploy from a branch”
5. 选择 `main` 分支和 `/ (root)` 目录
6. 点击 “Save”
7. 等待几分钟，你的个人主页就上线了！

访问地址：`https://你的用户名.github.io/`

## 🎨 设计特色

### 配色方案
- 深色背景 (#0a0e0d)
- 荧光绿主色调 (#a8e63d)
- 青色点缀 (#4ecdc4)
- 优雅的渐变和发光效果

### 交互效果
- **卡片悬停**：鼠标移动时跟随的光晕效果
- **3D粒子球**：可交互的旋转粒子球动画
- **平滑过渡**：所有动画使用缓动函数
- **响应式布局**：自动适配不同屏幕尺寸

### 技术栈
- 纯HTML/CSS/JavaScript
- Google Fonts (Manrope + Noto Sans SC)
- Canvas 2D API (粒子动画)
- CSS Grid + Flexbox
- Intersection Observer (性能优化)
- Resize Observer (响应式)

## 🔧 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器

## 📖 参考与灵感

- 交互设计参考：[Uiverse](https://uiverse.io/elements)、[HTMLrev](https://htmlrev.com)
- 动画效果：独立实现
- 字体：Google Fonts

## 📄 许可证

本项目采用 MIT 许可证，你可以自由使用和修改。

---

**Made with ❤️ by Li- / LHC-PROG**
