// 公开版本：只展示通用能力与经简历核实的个人贡献，不含身份、成绩与具体研究细节。
window.PROFILE = {
  name: 'LHC-PROG',
  handle: 'LHC-PROG',
  title: 'LHC-PROG · 研究与实践',
  tagline: '计算机科学与技术 · 本科生',
  bio: '关注机器学习，习惯在代码与实验中理解方法。\n有模型复现、训练调试和对照评测的实践经验。',
  github: 'https://github.com/LHC-PROG',
  research: {
    title: '机器学习模型实验',
    description: '参与模型方法实现与训练评测，围绕实验中的问题开展分析与验证。',
    contributions: [
      { title: '方法实现', text: '阅读论文并梳理模型流程，使用 PyTorch 实现训练目标与实验原型。' },
      { title: '问题定位', text: '结合梯度检查、模块隔离与参数替换分析训练异常，并验证修复方案。' },
      { title: '对照验证', text: '比较不同实验设置，记录配置、评测结果与失效分析，保留可追溯的实验过程。' }
    ]
  },
  skills: [
    { title: '编程与实现', tools: 'Python · C/C++ · Java', description: '以 Python 为主要实践语言。' },
    { title: '深度学习', tools: 'PyTorch', description: '模型复现、训练调试与实验分析。' },
    { title: '实验环境', tools: 'Linux · Git', description: '环境配置、版本管理与对照实验。' }
  ],
  practice: {
    title: 'MiniCamp',
    label: '黑客松 · 协作实践',
    description: '参与活动筹备、宣传与现场执行，协助推进赞助合作，让想法在团队协作中落地。',
    url: 'https://ttesestt.nanocamp.club/minicamp/'
  }
};
