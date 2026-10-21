
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const CACHE = {
  get<T>(key: string, ttl: number): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > ttl;
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (err) {
      console.error(`Erro ao ler cache (${key}):`, err);
      return null;
    }
  },

  set<T>(key: string, data: T) {
    const payload: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  },

  clear(key: string) {
    localStorage.removeItem(key);
  },
  clearByPrefix(prefix: string) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  },
};
