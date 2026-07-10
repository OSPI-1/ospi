import { beforeEach, describe, expect, it } from "vitest";
import { lazyRoutePages, routeFromHash } from "../App";
import { pageMeta } from "../data/pageMeta";

describe("hash route loading", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { hash: "#/" } }
    });
  });

  it("keeps the existing hash route matching", () => {
    expect(routeFromHash()).toBe("home");
    window.location.hash = "#/bazi";
    expect(routeFromHash()).toBe("bazi");
    window.location.hash = "#/liuyao";
    expect(routeFromHash()).toBe("liuyao");
    window.location.hash = "#/meihua";
    expect(routeFromHash()).toBe("meihua");
    window.location.hash = "#/about";
    expect(routeFromHash()).toBe("about");
    window.location.hash = "#/unknown";
    expect(routeFromHash()).toBe("not-found");
  });

  it("declares all non-home pages as top-level lazy routes", () => {
    expect(lazyRoutePages.bazi).toBeDefined();
    expect(lazyRoutePages.liuyao).toBeDefined();
    expect(lazyRoutePages.meihua).toBeDefined();
    expect(lazyRoutePages.about).toBeDefined();
  });

  it("provides metadata for every visible route", () => {
    expect(Object.keys(pageMeta)).toEqual(["home", "bazi", "liuyao", "meihua", "about", "not-found"]);
    for (const meta of Object.values(pageMeta)) {
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
    }
  });
});
