import test from "node:test";
import assert from "node:assert/strict";
import { createPlaybackCoordinator } from "../src/utils/videoPlayback.js";

test("mobile playback enforces 60% visibility and pauses the previous video before the next starts", () => {
  const policy = createPlaybackCoordinator(),
    log = [],
    playing = new Set();
  policy.setEnvironment(true, false);
  const card = (name) =>
    policy.register((active) => {
      log.push([name, active]);
      active ? playing.add(name) : playing.delete(name);
      assert.ok(playing.size <= 1);
    });
  const a = card("Jay"),
    b = card("Abhishek");
  a.update(0.59, true);
  assert.equal(playing.size, 0);
  a.update(0.6, true);
  assert.deepEqual([...playing], ["Jay"]);
  log.length = 0;
  b.update(0.9, true);
  assert.deepEqual([...playing], ["Abhishek"]);
  assert.deepEqual(log, [
    ["Jay", false],
    ["Abhishek", true],
  ]);
  b.update(0.4, true);
  assert.deepEqual([...playing], ["Jay"]);
  a.remove();
  b.remove();
  assert.equal(playing.size, 0);
});

test("desktop visible cards may play together, and hidden tabs, reduced motion, or an open modal pause previews", () => {
  const policy = createPlaybackCoordinator(),
    states = {};
  const a = policy.register((active) => (states.a = active)),
    b = policy.register((active) => (states.b = active));
  a.update(1, true);
  b.update(1, true);
  assert.deepEqual(states, { a: true, b: true });
  policy.setEnvironment(false, true);
  assert.deepEqual(states, { a: false, b: false });
  policy.setEnvironment(false, false);
  assert.deepEqual(states, { a: true, b: true });
  const resume = policy.suspend();
  assert.deepEqual(states, { a: false, b: false });
  const resumeNested = policy.suspend();
  resume();
  assert.deepEqual(states, { a: false, b: false });
  resumeNested();
  resumeNested();
  assert.deepEqual(states, { a: true, b: true });
  a.update(1, false);
  assert.equal(states.a, false); // e.g. reduced motion / blocked play / error
  policy.setEnvironment(true, false);
  assert.deepEqual(states, { a: false, b: true });
  b.update(0, true);
  assert.deepEqual(states, { a: false, b: false });
});
