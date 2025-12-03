const STORAGE_PREFIX = "restaurant_billing_";

export const StorageKeys = {
  MENU: `${STORAGE_PREFIX}menu`,
  ORDERS: `${STORAGE_PREFIX}orders`,
};

export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to load ${key}`, error);
    return fallback;
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key}`, error);
  }
}

export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function seedMenu(defaultItems) {
  const existing = loadData(StorageKeys.MENU, null);
  if (!existing || !existing.length) {
    saveData(StorageKeys.MENU, defaultItems);
    return defaultItems;
  }
  return existing;
}

