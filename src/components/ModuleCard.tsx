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
      className="module-card focus-ring group surface-card"
      href={href}
    >
      <span className={`module-card-icon mb-5 grid place-items-center ${accent}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="module-card-title block text-xl font-semibold">{title}</span>
      <span className="module-card-description mt-2 block text-sm leading-6">{subtitle}</span>
      <span className="module-card-cta mt-5 block text-sm font-medium">{ctaLabel}</span>
    </a>
  );
}
