import { Solar } from "lunar-typescript";
import { elementCopy, emptyElementCounts, type FiveElement } from "../../data/fiveElements";
import {
  branchElements as branchElementsFromGanzhi,
  stemElements as stemElementsFromGanzhi,
  type EarthlyBranch,
  type HeavenlyStem
} from "../../data/ganzhi";
import type { BaziInput, BaziResult, Pillars } from "./baziTypes";

const splitPillar = (pillar: string) => {
  if (pillar.length < 2) {
    throw new Error(`干支格式异常：${pillar}`);
  }
  return [pillar[0], pillar[1]] as const;
};

const getStemElement = (stem: string): FiveElement => {
  const element = stemElementsFromGanzhi[stem as HeavenlyStem];
  if (!element) {
    throw new Error(`未知天干五行：${stem}`);
  }
  return element;
};

const getBranchElement = (branch: string): FiveElement => {
  const element = branchElementsFromGanzhi[branch as EarthlyBranch];
  if (!element) {
    throw new Error(`未知地支五行：${branch}`);
  }
  return element;
};

export const countPillarElements = (pillars: Pillars) => {
  const counts = emptyElementCounts();
  Object.values(pillars).forEach((pillar) => {
    const [stem, branch] = splitPillar(pillar);
    counts[getStemElement(stem)] += 1;
    counts[getBranchElement(branch)] += 1;
  });
  return counts;
};

export const calculateBazi = (input: BaziInput): BaziResult => {
  if (!input.birthDate || !input.birthTime) {
    throw new Error("请输入完整的公历出生日期和时间。");
  }

  const [year, month, day] = input.birthDate.split("-").map(Number);
  const [hour, minute] = input.birthTime.split(":").map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const eightChar = solar.getLunar().getEightChar();
  const pillars: Pillars = {
    year: eightChar.getYear(),
    month: eightChar.getMonth(),
    day: eightChar.getDay(),
    hour: eightChar.getTime()
  };

  const elementCounts = countPillarElements(pillars);
  const highest = Math.max(...Object.values(elementCounts));
  const dominantElements = Object.entries(elementCounts)
    .filter(([, count]) => count === highest)
    .map(([element]) => element as FiveElement);

  return {
    pillars,
    elementCounts,
    dominantElements,
    notes: dominantElements.map((element) => elementCopy[element]),
    assumption:
      "按用户输入的公历时间和当前浏览器环境计算，未处理出生地真太阳时差异；结果用于文化学习和结构观察。"
  };
};
