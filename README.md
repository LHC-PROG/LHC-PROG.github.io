# LHC-PROG 个人主页

面向学术交流的静态个人主页，包含研究实践、技术能力和 MiniCamp 活动入口。保留浅深主题、交互动效、移动端布局与打印样式。

双击 `index.html` 可预览，编辑 `profile.js` 可修改内容。无构建依赖。

视觉参考：[Linear](https://linear.app/)、[Vercel](https://vercel.com/) 与 [Brittany Chiang](https://brittanychiang.com/)。采用冷白与雾蓝配色、无边框球形网络和胶囊按钮，图形与代码独立实现。装饰动画入场后自动停止，指针交互时响应；遵循系统减少动态效果偏好，进入原生标注模式时冻结画面。

内容依据个人简历提炼，研究部分突出通用方法与个人贡献，不公开学校、成绩排名、联系方式、研究项目名称和具体实验数据。MiniCamp 链接由本人提供；未将活动网站的开发归功于本人。

GitHub Pages 部署文件：`index.html`、`style.css`、`script.js`、`annotations.js`、`profile.js`、`favicon.svg`、`assets/`、`.nojekyll`。公开前同时检查 HTML 的默认文案与搜索摘要，避免仅修改配置后留下旧信息。

页面标注：在支持该功能的应用内浏览器打开 `https://lhc-prog.github.io/?edit=1`。编辑入口通过 `document.oai.annotation` 调用应用原生标注；未提供该接口的浏览器会显示说明。普通访问不显示编辑入口。不要通过本地 `file://` 文件预览来验证原生标注。网页无法自行启用应用尚未提供的功能。

研究区采用简介、六域标签、三项贡献和主要发现的分层布局。两个界面共享原创环带艺术图像；素材来源和完整生成提示词见 [assets/ARTWORK.md](assets/ARTWORK.md)。
