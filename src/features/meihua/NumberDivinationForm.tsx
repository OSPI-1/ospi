import { meihuaFormCopy } from "../../data/uiCopy";
import type { MeihuaInput } from "./meihuaTypes";

export const MEIHUA_NUMBER_MAX = 999999;

export interface NumberDivinationState {
  firstNumber: string;
  secondNumber: string;
  movingNumber: string;
}

export const createDefaultNumberDivinationState = (): NumberDivinationState => ({
  firstNumber: "12",
  secondNumber: "34",
  movingNumber: ""
});

const parsePositiveInteger = (rawValue: string, field: string, requiredMessage: string) => {
  const value = rawValue.trim();
  if (!value) {
    throw new Error(requiredMessage);
  }
  if (!/^\d+$/.test(value)) {
    throw new Error(meihuaFormCopy.errors.positiveInteger.replace("{field}", field));
  }

  const parsed = Number(value);
  if (parsed <= 0) {
    throw new Error(meihuaFormCopy.errors.greaterThanZero.replace("{field}", field));
  }
  if (parsed > MEIHUA_NUMBER_MAX) {
    throw new Error(meihuaFormCopy.errors.maxValue.replace("{field}", field));
  }
  return parsed;
};

export const buildNumberMeihuaInput = (state: NumberDivinationState): MeihuaInput => {
  const firstNumber = parsePositiveInteger(state.firstNumber, "第一个数字", meihuaFormCopy.errors.firstRequired);
  const secondNumber = parsePositiveInteger(state.secondNumber, "第二个数字", meihuaFormCopy.errors.secondRequired);
  const movingNumber = state.movingNumber.trim()
    ? parsePositiveInteger(state.movingNumber, "动爻数字", meihuaFormCopy.errors.positiveInteger.replace("{field}", "动爻数字"))
    : undefined;

  return { mode: "number", firstNumber, secondNumber, movingNumber };
};

export function NumberDivinationForm({
  state,
  onChange
}: {
  state: NumberDivinationState;
  onChange: (state: NumberDivinationState) => void;
}) {
  const copy = meihuaFormCopy.number;
  const update = (key: keyof NumberDivinationState, value: string) => onChange({ ...state, [key]: value });

  return (
    <section
      aria-labelledby="meihua-number-title"
      className="space-y-4"
      id="meihua-panel-number"
      role="tabpanel"
      tabIndex={0}
    >
      <div className="subtle-card p-4">
        <h3 className="text-base font-semibold text-stone-950" id="meihua-number-title">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.rule}</p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{copy.movingFallback}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-stone-700" htmlFor="meihua-first-number">
          第一个数字
          <input
            aria-describedby="meihua-number-privacy"
            className="focus-ring field-control"
            id="meihua-first-number"
            inputMode="numeric"
            max={MEIHUA_NUMBER_MAX}
            min={1}
            onChange={(event) => update("firstNumber", event.target.value)}
            step={1}
            type="number"
            value={state.firstNumber}
          />
        </label>
        <label className="text-sm font-medium text-stone-700" htmlFor="meihua-second-number">
          第二个数字
          <input
            aria-describedby="meihua-number-privacy"
            className="focus-ring field-control"
            id="meihua-second-number"
            inputMode="numeric"
            max={MEIHUA_NUMBER_MAX}
            min={1}
            onChange={(event) => update("secondNumber", event.target.value)}
            step={1}
            type="number"
            value={state.secondNumber}
          />
        </label>
        <label className="text-sm font-medium text-stone-700" htmlFor="meihua-moving-number">
          动爻数字（可选）
          <input
            aria-describedby="meihua-moving-help meihua-number-privacy"
            className="focus-ring field-control"
            id="meihua-moving-number"
            inputMode="numeric"
            max={MEIHUA_NUMBER_MAX}
            min={1}
            onChange={(event) => update("movingNumber", event.target.value)}
            placeholder={copy.movingPlaceholder}
            step={1}
            type="number"
            value={state.movingNumber}
          />
        </label>
      </div>
      <p className="text-sm leading-6 text-stone-600" id="meihua-moving-help">
        {copy.movingFallback}
      </p>
      <p className="text-xs leading-5 text-stone-500" id="meihua-number-privacy">
        {copy.privacy}
      </p>
    </section>
  );
}
