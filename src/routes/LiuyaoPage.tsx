import { useState } from "react";
import { HistoryList } from "../components/HistoryList";
import { moduleCopy } from "../data/moduleCopy";
import { LiuyaoForm } from "../features/liuyao/LiuyaoForm";
import { LiuyaoResult } from "../features/liuyao/LiuyaoResult";
import type { LiuyaoInput, LiuyaoResult as LiuyaoResultType } from "../features/liuyao/liuyaoTypes";
import { getMovingLineDetails, getMovingLineSummaryText } from "../features/liuyao/MovingLinesSummary";
import { saveHistoryItem } from "../utils/storage";

export const createLiuyaoHistoryPayload = (input: LiuyaoInput, result: LiuyaoResultType) => {
  const movingDetails = getMovingLineDetails(result.lineStates);

  return {
    ...result,
    inputLines: [...input.lines],
    movingLineCount: movingDetails.length,
    movingPositions: movingDetails.map((detail) => detail.position),
    movingSummary: getMovingLineSummaryText(result.lineStates)
  };
};

export function LiuyaoPage() {
  const [result, setResult] = useState<LiuyaoResultType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResult = (input: LiuyaoInput, nextResult: LiuyaoResultType) => {
    setResult(nextResult);
    saveHistoryItem({
      module: "liuyao",
      title: `${moduleCopy.liuyao.title} ${nextResult.hexagram.name} → ${nextResult.changedHexagram.name}`,
      payload: createLiuyaoHistoryPayload(input, nextResult)
    });
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="page-shell page-shell-grid">
      <div className="page-main-column">
        <div className="page-heading">
          <p className="page-eyebrow">{moduleCopy.liuyao.eyebrow}</p>
          <h1 className="page-title">{moduleCopy.liuyao.title}</h1>
          <p className="page-description">{moduleCopy.liuyao.background}</p>
        </div>
        <LiuyaoForm onResult={handleResult} />
        {result ? <LiuyaoResult result={result} /> : null}
      </div>
      <HistoryList refreshKey={refreshKey} />
    </section>
  );
}
