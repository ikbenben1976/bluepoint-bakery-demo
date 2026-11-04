import assert from "node:assert/strict";
import test from "node:test";
import {
  NOTICE_DISMISS_KEY,
  NOTICE_SHOWN_KEY,
  createNoticeStore,
  resetNoticeMemory,
  type KeyValueStore,
} from "../lib/noticeMemory";

function memoryStore(seed: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
  };
}

function blockedStore(): KeyValueStore {
  return {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
}

test("dismissal is stored in the first working store and suppresses the notice", () => {
  resetNoticeMemory();
  const local = memoryStore();
  const session = memoryStore();
  const store = createNoticeStore([local, session]);
  assert.equal(store.suppressed(), false);
  store.remember("dismissed");
  assert.equal(local.data.get(NOTICE_DISMISS_KEY), "1");
  assert.equal(local.data.get(NOTICE_SHOWN_KEY), "1");
  assert.equal(session.data.size, 0);
  assert.equal(store.suppressed(), true);
});

test("showing the notice once is remembered without a dismissal", () => {
  resetNoticeMemory();
  const local = memoryStore();
  const store = createNoticeStore([local]);
  store.remember("shown");
  assert.equal(local.data.get(NOTICE_SHOWN_KEY), "1");
  assert.equal(local.data.has(NOTICE_DISMISS_KEY), false);
  assert.equal(store.suppressed(), true);
});

test("a blocked localStorage falls back to sessionStorage", () => {
  resetNoticeMemory();
  const session = memoryStore();
  const store = createNoticeStore([blockedStore(), session]);
  store.remember("dismissed");
  assert.equal(session.data.get(NOTICE_DISMISS_KEY), "1");
  assert.equal(store.suppressed(), true);
});

test("when every store is blocked, an in-memory fallback still suppresses the notice", () => {
  resetNoticeMemory();
  const store = createNoticeStore([blockedStore(), blockedStore()]);
  store.remember("dismissed");
  assert.equal(store.suppressed(), true);
  assert.equal(createNoticeStore([blockedStore()]).suppressed(), true);
  resetNoticeMemory();
  assert.equal(createNoticeStore([blockedStore()]).suppressed(), false);
});
