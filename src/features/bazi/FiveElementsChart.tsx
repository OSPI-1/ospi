import { fiveElementsById, type FiveElement, type FiveElementInfo } from "../../data/fiveElements";
import { resultCopy } from "../../data/uiCopy";

export interface FiveElementDisplayData {
  info: FiveElementInfo;
  count: number;
  percentage: number;
}

export const getFiveElementDisplayData = (elementCounts: Record<FiveElement, number>): FiveElementDisplayData[] => {
  const displayElements = resultCopy.bazi.elementOrder.map((id) => fiveElementsById[id]);
  const total = displayElements.reduce((sum, element) => {
    const count = elementCounts[element.id];
    return sum + (Number.isFinite(count) && count >= 0 ? count : 0);
  }, 0);

  return displayElements.map((info) => {
    const rawCount = elementCounts[info.id];
    const count = Number.isFinite(rawCount) && rawCount >= 0 ? rawCount : 0;
    return {
      info,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    };
  });
};

export function FiveElementsChart({
  elementCounts,
  dominantElements
}: {
  elementCounts: Record<FiveElement, number>;
  dominantElements: FiveElement[];
}) {
  const copy = resultCopy.bazi;
  const items = getFiveElementDisplayData(elementCounts);
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const validDominantElements = dominantElements.filter((element) => items.some((item) => item.info.id === element));

  return (
    <section aria-labelledby="bazi-elements-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-950" id="bazi-elements-title">
            {copy.elementsLabel}
          </h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{copy.elementCountDescription}</p>
        </div>
        <p className="shrink-0 text-sm font-medium text-stone-700">
          {copy.totalLabel}：{total}
        </p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <article className="subtle-card p-3" key={item.info.id}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-stone-900">{item.info.name}</span>
              <span className="font-semibold text-stone-950">{item.count}</span>
            </div>
            <div
              aria-label={`${item.info.name}${copy.elementsLabel}`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={item.percentage}
              className="mt-2 h-2 rounded-full bg-stone-100"
              role="progressbar"
            >
              <div className="h-2 rounded-full bg-[#2f6f61]" style={{ width: `${item.percentage}%` }} />
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-500">{item.info.meaning}</p>
          </article>
        ))}
      </div>

      <p className="mt-3 text-sm leading-6 text-stone-600">
        {copy.dominantDescription}{" "}
        {validDominantElements.length > 0 ? validDominantElements.join("、") : copy.noDominantText}
      </p>
    </section>
  );
}
