export const homeCopy = {
  eyebrow: "传统文化 · 娱乐参考 · 个人反思",
  title: "玄览",
  headline: ["观传统之象，", "照当下之心。"],
  description: "以八字、六爻与梅花易数为入口，清晰地观察传统文化中的时间、结构与变化。",
  boundary: "仅供文化学习、娱乐参考与个人反思。",
  actions: { explore: "开始探索", about: "了解玄览" },
  modules: {
    eyebrow: "三种观察入口",
    title: "从结构开始，而非从结论开始。",
    description: "选择一个适合当下的入口，查看输入、推演过程与结果结构。",
    details: {
      bazi: "输入出生日期与时刻，查看四柱与五行分布",
      liuyao: "输入六爻数值或模拟三枚钱币，查看本卦、变卦与动爻",
      meihua: "输入数字或本地时间，查看本卦、互卦、变卦与动爻",
    },
  },
  principles: [
    { title: "记录只在本地", description: "你的历史记录只保存在当前浏览器，不上传，也不用于画像。" },
    { title: "过程清晰可见", description: "呈现输入、结构与推演依据，让每一步都可回看。" },
    { title: "保留使用边界", description: "不提供医疗、法律、投资、婚恋或职业等现实决策建议。" },
  ],
  expression: {
    eyebrow: "玄览所见",
    title: "传统文化不必被神秘化，也可以被清晰地观察。",
    description: "以克制的界面承载复杂的文化结构，留出理解、判断与反思的空间。",
  },
  closing: { text: "在开始之前，先了解玄览的使用方式与边界。", action: "查看使用边界" },
};

export const moduleCopy = {
  bazi: {
    title: "八字",
    eyebrow: "八字模块",
    subtitle: "从干支和五行分布观察节奏与反思主题。",
    background:
      "八字以出生时间对应的年、月、日、时干支为基础。MVP 只展示基础排盘、五行统计和文化含义，不做命运断语。",
  },
  liuyao: {
    title: "六爻",
    eyebrow: "六爻模块",
    subtitle: "用六条爻组成卦象，观察变化结构。",
    background:
      "六爻以自下而上的六条阴阳爻组成卦象。MVP 支持手动选择六次爻值，也支持浏览器本地三枚硬币模拟，再根据阴阳与动爻生成本卦和变卦，仅供文化学习与娱乐参考。",
  },
  meihua: {
    title: "梅花易数",
    eyebrow: "梅花易数模块",
    subtitle: "用数字或时间起卦，形成上卦、下卦与动爻。",
    background:
      "梅花易数常以数字或时间形成卦象。MVP 支持两个正整数与可选动爻数字，也支持浏览器本地日期时间，作为文化学习、娱乐参考与个人反思的辅助。",
  },
};
