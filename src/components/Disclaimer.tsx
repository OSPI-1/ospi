import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { RESULT_DISCLAIMER } from "../data/disclaimers";

export type DisclaimerVariant = "default" | "compact" | "result";

const variantClassNames: Record<DisclaimerVariant, string> = {
  default: "rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950",
  compact: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950",
  result: "rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
};

export function Disclaimer({ variant = "default" }: { variant?: DisclaimerVariant }) {
  const [hasResultDisclaimer, setHasResultDisclaimer] = useState(false);
  const iconSize = variant === "compact" ? "h-4 w-4" : "h-5 w-5";
  const isDefaultHidden = variant === "default" && hasResultDisclaimer;

  useEffect(() => {
    if (variant !== "default") {
      return undefined;
    }

    const updateVisibility = () => {
      setHasResultDisclaimer(document.querySelector(".result-disclaimer") !== null);
    };

    updateVisibility();
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [variant]);

  return (
    <section
      className={`${variantClassNames[variant]} ${variant === "result" ? "result-disclaimer" : "site-disclaimer"} ${
        isDefaultHidden ? "hidden" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={`mt-0.5 flex-none ${iconSize}`} aria-hidden="true" />
        <p>{RESULT_DISCLAIMER}</p>
      </div>
    </section>
  );
}
