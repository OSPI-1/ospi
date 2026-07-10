import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { meihuaFormCopy } from "../../data/uiCopy";
import { calculateMeihua } from "./meihuaEngine";
import { MeihuaModeSelector } from "./MeihuaModeSelector";
import {
  buildNumberMeihuaInput,
  createDefaultNumberDivinationState,
  NumberDivinationForm,
  type NumberDivinationState
} from "./NumberDivinationForm";
import {
  buildTimeMeihuaInput,
  createEmptyTimeDivinationState,
  createTimeDivinationStateFromDate,
  resolveBrowserTimeZone,
  TimeDivinationForm,
  type TimeDivinationState
} from "./TimeDivinationForm";
import type { MeihuaInput, MeihuaMode, MeihuaResult } from "./meihuaTypes";

export const createMeihuaFormSubmission = (
  mode: MeihuaMode,
  numberState: NumberDivinationState,
  timeState: TimeDivinationState,
  calculator: (input: MeihuaInput) => MeihuaResult = calculateMeihua
) => {
  const input = mode === "number" ? buildNumberMeihuaInput(numberState) : buildTimeMeihuaInput(timeState);
  return { input, result: calculator(input) };
};

export function MeihuaForm({
  onResult,
  nowProvider = () => new Date()
}: {
  onResult: (input: MeihuaInput, result: MeihuaResult) => void;
  nowProvider?: () => Date;
}) {
  const [mode, setMode] = useState<MeihuaMode>("number");
  const [numberState, setNumberState] = useState<NumberDivinationState>(() => createDefaultNumberDivinationState());
  const [timeState, setTimeState] = useState<TimeDivinationState>(() => createEmptyTimeDivinationState());
  const [timeZone] = useState(() => resolveBrowserTimeZone());
  const [currentTimeFilled, setCurrentTimeFilled] = useState(false);
  const [error, setError] = useState("");

  const handleModeChange = (nextMode: MeihuaMode) => {
    setMode(nextMode);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const submission = createMeihuaFormSubmission(mode, numberState, timeState);
      setError("");
      onResult(submission.input, submission.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : meihuaFormCopy.fallbackError);
    }
  };

  const handleReset = () => {
    if (mode === "number") {
      setNumberState(createDefaultNumberDivinationState());
    } else {
      setTimeState(createEmptyTimeDivinationState());
      setCurrentTimeFilled(false);
    }
    setError("");
  };

  const handleUseCurrentTime = () => {
    setTimeState(createTimeDivinationStateFromDate(nowProvider()));
    setCurrentTimeFilled(true);
    setError("");
  };

  return (
    <form
      className="surface-card space-y-5 p-5 sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="text-lg font-semibold text-stone-950">{meihuaFormCopy.title}</h2>
      <MeihuaModeSelector mode={mode} onChange={handleModeChange} />
      {mode === "number" ? (
        <NumberDivinationForm onChange={setNumberState} state={numberState} />
      ) : (
        <TimeDivinationForm
          currentTimeFilled={currentTimeFilled}
          onChange={(state) => {
            setTimeState(state);
            setCurrentTimeFilled(false);
          }}
          onUseCurrentTime={handleUseCurrentTime}
          state={timeState}
          timeZone={timeZone}
        />
      )}
      {error ? (
        <p aria-live="assertive" className="error-message" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button className="focus-ring primary-button" type="submit">
          {meihuaFormCopy.submitButton}
        </button>
        <button
          className="focus-ring secondary-button"
          onClick={handleReset}
          type="button"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {meihuaFormCopy.resetButton}
        </button>
      </div>
    </form>
  );
}
