import type { LucideIcon } from "lucide-react";
import { moduleCardCopy } from "../data/uiCopy";

export function ModuleCard({
  href,
  icon: Icon,
  title,
  subtitle,
  accent,
  ctaLabel = moduleCardCopy.ctaLabel
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
  ctaLabel?: string;
}) {
  return (
    <a
      className="focus-ring group surface-card min-h-48 p-5 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
      href={href}
    >
      <span className={`mb-5 grid h-12 w-12 place-items-center rounded-lg ${accent}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="block text-xl font-semibold text-stone-950">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-stone-600">{subtitle}</span>
      <span className="mt-5 block text-sm font-medium text-[#b23526]">{ctaLabel}</span>
    </a>
  );
}
