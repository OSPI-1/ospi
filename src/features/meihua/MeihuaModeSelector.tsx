import { Hash, Timer } from "lucide-react";
import { meihuaFormCopy } from "../../data/uiCopy";
import type { MeihuaMode } from "./meihuaTypes";

const modes: MeihuaMode[] = ["number", "time"];

export function MeihuaModeSelector({ mode, onChange }: { mode: MeihuaMode; onChange: (mode: MeihuaMode) => void }) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentMode: MeihuaMode) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = modes.indexOf(currentMode);
    const nextMode =
      event.key === "Home"
        ? modes[0]
        : event.key === "End"
          ? modes[modes.length - 1]
          : modes[(currentIndex + (event.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length];
    onChange(nextMode);
    const nextButton = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#meihua-tab-${nextMode}`);
    nextButton?.focus();
  };

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-stone-100 p-1" aria-label={meihuaFormCopy.title} role="tablist">
      {modes.map((item) => {
        const selected = mode === item;
        const Icon = item === "number" ? Hash : Timer;

        return (
          <button
            aria-controls={`meihua-panel-${item}`}
            aria-selected={selected}
            className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium ${
              selected ? "bg-white text-stone-950 shadow-sm" : "text-stone-600 hover:bg-white/70"
            }`}
            id={`meihua-tab-${item}`}
            key={item}
            onClick={() => onChange(item)}
            onKeyDown={(event) => handleKeyDown(event, item)}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {meihuaFormCopy.modes[item]}
          </button>
        );
      })}
    </div>
  );
}
