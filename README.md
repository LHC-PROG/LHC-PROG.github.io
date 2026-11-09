# LHC-PROG · 学术与项目主页

白底蓝色链接、固定个人简介栏与连续正文。包含关于我、研究实践、开源项目、实践经历、教育与课程。项目描述保留实际贡献边界，不列虚构论文、奖项或导师。示意图为概念图，不代表实验结果或软件截图。

个人内容在 profile.js 配置。index.html 保留基本静态介绍，content.js 填入项目说明、技术关键词与课程成绩，并处理主题切换、目录定位和旧链接跳转。使用系统正文字体与本地英文字体，无 WebGL 或远程脚本依赖。支持深浅主题、手机阅读、减少动态效果和打印。

本地预览：node preview.cjs --no-browser，打开 http://127.0.0.1:8770/。

2026-11-09 重构前的森林版已完整保存至同级独立项目目录：独立项目/林间漫游-原版存档-20261109/source（旁有 source.zip），对应提交 108ffb649b9a5d10fa7b5bf04bb957e95396a2fe。该版本为后续独立作品保留。当前仓库的场景源文件和素材亦予以保留，主页不加载它们。

设计参考结构： https://dwenhui.com/ 与 https://kiyotakali.github.io/ 。实现及个人文案独立编写。

GitHub Pages 使用 .github/workflows/pages.yml 发布。GitHub Profile 的入口继续指向主页根地址。
