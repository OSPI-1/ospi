import { aboutCopy } from "../data/uiCopy";

export function AboutPage() {
  return (
    <section className="page-shell">
      <p className="page-eyebrow">{aboutCopy.eyebrow}</p>
      <h1 className="page-title mt-2">{aboutCopy.title}</h1>
      <div className="surface-card mt-6 max-w-4xl p-5 sm:p-6">
        <ul className="space-y-3 text-sm leading-7 text-stone-700">
          {aboutCopy.items.map((item) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#2f6f61]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
