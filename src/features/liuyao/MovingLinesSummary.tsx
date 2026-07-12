import { liuyaoFormCopy, resultCopy } from "../../data/uiCopy";
import type { LiuyaoLineState } from "./liuyaoTypes";

export interface MovingLineDetail {
  index: number;
  position: string;
  value: 6 | 9;
  changeText: string;
}

export const getMovingLineDetails = (lineStates: readonly LiuyaoLineState[]): MovingLineDetail[] =>
  lineStates.flatMap((state, index) => {
    if (!state.moving || (state.value !== 6 && state.value !== 9)) {
      return [];
    }

    return [
      {
        index: index + 1,
        position: liuyaoFormCopy.positionLabels[index],
        value: state.value,
        changeText: state.value === 6 ? resultCopy.liuyao.oldYinChange : resultCopy.liuyao.oldYangChange
      }
    ];
  });

export const getMovingLineSummaryText = (lineStates: readonly LiuyaoLineState[]) => {
  const details = getMovingLineDetails(lineStates);
  if (details.length === 0) {
    return resultCopy.liuyao.noMovingLines;
  }
  return `${details.length} 条：${details.map((detail) => detail.position).join("、")}`;
};

export function MovingLinesSummary({ lineStates }: { lineStates: readonly LiuyaoLineState[] }) {
  const copy = resultCopy.liuyao;
  const details = getMovingLineDetails(lineStates);

  return (
    <section className="liuyao-change-flow surface-card p-4">
      <h3 className="liuyao-change-flow-title text-base font-semibold text-stone-950">{copy.movingLinesLabel}</h3>
      {details.length === 0 ? (
        <div className="mt-2 text-sm leading-6 text-stone-600">
          <p>{copy.noMovingLines}</p>
          <p>{copy.noMovingExplanation}</p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
            <p>{copy.movingCountText.replace("{count}", String(details.length))}</p>
            <p>{copy.movingPositionsText.replace("{positions}", details.map((detail) => detail.position).join("、"))}</p>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {details.map((detail) => (
              <li className="subtle-card px-3 py-2 text-sm text-stone-700" key={detail.index}>
                <span className="font-medium text-stone-950">{detail.position}</span>
                <span className="ml-2">{detail.changeText}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
