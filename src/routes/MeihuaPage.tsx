import { useState } from "react";
import { HistoryList } from "../components/HistoryList";
import { moduleCopy } from "../data/moduleCopy";
import { resultCopy } from "../data/uiCopy";
import { MeihuaForm } from "../features/meihua/MeihuaForm";
import { formatMeihuaLocalDateTime } from "../features/meihua/MeihuaInputSummary";
import { MeihuaResult } from "../features/meihua/MeihuaResult";
import { resolveBrowserTimeZone } from "../features/meihua/TimeDivinationForm";
import type { MeihuaInput, MeihuaResult as MeihuaResultType } from "../features/meihua/meihuaTypes";
import { saveHistoryItem } from "../utils/storage";

export const createMeihuaHistoryPayload = (
  input: MeihuaInput,
  result: MeihuaResultType,
  timeZone: string
) => {
  const common = {
    ...result,
    mode: input.mode,
    originalHexagramName: result.hexagram.name,
    mutualHexagramName: result.mutualHexagram.name,
    changedHexagramName: result.changedHexagram.name,
    movingLine: result.movingLine,
    originalLines: [...result.originalLines],
    changedLines: [...result.changedLines]
  };

  if (input.mode === "number") {
    return {
      ...common,
      mode: "number" as const,
      firstNumber: input.firstNumber ?? null,
      secondNumber: input.secondNumber ?? null,
      movingNumber: input.movingNumber ?? null,
      movingNumberSource: input.movingNumber === undefined ? "sum-of-first-two" : "provided"
    };
  }

  if (!input.when || Number.isNaN(input.when.getTime())) {
    throw new Error(resultCopy.meihua.unavailableTime);
  }

  return {
    ...common,
    mode: "time" as const,
    usedDateTime: input.when.toISOString(),
    timeZone,
    localTimeLabel: formatMeihuaLocalDateTime(input.when)
  };
};

export function MeihuaPage() {
  const [resultState, setResultState] = useState<{
    result: MeihuaResultType;
    input: MeihuaInput;
    timeZone: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResult = (input: MeihuaInput, nextResult: MeihuaResultType) => {
    const timeZone = resolveBrowserTimeZone();
    setResultState({ input, result: nextResult, timeZone });
    saveHistoryItem({
      module: "meihua",
      title: `${moduleCopy.meihua.title} ${nextResult.hexagram.name} → ${nextResult.changedHexagram.name}`,
      payload: createMeihuaHistoryPayload(input, nextResult, timeZone)
    });
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="page-shell page-shell-grid">
      <div className="page-main-column">
        <div className="page-heading">
          <p className="page-eyebrow">{moduleCopy.meihua.eyebrow}</p>
          <h1 className="page-title">{moduleCopy.meihua.title}</h1>
          <p className="page-description">{moduleCopy.meihua.background}</p>
        </div>
        <MeihuaForm onResult={handleResult} />
        {resultState ? (
          <MeihuaResult input={resultState.input} result={resultState.result} timeZone={resultState.timeZone} />
        ) : null}
      </div>
      <HistoryList refreshKey={refreshKey} />
    </section>
  );
}
