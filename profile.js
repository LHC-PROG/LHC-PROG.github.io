window.PROFILE = {
  name: 'LHC-PROG',
  handle: 'LHC-PROG',
  title: 'LHC-PROG · 研究与实践',
  tagline: '中南大学 · 计算机科学与技术 · 大三',
  bio: '具身智能 · 机器学习\n3D 视觉 · 医学影像处理',
  github: 'https://github.com/LHC-PROG',
  research: {
    title: '具身智能 · X-VLA 研究',
    description: '围绕 X-VLA 跨域 Soft Prompt 共享与 VGGT 空间知识注入展开研究，在 Google Robot、CALVIN、LIBERO、WidowX、RoboTwin2、VLABench 六个域上完成系统性评测。主要发现：简单参数共享（DirectMean）是极具竞争力的强基线；复杂离线蒸馏未能超越它；VGGT 中存在超出二维网格的空间结构，但通用几何监督尚未建立稳定的动作收益。',
    contributions: [
      { title: '基线复现', text: '完成 X-VLA 六域模型在多个仿真环境上的部署与评测，建立模型服务、动作转换和结果记录链路。' },
      { title: '方法设计与实现', text: '设计并实现 Soft Prompt 蒸馏（参数级、行为级、轨迹级）与 VGGT 几何注入方案（GI-RGD、GCRP、Spatial Forcing），使用 PyTorch 实现训练原型并管理实验版本。' },
      { title: '实验调试与诊断', text: '结合梯度分析、模块隔离与参数替换定位训练异常；建立覆盖损失、表征相关性与 rollout 行为的多层诊断流程；保留完整的配置、结果与失效证据。' }
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
    description: '统筹、宣传与现场执行 · 赞助对接落地',
    url: 'https://ttesestt.nanocamp.club/minicamp/'
  }
};
