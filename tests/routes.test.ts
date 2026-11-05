import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDelivery } from "../lib/deliveryArea";
import { DAY_TEXT, PUBLISHED_MAP_CITIES, ROUTE_CITIES, ROUTE_NAME, findRouteCity } from "../data/routes";

const YELLOW = "Mon, Tue, Wed, Thu, Fri, Sat";
const GREEN = "Mon, Wed, Fri, Sat";
const BLUE = "Tue, Thu, Sat";
const ORANGE = "Tue, Sat";
const PURPLE = "Mon, Tue, Thu, Fri";

test("map colors match the towns named on the current map page", () => {
  assert.equal(ROUTE_NAME[findRouteCity("Cheyenne")!.days], "Purple");
  assert.equal(ROUTE_NAME[findRouteCity("Fort Collins")!.days], "Green");
  assert.equal(ROUTE_NAME[findRouteCity("Greeley")!.days], "Green");
  assert.equal(ROUTE_NAME[findRouteCity("Loveland")!.days], "Green");
  assert.equal(ROUTE_NAME[findRouteCity("Windsor")!.days], "Green");
  assert.equal(ROUTE_NAME[findRouteCity("Denver")!.days], "Yellow");
  assert.equal(ROUTE_NAME[findRouteCity("Boulder")!.days], "Yellow");
  assert.equal(ROUTE_NAME[findRouteCity("Evergreen")!.days], "Yellow");
  assert.equal(ROUTE_NAME[findRouteCity("Castle Rock")!.days], "Yellow");
  assert.equal(ROUTE_NAME[findRouteCity("Colorado Springs")!.days], "Blue");
  assert.equal(ROUTE_NAME[findRouteCity("Fountain")!.days], "Blue");
  assert.equal(ROUTE_NAME[findRouteCity("Breckenridge")!.days], "Orange");
  assert.equal(ROUTE_NAME[findRouteCity("Central City")!.days], "Orange");
  assert.equal(ROUTE_NAME[findRouteCity("Black Hawk")!.days], "Orange");
  assert.equal(DAY_TEXT[findRouteCity("Denver")!.days], YELLOW);
  assert.equal(DAY_TEXT[findRouteCity("Fort Collins")!.days], GREEN);
  assert.equal(DAY_TEXT[findRouteCity("Windsor")!.days], GREEN);
  assert.equal(DAY_TEXT[findRouteCity("Colorado Springs")!.days], BLUE);
  assert.equal(DAY_TEXT[findRouteCity("Fountain")!.days], BLUE);
  assert.equal(DAY_TEXT[findRouteCity("Cheyenne")!.days], PURPLE);
  assert.equal(DAY_TEXT[findRouteCity("Breckenridge")!.days], ORANGE);
  assert.equal(DAY_TEXT[findRouteCity("Central City")!.days], ORANGE);
  assert.equal(DAY_TEXT[findRouteCity("Black Hawk")!.days], ORANGE);
  assert.equal(findRouteCity("Keystone"), undefined);
  assert.equal(findRouteCity("Buena Vista"), undefined);
  for (const name of Object.values(ROUTE_NAME)) {
    assert.equal(/\b(mon|tue|wed|thu|fri|sat|sun)/i.test(name), false, name);
  }
});

test("every drawn city is named on the published map, and every published city is drawn", () => {
  const published = new Set(PUBLISHED_MAP_CITIES.map((name) => name.toLowerCase()));
  for (const city of ROUTE_CITIES) {
    const names = [city.name, ...(city.aliases ?? [])].map((name) => name.toLowerCase());
    assert.equal(
      names.some((name) => published.has(name)),
      true,
      city.name,
    );
  }
  for (const name of PUBLISHED_MAP_CITIES) {
    assert.ok(findRouteCity(name), name);
  }
  assert.equal(ROUTE_CITIES.length, PUBLISHED_MAP_CITIES.length);
});

test("towns the current map does not color are not assigned a route", () => {
  assert.equal(findRouteCity("Keystone"), undefined);
  assert.equal(findRouteCity("Buena Vista"), undefined);
});

test("a city the map colors is a yes, and an unlisted town is ask", () => {
  assert.equal(checkDelivery("Denver").status, "yes");
  assert.equal(checkDelivery("Aurora").status, "yes");
  assert.equal(checkDelivery("Aurora").days, YELLOW);
  assert.equal(checkDelivery("Windsor").status, "yes");
  assert.equal(checkDelivery("Windsor").days, GREEN);
  assert.equal(checkDelivery("Fountain").status, "yes");
  assert.equal(checkDelivery("Fountain").days, BLUE);
  assert.equal(checkDelivery("Cheyenne").days, PURPLE);
  assert.equal(checkDelivery("Evergreen").status, "yes");
  assert.equal(checkDelivery("Keystone").status, "ask");
  assert.equal(checkDelivery("Buena Vista").status, "ask");
  assert.equal(checkDelivery("Aspen").status, "ask");
});
