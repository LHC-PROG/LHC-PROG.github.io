window.PROFILE = {
  name: 'LHC-PROG',
  handle: 'LHC-PROG',
  title: 'LHC-PROG · 研究与实践',
  tagline: '中南大学 · 计算机科学与技术 · 大三',
  bio: '具身智能 · 机器学习\n3D 视觉 · 医学影像处理',
  github: 'https://github.com/LHC-PROG',
  research: {
    title: '具身智能 · X-VLA 研究',
    description: '围绕 X-VLA 跨域 Soft Prompt 共享与 VGGT 空间知识注入开展研究，完成六域模型部署与系统评测。',
    domains: ['Google Robot', 'CALVIN', 'LIBERO', 'WidowX', 'RoboTwin2', 'VLABench'],
    findings: [
      { title: '共享基线', text: '简单参数共享（DirectMean）是有竞争力的基线；当前复杂离线蒸馏尚未超越它。' },
      { title: '几何表征', text: 'VGGT 含有超出二维网格的空间结构，但通用几何监督尚未带来稳定的动作收益。' }
    ],
    contributions: [
      { title: '基线复现', text: '完成 X-VLA 六域模型的部署与评测，贯通模型服务、动作转换与结果记录。' },
      { title: '方法设计与实现', text: '设计并实现参数、行为、轨迹三个层面的 Soft Prompt 蒸馏，以及 GI-RGD、GCRP、Spatial Forcing 几何注入方案；用 PyTorch 搭建训练原型，管理实验版本。' },
      { title: '实验调试与诊断', text: '通过梯度分析、模块隔离与参数替换定位训练异常，结合损失、表征相关性与 rollout 行为交叉诊断，保留配置、结果与失效证据。' }
    ]
  },
  skills: [
    { title: '编程语言', tools: 'Python · C/C++ · Java', description: '' },
    { title: '深度学习', tools: 'PyTorch', description: '' },
    { title: '开发环境', tools: 'Linux · Git', description: '' }
  ],
  practice: {
    title: 'MiniCamp',
    label: '黑客松 · 校园协作',
    description: '参与活动统筹、宣传与现场执行，协助对接赞助合作。',
    url: 'https://ttesestt.nanocamp.club/minicamp/'
  }
};
