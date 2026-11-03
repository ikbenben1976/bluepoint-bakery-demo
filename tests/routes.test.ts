import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDelivery } from "../lib/deliveryArea";
import { DAY_TEXT, ROUTE_NAME, findRouteCity } from "../data/routes";

const CALL = "Call us for the days on this route";

test("map routes match the towns named on the current map page", () => {
  assert.equal(ROUTE_NAME[findRouteCity("Cheyenne")!.days], "Cheyenne");
  assert.equal(ROUTE_NAME[findRouteCity("Fort Collins")!.days], "North Front Range");
  assert.equal(ROUTE_NAME[findRouteCity("Greeley")!.days], "North Front Range");
  assert.equal(ROUTE_NAME[findRouteCity("Loveland")!.days], "North Front Range");
  assert.equal(ROUTE_NAME[findRouteCity("Windsor")!.days], "North Front Range");
  assert.equal(ROUTE_NAME[findRouteCity("Denver")!.days], "Denver metro");
  assert.equal(ROUTE_NAME[findRouteCity("Boulder")!.days], "Denver metro");
  assert.equal(ROUTE_NAME[findRouteCity("Evergreen")!.days], "Denver metro");
  assert.equal(ROUTE_NAME[findRouteCity("Castle Rock")!.days], "Denver metro");
  assert.equal(ROUTE_NAME[findRouteCity("Colorado Springs")!.days], "Colorado Springs");
  assert.equal(ROUTE_NAME[findRouteCity("Fountain")!.days], "Colorado Springs");
  assert.equal(ROUTE_NAME[findRouteCity("Breckenridge")!.days], "Mountain");
  assert.equal(ROUTE_NAME[findRouteCity("Central City")!.days], "Mountain");
  assert.equal(ROUTE_NAME[findRouteCity("Black Hawk")!.days], "Mountain");
  assert.equal(DAY_TEXT[findRouteCity("Denver")!.days], CALL);
  assert.equal(findRouteCity("Keystone"), undefined);
  assert.equal(findRouteCity("Buena Vista"), undefined);
});

test("towns the current map does not color are not assigned a route", () => {
  assert.equal(findRouteCity("Keystone"), undefined);
  assert.equal(findRouteCity("Buena Vista"), undefined);
});

test("a city the map colors is a yes, and an unlisted town is ask", () => {
  assert.equal(checkDelivery("Denver").status, "yes");
  assert.equal(checkDelivery("Aurora").status, "yes");
  assert.equal(checkDelivery("Aurora").days, CALL);
  assert.equal(checkDelivery("Windsor").status, "yes");
  assert.equal(checkDelivery("Fountain").status, "yes");
  assert.equal(checkDelivery("Fountain").days, CALL);
  assert.equal(checkDelivery("Evergreen").status, "yes");
  assert.equal(checkDelivery("Keystone").status, "ask");
  assert.equal(checkDelivery("Buena Vista").status, "ask");
  assert.equal(checkDelivery("Aspen").status, "ask");
});
