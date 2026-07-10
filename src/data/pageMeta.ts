export type PageMeta = {
  title: string;
  description: string;
};

export const pageMeta: Record<"home" | "bazi" | "liuyao" | "meihua" | "about" | "not-found", PageMeta> = {
  home: { title: "玄览｜传统术数文化工具", description: "传统术数文化学习、娱乐参考与个人反思工具，包含八字、六爻和梅花易数模块。" },
  bazi: { title: "八字｜玄览", description: "了解八字四柱与五行分布的基础文化信息，用于传统文化学习和个人反思。" },
  liuyao: { title: "六爻｜玄览", description: "通过手动或本地三枚硬币模拟了解六爻卦象结构，用于传统文化学习和娱乐参考。" },
  meihua: { title: "梅花易数｜玄览", description: "通过数字或浏览器本地时间了解梅花易数的基础卦象结构，用于传统文化学习和个人反思。" },
  about: { title: "说明与边界｜玄览", description: "了解玄览的传统文化定位、使用边界、隐私方式和结果免责声明。" },
  "not-found": { title: "页面未找到｜玄览", description: "当前页面不存在，请返回玄览首页或选择一个可用模块。" }
};
