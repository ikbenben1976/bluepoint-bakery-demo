/**
 * Wholesale “Why Bluepoint” lines, rewritten in sentence case from the
 * bakery’s values sheets (product, company, selection, value, service,
 * integrity). The sheet photographs are not shown.
 */

export type WhyPillar = {
  title: string;
  body: string;
};

export const whyBluepoint: readonly WhyPillar[] = [
  {
    title: "Fresh, scratch-baked quality",
    body: "Our products are handmade, baked fresh, and delivered in our own trucks, six days a week.",
  },
  {
    title: "Colorado roots since 1987",
    body: "A family-owned Colorado wholesale bakery since 1987.",
  },
  {
    title: "A wide selection for every menu",
    body: "Hundreds of breads, rolls, and pastries, with new products added regularly.",
  },
  {
    title: "Quality that works for your business",
    body: "Quality products, dependable service and practical choices to help you get more from your bakery purchasing.",
  },
  {
    title: "A team that knows wholesale",
    body: "Our experienced sales and customer service team takes time to understand your operation and help you find the right products.",
  },
  {
    title: "Relationships built on trust",
    body: "The entire Bluepoint team is committed to treating you, our customer, with the honesty, integrity, and respect you deserve.",
  },
];
