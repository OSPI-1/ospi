import { meihuaFormCopy, resultCopy } from "../../data/uiCopy";
import { pad2 } from "../../utils/date";
import type { MeihuaInput } from "./meihuaTypes";

export interface MeihuaInputSummaryData {
  modeLabel: string;
  items: Array<{ label: string; value: string }>;
  note?: string;
}

export const formatMeihuaLocalDateTime = (date: Date) => {
  if (Number.isNaN(date.getTime())) {
    return resultCopy.meihua.unavailableTime;
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(
    date.getMinutes()
  )}`;
};

export const getMeihuaInputSummary = (input: MeihuaInput, timeZone: string): MeihuaInputSummaryData => {
  const copy = resultCopy.meihua;

  if (input.mode === "number") {
    return {
      modeLabel: meihuaFormCopy.modes.number,
      items: [
        { label: copy.firstNumberLabel, value: String(input.firstNumber ?? "") },
        { label: copy.secondNumberLabel, value: String(input.secondNumber ?? "") },
        {
          label: copy.movingNumberLabel,
          value: input.movingNumber === undefined ? copy.movingNumberFromSum : String(input.movingNumber)
        }
      ]
    };
  }

  return {
    modeLabel: meihuaFormCopy.modes.time,
    items: [
      {
        label: copy.usedDateTimeLabel,
        value: input.when ? formatMeihuaLocalDateTime(input.when) : copy.unavailableTime
      },
      { label: copy.timeZoneLabel, value: timeZone }
    ],
    note: copy.localTimeNote
  };
};

export function MeihuaInputSummary({ input, timeZone }: { input: MeihuaInput; timeZone: string }) {
  const copy = resultCopy.meihua;
  const summary = getMeihuaInputSummary(input, timeZone);

  return (
    <section aria-labelledby="meihua-input-summary" className="border-b border-stone-200 pb-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-950" id="meihua-input-summary">
          {copy.inputSummaryTitle}
        </h3>
        <p className="text-sm font-medium text-[#b23526]">
          {copy.modeLabel}：{summary.modeLabel}
        </p>
      </div>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summary.items.map((item) => (
          <div className="min-w-0 bg-stone-50 px-3 py-2" key={item.label}>
            <dt className="text-xs text-stone-500">{item.label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-stone-900">{item.value}</dd>
          </div>
        ))}
      </dl>
      {summary.note ? <p className="mt-3 text-sm leading-6 text-stone-600">{summary.note}</p> : null}
    </section>
  );
}
