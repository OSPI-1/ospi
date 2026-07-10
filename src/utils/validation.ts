export const isFiniteInteger = (value: number) => Number.isFinite(value) && Number.isInteger(value);

export const clampText = (value: string, maxLength: number) => value.trim().slice(0, maxLength);
