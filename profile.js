// 个人信息已脱敏处理
window.PROFILE = {
  name: 'LHC-PROG',
  handle: 'LHC-PROG',
  title: 'LHC-PROG',
  tagline: '计算机科学与技术 · 中南大学',
  rank: '专业排名前2%',
  gpa: 'GPA 92+/100',
  interests_tag: 'Machine Learning · Computer Vision · Open Source',

  bio: '关注机器学习与深度学习方向。过去一年围绕具身智能开展研究，完成跨域VLA模型、Soft Prompt蒸馏与三维几何表征等工作，积累了PyTorch模型复现、训练评测及实验分析经验。现阶段性科研工作已结束，期待探索新的研究课题。',

  contact: {
    github: 'https://github.com/LHC-PROG',
    email: 'contact@example.com' // 可选
  },

  research: [
    {
      title: '面向多域统一的视觉-语言-动作模型研究',
      subtitle: 'Vision-Language-Action Model for Multi-Domain Unification',
      period: '2026.01 — 2026.09',
      role: '核心参与者',
      status: '已完成',
      description: '针对多机器人跨域迁移问题，基于X-VLA构建六域Soft Prompt蒸馏流程，冻结模型主干，构建Prompt参数级、动作级和轨迹级蒸馏流程，实现共享Prompt的独立保存、模型注入和版本对照；引入VGGT三维视觉表征，探索GI-RGD几何关系监督和GCRP动态Prompt方法。',
      achievements: [
        '完成X-VLA与VGGT基线复现，参与Soft Prompt蒸馏、几何教师信号和动态Prompt方案的设计与代码实现',
        '负责模型训练、checkpoint管理、数据划分、实验评测和结果分析',
        '在CALVIN、LIBERO、RoboTwin2、VLABench等多个任务环境中开展对照实验',
        '建立覆盖训练损失、表征相关性、梯度传递和rollout行为的多层诊断流程',
        '实现可独立注入和回滚的多域共享Prompt流程，项目内部六域评测达到443/600（原始配置436/600）'
      ],
      tags: ['X-VLA', 'VGGT', 'Soft Prompt', 'Multi-Domain', 'Geometric Reasoning']
    },
    {
      title: '25年暑期科研训练',
      subtitle: 'Summer Research Training in Embodied Intelligence',
      period: '2025.07 — 2025.08',
      role: '科研训练成员',
      status: '已完成',
      description: '进入中南大学具身智能课题组，线下围绕机器人视觉感知与具身智能模型开展科研训练，初步接触学习机器学习、深度学习等基础知识，初步了解具身智能研究中的模型复现与实机数据采集流程。',
      achievements: [
        '使用Python和PyTorch参与相关论文及模型的复现工作',
        '协助完成实验环境配置、代码运行、结果记录与问题排查',
        '参与机器人具身智能数据采集工作'
      ],
      tags: ['Embodied AI', 'Robot Vision', 'PyTorch', 'Model Replication']
    }
  ],

  skills: {
    '编程技能': ['Python', 'C/C++', 'Java', 'PyTorch'],
    '研究方向': ['机器学习', '深度学习', '计算机视觉'],
    '技术栈': ['Vision-Language-Action', 'Model Distillation', '3D Geometric Reasoning', 'Multi-modal Learning']
  },

  achievements: [
    { year: '2025', title: '校级企业奖学金', category: 'Scholarship' },
    { year: '2025', title: '优秀学生', category: 'Honor' },
    { year: '2025', title: '二等奖学金', category: 'Scholarship' }
  ],

  activities: [
    {
      role: '会长',
      organization: '中南大学创客空间',
      period: '2026.05 — 至今',
      description: '负责600+人学生社群的运营与团队协作，面向成员提供课程学习、竞赛实践、科研入门和升学规划等交流服务。组织保研经验分享会与干事选拔活动，搭建成员与学长学姐之间的交流渠道，促进学习资源共享与成员个人成长。'
    },
    {
      role: '统筹与执行成员',
      organization: 'MiniCamp 2026 校园黑客松',
      period: '2026.09 — 2026.10',
      website: 'https://ttesestt.nanocamp.club/minicamp/',
      description: '参与MiniCamp 2026校园黑客松及作品展的活动统筹、宣传招募与现场执行。负责对接赛百味赞助事宜，协助推进合作落地。'
    }
  ]
};
