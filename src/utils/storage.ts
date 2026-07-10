export interface HistoryItem<T = unknown> {
  id: string;
  module: "bazi" | "liuyao" | "meihua";
  title: string;
  createdAt: string;
  payload: T;
}

const STORAGE_KEY = "traditional-arts-history";
const MAX_ITEMS = 10;

const safeParse = (value: string | null): HistoryItem[] => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadHistory = () => safeParse(window.localStorage.getItem(STORAGE_KEY));

export const saveHistoryItem = (item: Omit<HistoryItem, "id" | "createdAt">) => {
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  const items = [next, ...loadHistory()].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
};

export const clearHistory = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
