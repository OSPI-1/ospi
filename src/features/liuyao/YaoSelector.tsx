import { liuyaoFormCopy } from "../../data/uiCopy";
import type { YaoValue } from "./liuyaoTypes";
import { YaoLinePreview } from "./YaoLinePreview";

export interface YaoOption {
  value: YaoValue;
  name: string;
  isYang: boolean;
  isMoving: boolean;
  yinYangLabel: string;
  movementLabel: string;
  description: string;
}

export const YAO_OPTIONS: YaoOption[] = [
  {
    value: 6,
    name: liuyaoFormCopy.valueOptions[6].name,
    isYang: false,
    isMoving: true,
    yinYangLabel: liuyaoFormCopy.yinLabel,
    movementLabel: liuyaoFormCopy.movingLabel,
    description: liuyaoFormCopy.valueOptions[6].description
  },
  {
    value: 7,
    name: liuyaoFormCopy.valueOptions[7].name,
    isYang: true,
    isMoving: false,
    yinYangLabel: liuyaoFormCopy.yangLabel,
    movementLabel: liuyaoFormCopy.stableLabel,
    description: liuyaoFormCopy.valueOptions[7].description
  },
  {
    value: 8,
    name: liuyaoFormCopy.valueOptions[8].name,
    isYang: false,
    isMoving: false,
    yinYangLabel: liuyaoFormCopy.yinLabel,
    movementLabel: liuyaoFormCopy.stableLabel,
    description: liuyaoFormCopy.valueOptions[8].description
  },
  {
    value: 9,
    name: liuyaoFormCopy.valueOptions[9].name,
    isYang: true,
    isMoving: true,
    yinYangLabel: liuyaoFormCopy.yangLabel,
    movementLabel: liuyaoFormCopy.movingLabel,
    description: liuyaoFormCopy.valueOptions[9].description
  }
];

export const getYaoOption = (value: YaoValue) => {
  const option = YAO_OPTIONS.find((item) => item.value === value);
  if (!option) {
    throw new Error(`Unknown yao value: ${value}`);
  }
  return option;
};

export function YaoSelector({
  index,
  label,
  value,
  onChange
}: {
  index: number;
  label: string;
  value: YaoValue;
  onChange: (value: YaoValue) => void;
}) {
  const selectedOption = getYaoOption(value);

  return (
    <fieldset
      className="rounded-lg border border-stone-200 bg-stone-50 p-4"
      data-yao-index={index}
      data-yao-position={label}
    >
      <legend className="px-1 text-sm font-semibold text-stone-900">{label}</legend>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <YaoLinePreview isMoving={selectedOption.isMoving} isYang={selectedOption.isYang} />
        <p className="text-sm text-stone-600">
          {selectedOption.name} · {selectedOption.yinYangLabel} · {selectedOption.movementLabel}
        </p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label={`${label}选择`}>
        {YAO_OPTIONS.map((option) => {
          const checked = option.value === value;
          return (
            <button
              aria-checked={checked}
              aria-label={`${label} ${option.name} ${option.value}，${option.description}`}
              className={`focus-ring flex min-h-16 cursor-pointer flex-col justify-between rounded-lg border p-3 text-left text-sm transition ${
                checked
                  ? "border-[#b23526] bg-[#f8ebdf] text-stone-950"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onChange(option.value);
                }
              }}
              role="radio"
              type="button"
            >
              <span className="flex items-center justify-between gap-2 font-medium">
                <span>
                  {option.name} {option.value}
                </span>
                {option.isMoving ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#b23526]">{liuyaoFormCopy.movingHint}</span>
                ) : null}
              </span>
              <span className="mt-1 text-xs leading-5 text-stone-600">{option.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
