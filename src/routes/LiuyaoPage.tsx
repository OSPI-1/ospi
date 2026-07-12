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
        <div className="page-heading liuyao-page-header">
          <p className="page-eyebrow">{moduleCopy.liuyao.eyebrow}</p>
          <h1 className="page-title">从六次爻值出发，观察卦象与变化。</h1>
          <p className="page-description">可以手动选择六爻，也可以使用三枚硬币模拟生成。</p>
          <p className="liuyao-page-order">输入顺序从初爻开始，依次到上爻。</p>
        </div>
        <LiuyaoForm onResult={handleResult} />
        {result ? <LiuyaoResult result={result} /> : null}
      </div>
      <HistoryList refreshKey={refreshKey} />
    </section>
  );
}
