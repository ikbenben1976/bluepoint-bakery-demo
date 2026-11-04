export const NOTICE_DISMISS_KEY = "bluepoint-demo-notice";
export const NOTICE_SHOWN_KEY = "bluepoint-demo-notice-shown";

/** Wait long enough that the first paint and early interaction stay unblocked. */
export const NOTICE_DELAY_MS = 6000;

export type KeyValueStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const memory = new Map<string, string>();

export function resetNoticeMemory(): void {
  memory.clear();
}

export function createNoticeStore(stores: readonly KeyValueStore[]) {
  function read(key: string): boolean {
    for (const store of stores) {
      try {
        if (store.getItem(key) === "1") return true;
      } catch {
        // This store is blocked. Try the next fallback.
      }
    }
    return memory.get(key) === "1";
  }

  function write(key: string): void {
    for (const store of stores) {
      try {
        store.setItem(key, "1");
        return;
      } catch {
        // Try the next fallback store.
      }
    }
    memory.set(key, "1");
  }

  return {
    suppressed(): boolean {
      return read(NOTICE_DISMISS_KEY) || read(NOTICE_SHOWN_KEY);
    },
    remember(kind: "shown" | "dismissed"): void {
      if (kind === "dismissed") write(NOTICE_DISMISS_KEY);
      write(NOTICE_SHOWN_KEY);
    },
  };
}

export function browserNoticeStore() {
  const stores: KeyValueStore[] = [];
  if (typeof window !== "undefined") {
    try {
      stores.push(window.localStorage);
    } catch {
      // localStorage can throw when the browser blocks it.
    }
    try {
      stores.push(window.sessionStorage);
    } catch {
      // sessionStorage is the fallback and can also be blocked.
    }
  }
  return createNoticeStore(stores);
}
