/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StoreProvider, useStore } from "@/components/store-provider";

function CartCount() {
  const { cart } = useStore();
  return createElement("div", { "data-testid": "count" }, cart.reduce((total, item) => total + item.quantity, 0));
}

describe("StoreProvider", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, value: true });
    localStorage.clear();
    document.body.replaceChildren();
  });

  afterEach(() => {
    delete (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT;
  });

  it("hydrates server markup before applying cart state from localStorage", async () => {
    localStorage.setItem(
      "rnt-cart",
      JSON.stringify([
        {
          productId: "rnt-01",
          slug: "strata-runner",
          name: "Strata Runner",
          tone: "chalk",
          color: "Chalk",
          size: 8,
          price: 8490,
          quantity: 2
        }
      ])
    );

    const app = createElement(StoreProvider, null, createElement(CartCount));
    const container = document.createElement("div");
    container.innerHTML = renderToString(app);
    document.body.append(container);

    expect(container.querySelector('[data-testid="count"]')?.textContent).toBe("0");

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    let root: Root | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, app);
      });
      expect(container.querySelector('[data-testid="count"]')?.textContent).toBe("2");
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      if (root) await act(async () => root?.unmount());
      consoleError.mockRestore();
    }
  });
});
