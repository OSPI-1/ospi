import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PRIVACY_NOTE } from "../data/disclaimers";
import { fiveElementsById } from "../data/fiveElements";
import { historyCopy, linePositionLabels, liuyaoFormCopy, resultCopy } from "../data/uiCopy";
import { toDateTimeLabel } from "../utils/date";
import { clearHistory, type HistoryItem, loadHistory } from "../utils/storage";

interface LiuyaoHistoryDetails {
  originalName: string;
  changedName: string;
  movingSummary: string;
  inputLines: number[];
}

export interface MeihuaHistoryDetails {
  mode: "number" | "time" | null;
  originalName: string;
  mutualName: string;
  changedName: string;
  movingLine: number | null;
  inputSummary: string;
  timeZone: string;
  originalLines: number[];
  changedLines: number[];
}

export interface BaziHistoryDetails {
  solarDate: string;
  birthTime: string;
  gender: string;
  pillars: string;
  elementSummary: string;
  locationCorrection: string;
  trueSolarTime: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readHexagramName = (value: unknown) => {
  if (!isRecord(value)) {
    return "";
  }
  return typeof value.name === "string" ? value.name : "";
};

const readString = (value: unknown) => (typeof value === "string" ? value : "");

const readLineNumber = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6 ? value : null;

const readBinaryLines = (value: unknown) =>
  Array.isArray(value) ? value.filter((line): line is number => line === 0 || line === 1) : [];

const readFiniteNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

const baziPillarKeys = [
  ["year", resultCopy.bazi.pillarLabels.year],
  ["month", resultCopy.bazi.pillarLabels.month],
  ["day", resultCopy.bazi.pillarLabels.day],
  ["hour", resultCopy.bazi.pillarLabels.hour]
] as const;

export const getLiuyaoHistoryDetails = (item: HistoryItem): LiuyaoHistoryDetails | null => {
  if (item.module !== "liuyao" || !isRecord(item.payload)) {
    return null;
  }

  const originalName = readHexagramName(item.payload.hexagram);
  const changedName = readHexagramName(item.payload.changedHexagram);
  if (!originalName || !changedName) {
    return null;
  }

  const movingIndexes = Array.isArray(item.payload.movingIndexes)
    ? item.payload.movingIndexes.filter(
        (value): value is number => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 6
      )
    : [];
  const savedSummary = typeof item.payload.movingSummary === "string" ? item.payload.movingSummary : "";
  const movingSummary =
    savedSummary ||
    (movingIndexes.length > 0
      ? `${movingIndexes.length} 条：${movingIndexes
          .map((index) => liuyaoFormCopy.positionLabels[index - 1])
          .join("、")}`
      : resultCopy.liuyao.noMovingLines);
  const inputLines = Array.isArray(item.payload.inputLines)
    ? item.payload.inputLines.filter(
        (value): value is number => value === 6 || value === 7 || value === 8 || value === 9
      )
    : [];

  return { originalName, changedName, movingSummary, inputLines };
};

export const getMeihuaHistoryDetails = (item: HistoryItem): MeihuaHistoryDetails | null => {
  if (item.module !== "meihua" || !isRecord(item.payload)) {
    return null;
  }

  const payload = item.payload;
  const originalName = readString(payload.originalHexagramName) || readHexagramName(payload.hexagram);
  const mutualName = readString(payload.mutualHexagramName) || readHexagramName(payload.mutualHexagram);
  const changedName = readString(payload.changedHexagramName) || readHexagramName(payload.changedHexagram);
  if (!originalName || !mutualName || !changedName) {
    return null;
  }

  const mode = payload.mode === "number" || payload.mode === "time" ? payload.mode : null;
  let inputSummary = historyCopy.meihua.legacyInputFallback;
  let timeZone = "";

  if (mode === "number") {
    const firstNumber = typeof payload.firstNumber === "number" && Number.isFinite(payload.firstNumber)
      ? payload.firstNumber
      : null;
    const secondNumber = typeof payload.secondNumber === "number" && Number.isFinite(payload.secondNumber)
      ? payload.secondNumber
      : null;
    if (firstNumber !== null && secondNumber !== null) {
      const movingNumber = typeof payload.movingNumber === "number" && Number.isFinite(payload.movingNumber)
        ? String(payload.movingNumber)
        : resultCopy.meihua.movingNumberFromSum;
      inputSummary = `${firstNumber}、${secondNumber}；${resultCopy.meihua.movingNumberLabel}：${movingNumber}`;
    }
  }

  if (mode === "time") {
    const localTimeLabel = readString(payload.localTimeLabel);
    const usedDateTime = readString(payload.usedDateTime);
    const parsedTime = usedDateTime ? new Date(usedDateTime) : null;
    inputSummary = localTimeLabel || (parsedTime && !Number.isNaN(parsedTime.getTime())
      ? toDateTimeLabel(usedDateTime)
      : historyCopy.meihua.legacyInputFallback);
    timeZone = readString(payload.timeZone);
  }

  return {
    mode,
    originalName,
    mutualName,
    changedName,
    movingLine: readLineNumber(payload.movingLine),
    inputSummary,
    timeZone,
    originalLines: readBinaryLines(payload.originalLines),
    changedLines: readBinaryLines(payload.changedLines)
  };
};

export const getBaziHistoryDetails = (item: HistoryItem): BaziHistoryDetails | null => {
  if (item.module !== "bazi" || !isRecord(item.payload)) {
    return null;
  }

  const payload = item.payload;
  const pillarsRecord = isRecord(payload.pillars) ? payload.pillars : null;
  const pillarValues = baziPillarKeys.map(([key]) => readString(pillarsRecord?.[key]));
  const pillars = pillarValues.every(Boolean)
    ? baziPillarKeys.map(([, label], index) => `${label}${pillarValues[index]}`).join(" · ")
    : historyCopy.bazi.historyLegacyInput;

  const countRecord = isRecord(payload.elementCounts) ? payload.elementCounts : null;
  const elementParts = resultCopy.bazi.elementOrder.map((id) => {
    const element = fiveElementsById[id];
    const count = readFiniteNumber(countRecord?.[element.id]);
    return count === null ? null : `${element.name}${count}`;
  });
  const elementSummary = elementParts.every(Boolean)
    ? elementParts.join("、")
    : historyCopy.bazi.historyNoElements;

  const gender = payload.gender === "female" || payload.gender === "male" ? payload.gender : historyCopy.bazi.historyLegacyGender;
  const genderLabel = gender === "female" ? "女" : gender === "male" ? "男" : gender;
  const solarDate = readString(payload.solarDate) || historyCopy.bazi.historyLegacyInput;
  const birthTime = readString(payload.birthTime);

  return {
    solarDate,
    birthTime,
    gender: genderLabel,
    pillars,
    elementSummary,
    locationCorrection: payload.locationCorrection === true
      ? historyCopy.bazi.historyPerformed
      : historyCopy.bazi.historyNotPerformed,
    trueSolarTime: payload.trueSolarTime === true ? historyCopy.bazi.historyUsed : historyCopy.bazi.historyNotUsed
  };
};

export function HistoryList({ refreshKey = 0 }: { refreshKey?: number }) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, [refreshKey]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  return (
    <aside className="surface-card min-w-0 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">{historyCopy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            {PRIVACY_NOTE} {historyCopy.clearDataNote}
          </p>
        </div>
        <button
          className="focus-ring icon-button shrink-0"
          onClick={handleClear}
          title={historyCopy.clearButtonTitle}
          type="button"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-stone-500">{historyCopy.emptyState}</p>
        ) : (
          items.map((item) => {
            const liuyaoDetails = getLiuyaoHistoryDetails(item);
            const meihuaDetails = getMeihuaHistoryDetails(item);
            const baziDetails = getBaziHistoryDetails(item);
            const title = typeof item.title === "string" ? item.title : historyCopy.title;
            const createdAt = typeof item.createdAt === "string" ? item.createdAt : "";

            return (
              <div className="min-w-0 rounded-lg border border-stone-100 bg-stone-50 p-3" key={item.id}>
                <p className="break-words text-sm font-medium text-stone-900">{title}</p>
                <p className="mt-1 text-xs text-stone-500">{toDateTimeLabel(createdAt)}</p>
                {liuyaoDetails ? (
                  <div className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
                    <p className="break-words">
                      {historyCopy.liuyao.originalLabel}：{liuyaoDetails.originalName} · {historyCopy.liuyao.changedLabel}：
                      {liuyaoDetails.changedName}
                    </p>
                    <p className="break-words">
                      {historyCopy.liuyao.movingLabel}：{liuyaoDetails.movingSummary}
                    </p>
                    {liuyaoDetails.inputLines.length === 6 ? (
                      <p className="break-words">
                        {historyCopy.liuyao.lineValuesLabel}：{liuyaoDetails.inputLines.join("、")}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {meihuaDetails ? (
                  <div className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
                    <p className="break-words">
                      {historyCopy.meihua.modeLabel}：
                      {meihuaDetails.mode === "number"
                        ? historyCopy.meihua.numberMode
                        : meihuaDetails.mode === "time"
                          ? historyCopy.meihua.timeMode
                          : historyCopy.meihua.legacyInputFallback}
                    </p>
                    <p className="break-words">
                      {historyCopy.meihua.originalLabel}：{meihuaDetails.originalName} · {historyCopy.meihua.mutualLabel}：
                      {meihuaDetails.mutualName} · {historyCopy.meihua.changedLabel}：{meihuaDetails.changedName}
                    </p>
                    {meihuaDetails.movingLine ? (
                      <p className="break-words">
                        {historyCopy.meihua.movingLabel}：{linePositionLabels[meihuaDetails.movingLine - 1]}
                      </p>
                    ) : null}
                    <p className="break-words">
                      {meihuaDetails.mode === "time"
                        ? historyCopy.meihua.timeInputLabel
                        : historyCopy.meihua.numberInputLabel}
                      ：{meihuaDetails.inputSummary}
                    </p>
                    {meihuaDetails.timeZone ? (
                      <p className="break-words">
                        {historyCopy.meihua.timeZoneLabel}：{meihuaDetails.timeZone}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {baziDetails ? (
                  <div className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
                    <p className="break-words">
                      {historyCopy.bazi.historyDateTimeLabel}：{baziDetails.solarDate}
                      {baziDetails.birthTime ? ` ${baziDetails.birthTime}` : ""}
                    </p>
                    <p className="break-words">
                      {historyCopy.bazi.historyGenderLabel}：{baziDetails.gender}
                    </p>
                    <p className="break-words">
                      {historyCopy.bazi.historyPillarsLabel}：{baziDetails.pillars}
                    </p>
                    <p className="break-words">
                      {historyCopy.bazi.historyElementsLabel}：{baziDetails.elementSummary}
                    </p>
                    <p className="break-words">
                      {historyCopy.bazi.historyLocationLabel}：{baziDetails.locationCorrection} · {historyCopy.bazi.historySolarTimeLabel}：
                      {baziDetails.trueSolarTime}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
