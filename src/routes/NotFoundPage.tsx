import { routeA11yCopy } from "../data/routeA11yCopy";

const recoveryLinks = [
  { href: "#/", label: "返回首页" },
  { href: "#/bazi", label: "八字" },
  { href: "#/liuyao", label: "六爻" },
  { href: "#/meihua", label: "梅花易数" }
];

export function NotFoundPage({ path }: { path: string }) {
  return (
    <section className="page-shell sm:py-12">
      <div className="surface-card max-w-2xl p-5 sm:p-8">
        <p className="text-sm font-medium text-[#b23526]">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">{routeA11yCopy.notFoundTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{routeA11yCopy.notFoundDescription}</p>
        <p className="mt-4 break-all text-sm text-stone-500">
          {routeA11yCopy.notFoundPathLabel}: <code>{path}</code>
        </p>
        <nav className="mt-6 flex flex-wrap gap-3" aria-label={routeA11yCopy.notFoundNavigationLabel}>
          {recoveryLinks.map((link) => (
            <a className="focus-ring inline-flex min-h-11 items-center rounded-lg border border-stone-300 px-4 text-sm font-medium text-stone-800 hover:bg-stone-100" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
