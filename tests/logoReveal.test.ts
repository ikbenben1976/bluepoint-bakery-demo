import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { publicMentions } from "../data/customers";

const PREVIEW = 6;

test("phone logo grids cap after six cards and keep the reveal control out of wider layouts", () => {
  const restaurants = publicMentions.filter((mention) => mention.audience === "restaurants");
  assert.ok(restaurants.length > PREVIEW);
  assert.deepEqual(
    restaurants.slice(0, PREVIEW).map((mention) => mention.name),
    [
      "The Cherry Cricket",
      "Mountain Sun Pub & Brewery",
      "Oskar Blues Fooderies",
      "Red Cedar Bistro",
      "Revolver Kitchen",
      "The Lobby Denver",
    ],
  );
  for (const audience of ["cafes", "hotels", "institutions"] as const) {
    const count = publicMentions.filter((mention) => mention.audience === audience).length;
    assert.ok(count <= PREVIEW, `${audience} has ${count} logos`);
  }

  const buyer = fs.readFileSync("components/BuyerProof.tsx", "utf8");
  const css = fs.readFileSync("app/brand.css", "utf8");

  assert.match(buyer, /mentions\.length > 6/);
  assert.match(buyer, /data-collapsed=\{capLogos && !logosExpanded \? true : undefined\}/);
  assert.match(buyer, /aria-expanded=\{logosExpanded\}/);
  assert.match(buyer, /aria-controls="audience-logo-grid"/);
  assert.match(buyer, /id="audience-logo-grid"/);
  assert.match(buyer, /className="btn btn-ghost logo-reveal"/);
  assert.match(buyer, /Show fewer/);
  assert.match(buyer, /Show all \$\{mentions\.length\} restaurants/);
  assert.match(buyer, /scrollIntoView|scrollTo/);
  assert.doesNotMatch(buyer, /useEffect/);

  assert.match(css, /\.logo-reveal \{\s*display:\s*none;/);
  const collapse = mediaBlockContaining(css, "(max-width: 767px)", "logo-reveal");
  assert.ok(collapse, "phone media query hides extra logos and shows the button");
  assert.match(collapse, /\[data-collapsed\][^{]*\{[^}]*display:\s*none/);
  assert.match(collapse, /:nth-child\(n \+ 7\)/);
  assert.match(collapse, /\.logo-reveal[\s\S]*width:\s*100%/);
  assert.equal(css.includes(".logo-reveal"), true);
  assert.equal(css.slice(css.indexOf(".logo-reveal")).includes("@media (min-width: 768px)"), false);
});

function mediaBlockContaining(source: string, query: string, needle: string) {
  const opener = `@media ${query} {`;
  let search = 0;
  while (search < source.length) {
    const start = source.indexOf(opener, search);
    if (start < 0) return undefined;
    let depth = 0;
    for (let index = start; index < source.length; index += 1) {
      const char = source[index];
      if (char === "{") depth += 1;
      else if (char === "}") {
        depth -= 1;
        if (depth === 0) {
          const block = source.slice(start, index + 1);
          if (block.includes(needle)) return block;
          search = index + 1;
          break;
        }
      }
    }
  }
  return undefined;
}
