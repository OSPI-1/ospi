import type { FiveElement } from "../../data/fiveElements";

export interface BaziInput {
  birthDate: string;
  birthTime: string;
  gender?: "female" | "male" | "unspecified";
}

export interface Pillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface BaziResult {
  pillars: Pillars;
  elementCounts: Record<FiveElement, number>;
  dominantElements: FiveElement[];
  notes: string[];
  assumption: string;
}
