export const profile = {
  name: "黄炎辉",
  age: 26,
  headline: "在 AI 数据训练与供应链业务之间，把模糊需求拆解为可执行的规则、数据与验收标准。",
  education: [
    {
      period: "2018.09 — 2022.07",
      school: "广东工业大学",
      degree: "电气工程及其自动化 · 本科",
      place: "自动化学院",
    },
    {
      period: "2022.09 — 2024.05",
      school: "西交利物浦大学",
      degree: "运营与供应链管理 · 硕士",
      place: "商学院",
    },
  ],
  work: [
    {
      period: "2025.09 — 至今",
      company: "广州市汇富物业咨询服务有限公司",
      role: "AI 训练师",
      summary:
        "负责 AI 数据生产规则、外部标注供应商管理，以及多模态、SFT、Agent、模型评测与自动化工作流相关工作。",
      highlights: [
        "把模糊业务需求拆解为任务目标、输入输出、标签体系、判定边界、正反例与验收标准。",
        "负责外部标注供应商的准入、培训、排期、交付、抽检、错误归因与 Bad Case 回流。",
        "参与 AI 电商商品素材生产与 AI 销售助手需求挖掘两个项目的数据建设和评测。",
      ],
      tags: ["AI 数据训练", "多模态", "SFT", "Agent", "供应商管理"],
    },
    {
      period: "2024.01 — 2025.09",
      company: "名创优品（广东）供应链管理服务有限公司",
      role: "管培生",
      summary:
        "结合供应链业务经验参与快消智能补货 Agent 训练，并负责供应商绩效线上化这一传统供应链数字化项目。",
      highlights: [
        "围绕库存预警、补货判断、跨市场调拨和促销备货，参与 Agent、RAG、领域 SFT 与数据质检。",
        "梳理补货业务规则、系统工具字段与判断口径，让模型回答能够关联业务依据与建议动作。",
        "代表供应部参与供应商绩效指标、自动评估、预警和动态看板建设。",
      ],
      tags: ["智能补货", "RAG", "领域 SFT", "供应链数字化"],
    },
  ],
  mainProjects: [
    {
      company: "名创优品",
      title: "快消智能补货 Agent",
      type: "AI 项目 · 面试主项目",
      summary:
        "面向进销存数据分散、补货判断需要跨表查询的问题，训练能够结合业务规则和系统数据完成库存分析与补货建议的 Agent。",
      focus: ["RAG 规则知识库", "Agent 工具调用训练", "补货领域 SFT", "训练数据质检"],
    },
    {
      company: "汇富物业",
      title: "AI 销售助手需求挖掘",
      type: "AI 项目 · 面试主项目",
      summary:
        "面向销售长对话复盘与客户需求识别，训练模型按统一口径提取需求信号，并输出可追溯的结构化判断结果。",
      focus: ["销售对话 SFT 数据", "需求挖掘规则", "Dify 自动预标注", "Python 质检校验"],
    },
    {
      company: "汇富物业",
      title: "AI 电商商品素材生产",
      type: "AI 项目 · 面试主项目",
      summary:
        "面向跨境服装商品素材的批量生产，围绕换装模型和生产 Agent 建设训练、评测与交付链路。",
      focus: ["电商图片素材训练数据构建", "生图模型评测", "Agent 工具调用训练", "供应商管理"],
    },
  ],
  supplyChainProject: {
    company: "名创优品",
    title: "供应商绩效线上化",
    type: "传统供应链数字化项目",
    summary:
      "把原本依赖线下核算的供应商绩效管理迁移到线上，统一接单率、准交率等指标口径，并连接自动评估、预警、看板与整改闭环。",
    focus: ["绩效指标逻辑", "自动评估与预警", "动态追踪看板", "供应商分级与整改"],
  },
  tools: ["Python", "Dify", "Excel", "Power BI", "帆软 BI", "Codex", "VS Code"],
  languages: ["英语 · IELTS 6.5", "粤语"],
  interests: [
    {
      title: "特调咖啡",
      note: "在风味的层次里辨认细微变化，也享受一杯咖啡从配方到入口的完整过程。",
      image: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/coffee-notes-upright.jpg`,
      imageAlt: "桌面上的三杯特调咖啡",
    },
    {
      title: "听歌与现场",
      note: "歌单是日常的留白，现场则让声音、灯光与人群在同一刻汇成回响。",
      image: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/live-music-notes-web.jpg`,
      imageAlt: "多场演唱会现场照片拼图",
    },
  ],
} as const;
