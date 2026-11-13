import { makingUses } from "@/data/making";
import { catalog, type CatalogGroup } from "@/data/products";

export type { MakingSlug, MakingUse } from "@/data/making";
export { findMaking, makingHref, makingSlugsFor, makingUses } from "@/data/making";

/** @deprecated Import `makingUses` in new code. Kept so existing callers keep working. */
export const uses = makingUses;

export function groupsForUse(slug: string): readonly CatalogGroup[] {
  return catalog
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.making.some((tag) => tag === slug)),
    }))
    .filter((group) => group.items.length > 0);
}
