import { useState } from "react";
import { HistoryList } from "../components/HistoryList";
import { moduleCopy } from "../data/moduleCopy";
import { BaziForm } from "../features/bazi/BaziForm";
import { BaziResult } from "../features/bazi/BaziResult";
import type { BaziInput, BaziResult as BaziResultType } from "../features/bazi/baziTypes";
import { saveHistoryItem } from "../utils/storage";

export const createBaziHistoryPayload = (input: BaziInput, result: BaziResultType) => ({
  ...result,
  mode: "bazi" as const,
  solarDate: input.birthDate,
  birthTime: input.birthTime,
  gender: input.gender ?? null,
  genderAffectsCalculation: false,
  locationCorrection: false,
  trueSolarTime: false
});

export function BaziPage() {
  const [resultState, setResultState] = useState<{ input: BaziInput; result: BaziResultType } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResult = (input: BaziInput, nextResult: BaziResultType) => {
    setResultState({ input, result: nextResult });
    saveHistoryItem({
      module: "bazi",
      title: `${moduleCopy.bazi.title} ${input.birthDate} ${input.birthTime}`,
      payload: createBaziHistoryPayload(input, nextResult)
    });
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="page-shell page-shell-grid">
      <div className="page-main-column">
        <div className="page-heading bazi-page-header">
          <p className="page-eyebrow">{moduleCopy.bazi.eyebrow}</p>
          <h1 className="page-title">从出生时刻出发，观察四柱与五行结构。</h1>
          <p className="page-description">输入公历出生日期与当地民用时间，生成基础四柱和五行分布。</p>
          <p className="bazi-page-boundary">当前不进行出生地点、经度或真太阳时校正。</p>
        </div>
        <BaziForm onResult={handleResult} />
        {resultState ? (
          <>
            <BaziResult input={resultState.input} result={resultState.result} />
          </>
        ) : null}
      </div>
      <HistoryList refreshKey={refreshKey} />
    </section>
  );
}
