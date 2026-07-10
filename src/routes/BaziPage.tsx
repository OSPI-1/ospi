import { useState } from "react";
import { HistoryList } from "../components/HistoryList";
import { moduleCopy } from "../data/moduleCopy";
import { BaziAssumptionNotice } from "../features/bazi/BaziAssumptionNotice";
import { BaziForm } from "../features/bazi/BaziForm";
import { BaziInputSummary } from "../features/bazi/BaziInputSummary";
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
        <div className="page-heading">
          <p className="page-eyebrow">{moduleCopy.bazi.eyebrow}</p>
          <h1 className="page-title">{moduleCopy.bazi.title}</h1>
          <p className="page-description">{moduleCopy.bazi.background}</p>
        </div>
        <BaziForm onResult={handleResult} />
        {resultState ? (
          <>
            <BaziInputSummary input={resultState.input} />
            <BaziAssumptionNotice />
            <BaziResult result={resultState.result} />
          </>
        ) : null}
      </div>
      <HistoryList refreshKey={refreshKey} />
    </section>
  );
}
