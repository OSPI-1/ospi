import type { BinaryLine } from "../data/trigrams";

export function LineDiagram({ lines }: { lines: BinaryLine[] }) {
  return (
    <div className="flex w-24 flex-col-reverse gap-1" aria-label="卦象线图">
      {lines.map((line, index) => (
        <div className="flex h-3 gap-2" key={`${line}-${index}`}>
          {line === 1 ? (
            <span className="h-3 w-full rounded-sm bg-[#17211b]" />
          ) : (
            <>
              <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
              <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
