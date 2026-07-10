import { Clock3 } from "lucide-react";
import { meihuaFormCopy } from "../../data/uiCopy";
import type { MeihuaInput } from "./meihuaTypes";

export interface TimeDivinationState {
  date: string;
  time: string;
}

export const createEmptyTimeDivinationState = (): TimeDivinationState => ({ date: "", time: "" });

const pad2 = (value: number) => String(value).padStart(2, "0");

export const createTimeDivinationStateFromDate = (date: Date): TimeDivinationState => {
  if (Number.isNaN(date.getTime())) {
    throw new Error(meihuaFormCopy.errors.invalidDateTime);
  }
  return {
    date: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`,
    time: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  };
};

export const parseLocalDateTime = (state: TimeDivinationState) => {
  if (!state.date) {
    throw new Error(meihuaFormCopy.errors.dateRequired);
  }
  if (!state.time) {
    throw new Error(meihuaFormCopy.errors.timeRequired);
  }

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(state.date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(state.time);
  if (!dateMatch || !timeMatch) {
    throw new Error(meihuaFormCopy.errors.invalidDateTime);
  }

  const [, yearText, monthText, dayText] = dateMatch;
  const [, hourText, minuteText] = timeMatch;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const result = new Date(0);
  result.setFullYear(year, month - 1, day);
  result.setHours(hour, minute, 0, 0);

  if (
    Number.isNaN(result.getTime()) ||
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day ||
    result.getHours() !== hour ||
    result.getMinutes() !== minute
  ) {
    throw new Error(meihuaFormCopy.errors.invalidDateTime);
  }
  return result;
};

export const buildTimeMeihuaInput = (state: TimeDivinationState): MeihuaInput => ({
  mode: "time",
  when: parseLocalDateTime(state)
});

export const resolveBrowserTimeZone = (resolver: () => string | undefined = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  try {
    return resolver() || meihuaFormCopy.time.timeZoneFallback;
  } catch {
    return meihuaFormCopy.time.timeZoneFallback;
  }
};

export const getSelectedTimeLabel = (state: TimeDivinationState) => {
  if (!state.date || !state.time) {
    return meihuaFormCopy.time.emptyPreview;
  }
  try {
    const parsed = parseLocalDateTime(state);
    return `${createTimeDivinationStateFromDate(parsed).date} ${createTimeDivinationStateFromDate(parsed).time}`;
  } catch {
    return meihuaFormCopy.errors.invalidDateTime;
  }
};

export function TimeDivinationForm({
  state,
  timeZone,
  currentTimeFilled,
  onChange,
  onUseCurrentTime
}: {
  state: TimeDivinationState;
  timeZone: string;
  currentTimeFilled: boolean;
  onChange: (state: TimeDivinationState) => void;
  onUseCurrentTime: () => void;
}) {
  const copy = meihuaFormCopy.time;

  return (
    <section
      aria-labelledby="meihua-time-title"
      className="space-y-4"
      id="meihua-panel-time"
      role="tabpanel"
      tabIndex={0}
    >
      <div className="subtle-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-950" id="meihua-time-title">
              {copy.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{copy.rule}</p>
          </div>
          <button
            className="focus-ring secondary-button shrink-0 px-4"
            onClick={onUseCurrentTime}
            type="button"
          >
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {copy.useCurrentButton}
          </button>
        </div>
        {currentTimeFilled ? (
          <p className="mt-3 text-sm text-[#28735a]" role="status">
            {copy.currentTimeFilled}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="meihua-date">
          日期
          <input
            className="focus-ring field-control"
            id="meihua-date"
            onChange={(event) => onChange({ ...state, date: event.target.value })}
            type="date"
            value={state.date}
          />
        </label>
        <label className="text-sm font-medium text-stone-700" htmlFor="meihua-time">
          时间
          <input
            className="focus-ring field-control"
            id="meihua-time"
            onChange={(event) => onChange({ ...state, time: event.target.value })}
            step={60}
            type="time"
            value={state.time}
          />
        </label>
      </div>
      <div className="subtle-card p-3 text-sm leading-6 text-stone-600">
        <p>
          <span className="font-medium text-stone-900">{copy.selectedTimeLabel}：</span>
          {getSelectedTimeLabel(state)}
        </p>
        <p>
          <span className="font-medium text-stone-900">{copy.timeZoneLabel}：</span>
          {timeZone}
        </p>
      </div>
      <p className="text-xs leading-5 text-stone-500">{copy.privacy}</p>
    </section>
  );
}
