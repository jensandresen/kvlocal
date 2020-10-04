const mocha = require("mocha");
const { assert } = require("chai");
const TheSut = require("../store");

function sutBuilder(options) {
  const inMemoryStore = new Map();

  if (options && options.seed) {
    for (key in options.seed) {
      inMemoryStore.set(key, options.seed[key]);
    }
  }

  return new TheSut({
    provider: {
      get: (key) =>
        new Promise((resolve) => {
          const value = inMemoryStore.get(key);
          resolve(value);
        }),
      set: (key, value) =>
        new Promise((resolve) => {
          inMemoryStore.set(key, value);
          resolve();
        }),
      exists: (key) =>
        new Promise((resolve) => {
          const result = inMemoryStore.has(key);
          resolve(result);
        }),
    },
  });
}

describe("store", async function () {
  describe("get value", async function () {
    it("returns expected when no values has been added", async function () {
      const sut = sutBuilder();
      const result = await sut.get("foo");

      assert.isUndefined(result);
    });

    it("returns expected when single value has been added", async function () {
      const sut = sutBuilder({
        seed: {
          foo: "bar",
        },
      });
      const result = await sut.get("foo");

      assert.equal(result, "bar");
    });

    it("returns expected when adding single value", async function () {
      const sut = sutBuilder();
      await sut.set("foo", "bar");

      const result = await sut.get("foo");

      assert.equal(result, "bar");
    });

    it("returns expected when overriding existing value", async function () {
      const sut = sutBuilder({
        seed: {
          foo: "bar",
        },
      });

      await sut.set("foo", "another bar");
      const result = await sut.get("foo");

      assert.equal(result, "another bar");
    });

    it("returns expected when checking for existing entry when not exists", async function () {
      const sut = sutBuilder();
      const result = await sut.exists("foo");

      assert.isFalse(result);
    });

    it("returns expected when checking for existing entry", async function () {
      const sut = sutBuilder({
        seed: {
          foo: "bar",
        },
      });

      const result = await sut.exists("foo");

      assert.isTrue(result);
    });
  });
});
