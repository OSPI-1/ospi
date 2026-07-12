import { CalendarDays, RotateCcw } from "lucide-react";
import { useState } from "react";
import { baziInputCopy } from "../../data/uiCopy";
import { calculateBazi } from "./baziEngine";
import type { BaziInput, BaziResult } from "./baziTypes";

export const BAZI_MIN_DATE = "1900-01-01";
export const BAZI_MAX_DATE = "2100-12-31";

export const createDefaultBaziInput = (): BaziInput => ({
  birthDate: "",
  birthTime: "",
  gender: "unspecified"
});

export class BaziInputError extends Error {
  constructor(
    message: string,
    public readonly field: "birthDate" | "birthTime" | "form"
  ) {
    super(message);
    this.name = "BaziInputError";
  }
}

const isValidGregorianDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    Number.isFinite(year) &&
    Number.isFinite(month) &&
    Number.isFinite(day) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isValidCivilTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hour, minute] = value.split(":").map(Number);
  return Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

export const validateBaziInput = (input: BaziInput): BaziInput => {
  if (!input.birthDate) {
    throw new BaziInputError(baziInputCopy.errors.dateRequired, "birthDate");
  }
  if (!isValidGregorianDate(input.birthDate)) {
    throw new BaziInputError(baziInputCopy.errors.dateFormat, "birthDate");
  }
  if (input.birthDate < BAZI_MIN_DATE || input.birthDate > BAZI_MAX_DATE) {
    throw new BaziInputError(baziInputCopy.errors.dateRange, "birthDate");
  }
  if (!input.birthTime) {
    throw new BaziInputError(baziInputCopy.errors.timeRequired, "birthTime");
  }
  if (!isValidCivilTime(input.birthTime)) {
    throw new BaziInputError(baziInputCopy.errors.timeFormat, "birthTime");
  }

  return { ...input, gender: input.gender ?? "unspecified" };
};

export const createBaziFormSubmission = (
  input: BaziInput,
  calculator: (nextInput: BaziInput) => BaziResult = calculateBazi
) => {
  const validatedInput = validateBaziInput(input);
  return { input: validatedInput, result: calculator(validatedInput) };
};

export function BaziForm({ onResult }: { onResult: (input: BaziInput, result: BaziResult) => void }) {
  const [input, setInput] = useState<BaziInput>(() => createDefaultBaziInput());
  const [error, setError] = useState<{ field: BaziInputError["field"]; message: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const submission = createBaziFormSubmission(input);
      setError(null);
      onResult(submission.input, submission.result);
    } catch (err) {
      if (err instanceof BaziInputError) {
        setError({ field: err.field, message: err.message });
      } else {
        setError({ field: "form", message: err instanceof Error ? err.message : baziInputCopy.fallbackError });
      }
    }
  };

  const updateInput = (next: Partial<BaziInput>) => {
    setInput((value) => ({ ...value, ...next }));
    setError(null);
  };

  return (
    <form
      className="surface-card bazi-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="bazi-form-heading">
        <CalendarDays className="h-5 w-5 text-[#b23526]" aria-hidden="true" />
        <h2 className="text-lg font-semibold">{baziInputCopy.formTitle}</h2>
      </div>

      <p className="bazi-form-helper">公历日期与当地民用时间用于基础计算；完整假设将在结果后说明。</p>
      <div className="bazi-form-grid">
        <label className="text-sm font-medium text-stone-700" htmlFor="bazi-birth-date">
          {baziInputCopy.dateLabel}
          <input
            aria-describedby={error?.field === "birthDate" ? "bazi-input-error" : undefined}
            aria-invalid={error?.field === "birthDate"}
            className="focus-ring field-control"
            id="bazi-birth-date"
            max={BAZI_MAX_DATE}
            min={BAZI_MIN_DATE}
            onChange={(event) => updateInput({ birthDate: event.target.value })}
            type="date"
            value={input.birthDate}
          />
        </label>
        <label className="text-sm font-medium text-stone-700" htmlFor="bazi-birth-time">
          {baziInputCopy.timeLabel}
          <input
            aria-describedby={error?.field === "birthTime" ? "bazi-input-error" : undefined}
            aria-invalid={error?.field === "birthTime"}
            className="focus-ring field-control"
            id="bazi-birth-time"
            onChange={(event) => updateInput({ birthTime: event.target.value })}
            type="time"
            value={input.birthTime}
          />
        </label>
      </div>

      <label className="bazi-gender-field" htmlFor="bazi-gender">
        {baziInputCopy.genderLabel}
        <select
          className="focus-ring field-control"
          id="bazi-gender"
          onChange={(event) => updateInput({ gender: event.target.value as BaziInput["gender"] })}
          value={input.gender}
        >
          <option value="unspecified">{baziInputCopy.genderUnspecified}</option>
          <option value="female">{baziInputCopy.genderFemale}</option>
          <option value="male">{baziInputCopy.genderMale}</option>
        </select>
        <span className="mt-1 block text-xs font-normal text-stone-500">{baziInputCopy.genderNote}</span>
      </label>

      <p className="bazi-form-privacy">{baziInputCopy.privacyNote}</p>

      {error ? (
        <p aria-live="assertive" className="error-message" id="bazi-input-error" role="alert">
          {error.message}
        </p>
      ) : null}

      <div className="bazi-form-actions">
        <button className="focus-ring primary-button" type="submit">
          {baziInputCopy.submitButton}
        </button>
        <button
          className="focus-ring secondary-button"
          onClick={() => {
            setInput(createDefaultBaziInput());
            setError(null);
          }}
          type="button"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {baziInputCopy.resetButton}
        </button>
      </div>
    </form>
  );
}
