export const homeCopy = {
  eyebrow: "传统文化 · 娱乐参考 · 个人反思",
  title: "玄观",
  description: "一个面向新手的传统术数文化网站，用克制的方式展示八字、六爻、梅花易数的基础结构。",
  sceneItems: [
    { symbol: "☰ 乾", caption: "象 · 数 · 理" },
    { symbol: "☷ 坤", caption: "结构观察" },
    { symbol: "☲ 离", caption: "文化学习" },
    { symbol: "☵ 坎", caption: "个人反思" }
  ]
};

export const moduleCopy = {
  bazi: {
    title: "八字",
    eyebrow: "八字模块",
    subtitle: "从干支和五行分布观察节奏与反思主题。",
    background:
      "八字以出生时间对应的年、月、日、时干支为基础。MVP 只展示基础排盘、五行统计和文化含义，不做命运断语。"
  },
  liuyao: {
    title: "六爻",
    eyebrow: "六爻模块",
    subtitle: "用六条爻组成卦象，观察变化结构。",
    background:
      "六爻以自下而上的六条阴阳爻组成卦象。MVP 支持手动选择六次爻值，也支持浏览器本地三枚硬币模拟，再根据阴阳与动爻生成本卦和变卦，仅供文化学习与娱乐参考。"
  },
  meihua: {
    title: "梅花易数",
    eyebrow: "梅花易数模块",
    subtitle: "用数字或时间起卦，形成上卦、下卦与动爻。",
    background:
      "梅花易数常以数字或时间形成卦象。MVP 支持两个正整数与可选动爻数字，也支持浏览器本地日期时间，作为文化学习、娱乐参考与个人反思的辅助。"
  }
};
