import { baziInputCopy } from "../../data/uiCopy";
import type { BaziInput } from "./baziTypes";

const genderLabels: Record<NonNullable<BaziInput["gender"]>, string> = {
  unspecified: baziInputCopy.genderUnspecified,
  female: baziInputCopy.genderFemale,
  male: baziInputCopy.genderMale
};

export function BaziInputSummary({ input }: { input: BaziInput }) {
  const gender = input.gender ?? "unspecified";

  return (
    <section className="bazi-summary" aria-labelledby="bazi-input-summary-title">
      <h2 className="text-lg font-semibold text-stone-950" id="bazi-input-summary-title">
        {baziInputCopy.summaryTitle}
      </h2>
      <dl className="bazi-summary-grid">
        <div className="subtle-card px-3 py-2">
          <dt className="text-xs text-stone-500">{baziInputCopy.summaryDate}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-stone-900">{input.birthDate}</dd>
        </div>
        <div className="subtle-card px-3 py-2">
          <dt className="text-xs text-stone-500">{baziInputCopy.summaryTime}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-stone-900">{input.birthTime}</dd>
        </div>
        <div className="subtle-card px-3 py-2">
          <dt className="text-xs text-stone-500">{baziInputCopy.summaryGender}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-stone-900">
            {genderLabels[gender]}（{baziInputCopy.summaryGenderNotUsed}）
          </dd>
        </div>
        <div className="subtle-card px-3 py-2">
          <dt className="text-xs text-stone-500">{baziInputCopy.summaryLocation}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-stone-900">
            {baziInputCopy.summaryLocationValue}；{baziInputCopy.summarySolarTime}：{baziInputCopy.summarySolarTimeValue}
          </dd>
        </div>
      </dl>
    </section>
  );
}
