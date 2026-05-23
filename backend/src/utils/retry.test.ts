import test from "node:test";
import assert from "node:assert";
import { withRetry } from "./retry.js";

test("withRetry - succeeds on first attempt", async () => {
  let calls = 0;
  const result = await withRetry(async () => {
    calls++;
    return "success";
  }, { retries: 2, delayMs: 1 });

  assert.strictEqual(result, "success");
  assert.strictEqual(calls, 1);
});

test("withRetry - retries and eventually succeeds", async () => {
  let calls = 0;
  const result = await withRetry(async () => {
    calls++;
    if (calls < 3) {
      throw new Error("Temporary failure");
    }
    return "success";
  }, { retries: 3, delayMs: 1 });

  assert.strictEqual(result, "success");
  assert.strictEqual(calls, 3);
});

test("withRetry - fails after max retries exceeded", async () => {
  let calls = 0;
  await assert.rejects(async () => {
    await withRetry(async () => {
      calls++;
      throw new Error("Persistent failure");
    }, { retries: 2, delayMs: 1 });
  }, /Persistent failure/);

  assert.strictEqual(calls, 3); // 1 initial + 2 retries
});

test("withRetry - respects shouldRetry callback", async () => {
  let calls = 0;
  await assert.rejects(async () => {
    await withRetry(async () => {
      calls++;
      throw new Error("Fatal failure");
    }, {
      retries: 3,
      delayMs: 1,
      shouldRetry: (err) => (err as Error).message !== "Fatal failure"
    });
  }, /Fatal failure/);

  assert.strictEqual(calls, 1); // should not retry on Fatal failure
});
