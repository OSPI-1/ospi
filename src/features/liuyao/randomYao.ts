import type { YaoValue } from "./liuyaoTypes";

export type RandomSource = () => number;

export interface CryptoRandomProvider {
  getRandomValues(values: Uint32Array): Uint32Array;
}

const UINT32_RANGE = 0x1_0000_0000;

const fallbackRandomSource: RandomSource = () => Math.random();

const assertRandomFraction = (value: number) => {
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error("Random source must return a number from 0 (inclusive) to 1 (exclusive).");
  }
  return value;
};

export const createBrowserRandomSource = (
  cryptoProvider: CryptoRandomProvider | null | undefined =
    typeof globalThis.crypto === "undefined" ? undefined : globalThis.crypto,
  fallback: RandomSource = fallbackRandomSource
): RandomSource => {
  if (cryptoProvider?.getRandomValues) {
    return () => {
      const values = new Uint32Array(1);
      cryptoProvider.getRandomValues(values);
      return values[0] / UINT32_RANGE;
    };
  }

  return () => assertRandomFraction(fallback());
};

export const coinTotalToYaoValue = (total: number): YaoValue => {
  if (total === 6 || total === 7 || total === 8 || total === 9) {
    return total;
  }
  throw new Error(`Invalid three-coin total: ${total}`);
};

const simulateCoinValue = (randomSource: RandomSource): 2 | 3 =>
  assertRandomFraction(randomSource()) >= 0.5 ? 3 : 2;

export const simulateYaoValue = (randomSource: RandomSource): YaoValue => {
  const total = simulateCoinValue(randomSource) + simulateCoinValue(randomSource) + simulateCoinValue(randomSource);
  return coinTotalToYaoValue(total);
};

export const generateSixYaoValues = (
  randomSource: RandomSource = createBrowserRandomSource()
): YaoValue[] => Array.from({ length: 6 }, () => simulateYaoValue(randomSource));
